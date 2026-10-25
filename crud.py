from sqlalchemy.orm import Session
from datetime import datetime, date
import models, schemas


def create_student(db: Session, data: schemas.StudentCreate, created_by: int = None):
    # 1. Create User record for the student (role=2)
    user = models.User(
        name=f"{data.first_name} {data.surname}",
        email=data.email,
        mobile_number=data.contact_no,
        role=2,  # student
        created_by=created_by,
    )
    db.add(user)
    db.flush()  # Get user.id

    # 2. Create Student record
    student = models.Student(
        user_id=user.id,
        photo=data.photo,
        academic_year=data.academic_year,
        registration_date=data.registration_date,
        subject_id=data.subject_id,
        branch_id=data.branch_id,
        standard_id=data.standard_id,
        course_type=data.course_type,
        reference=data.reference,
        surname=data.surname,
        first_name=data.first_name,
        middle_name=data.middle_name,
        gender=data.gender,
        address=data.address,
        school_college_name=data.school_college_name,
        payment_type=data.payment_type,
        total_fees=data.total_fees,
        discount_amount=data.discount_amount,
    )
    db.add(student)
    db.flush()  # Get student.id

    # 3. Create Guardian records
    for g in data.guardians:
        db.add(models.Guardian(
            student_id=student.id,
            name=g.name,
            email=g.email,
            contact=g.contact,
            relation=g.relation,
        ))

    # 4. Create Full Payment record
    if data.full_payment:
        db.add(models.FullPayment(
            student_id=student.id,
            amount=data.full_payment.amount,
            date=data.full_payment.date,
            mode=data.full_payment.mode,
            bank_name=data.full_payment.bank_name or "",
            paid_to=data.full_payment.paid_to or "",
        ))

    # 5. Create Installment records
    for inst in data.installments:
        db.add(models.Installment(
            student_id=student.id,
            amount=inst.amount,
            date=inst.date,
            mode=inst.mode,
            bank_name=inst.bank_name or "",
            paid_to=inst.paid_to or "",
        ))

    db.commit()

    # 6. Re-fetch related data manually and build a plain dict response
    student_id = student.id

    user = db.query(models.User).filter(models.User.id == user.id).first()
    student = db.query(models.Student).filter(models.Student.id == student_id).first()
    guardians = db.query(models.Guardian).filter(models.Guardian.student_id == student_id).all()
    full_payment = db.query(models.FullPayment).filter(models.FullPayment.student_id == student_id).first()
    installments = db.query(models.Installment).filter(models.Installment.student_id == student_id).all()

    subject = db.query(models.Subject).filter(models.Subject.id == data.subject_id).first()
    branch = db.query(models.Branch).filter(models.Branch.id == data.branch_id).first()
    standard = db.query(models.Standards).filter(models.Standards.id == data.standard_id).first()

    return _build_student_response(student, user, subject, branch, standard, guardians, full_payment, installments)


def get_students(
    db: Session,
    skip: int = 0,
    limit: int = 100,
    academic_year: str = None,
    is_active: int = None,
    branch_id: int = None,
    subject_id: int = None
):
    q = db.query(models.Student)
    if is_active is not None:
        q = q.filter(models.Student.is_active == is_active)
    if branch_id is not None:
        q = q.filter(models.Student.branch_id == branch_id)
    if subject_id is not None:
        q = q.filter(models.Student.subject_id == subject_id)
    if academic_year is not None and academic_year != "":
        q = q.filter(models.Student.academic_year == academic_year)

    students = q.order_by(models.Student.id.desc()).offset(skip).limit(limit).all()

    results = []
    for student in students:
        user = db.query(models.User).filter(models.User.id == student.user_id).first()
        guardians = db.query(models.Guardian).filter(models.Guardian.student_id == student.id).all()
        full_payment = db.query(models.FullPayment).filter(models.FullPayment.student_id == student.id).first()
        installments = db.query(models.Installment).filter(models.Installment.student_id == student.id).all()
        subject = db.query(models.Subject).filter(models.Subject.id == student.subject_id).first()
        branch = db.query(models.Branch).filter(models.Branch.id == student.branch_id).first()
        standard = db.query(models.Standards).filter(models.Standards.id == student.standard_id).first()
        results.append(_build_student_response(student, user, subject, branch, standard, guardians, full_payment, installments))

    return results


def get_student_by_id(db: Session, student_id: int):
    student = db.query(models.Student).filter(models.Student.id == student_id).first()
    if not student:
        return None

    user = db.query(models.User).filter(models.User.id == student.user_id).first()
    guardians = db.query(models.Guardian).filter(models.Guardian.student_id == student.id).all()
    full_payment = db.query(models.FullPayment).filter(models.FullPayment.student_id == student.id).first()
    installments = db.query(models.Installment).filter(models.Installment.student_id == student.id).all()
    subject = db.query(models.Subject).filter(models.Subject.id == student.subject_id).first()
    branch = db.query(models.Branch).filter(models.Branch.id == student.branch_id).first()
    standard = db.query(models.Standards).filter(models.Standards.id == student.standard_id).first()

    return _build_student_response(student, user, subject, branch, standard, guardians, full_payment, installments)


def update_student(db: Session, student_id: int, data: schemas.StudentUpdate):
    student = db.query(models.Student).filter(models.Student.id == student_id).first()
    if not student:
        return None

    # 1. Update user fields
    if student.user_id:
        user = db.query(models.User).filter(models.User.id == student.user_id).first()
        if user:
            first_name = data.first_name if data.first_name is not None else student.first_name
            surname = data.surname if data.surname is not None else student.surname
            user.name = f"{first_name} {surname}".strip()
            if data.email is not None:
                user.email = data.email
            if data.contact_no is not None:
                user.mobile_number = data.contact_no

    # 2. Update Student fields
    if data.photo is not None:
        student.photo = data.photo
    if data.academic_year is not None:
        student.academic_year = data.academic_year
    if data.registration_date is not None:
        student.registration_date = data.registration_date
    if data.subject_id is not None:
        student.subject_id = data.subject_id
    if data.branch_id is not None:
        student.branch_id = data.branch_id
    if data.standard_id is not None:
        student.standard_id = data.standard_id
    if data.course_type is not None:
        student.course_type = data.course_type
    if data.reference is not None:
        student.reference = data.reference
    if data.surname is not None:
        student.surname = data.surname
    if data.first_name is not None:
        student.first_name = data.first_name
    if data.middle_name is not None:
        student.middle_name = data.middle_name
    if data.gender is not None:
        student.gender = data.gender
    if data.address is not None:
        student.address = data.address
    if data.school_college_name is not None:
        student.school_college_name = data.school_college_name
    if data.payment_type is not None:
        student.payment_type = data.payment_type
    if data.total_fees is not None:
        student.total_fees = data.total_fees
    if data.discount_amount is not None:
        student.discount_amount = data.discount_amount

    # 3. Update Guardians if provided
    if data.guardians is not None:
        db.query(models.Guardian).filter(models.Guardian.student_id == student.id).delete()
        for g in data.guardians:
            db.add(models.Guardian(
                student_id=student.id,
                name=g.name,
                email=g.email,
                contact=g.contact,
                relation=g.relation,
            ))

    # 4. Update Payments
    if data.payment_type is not None or data.full_payment is not None or data.installments is not None:
        db.query(models.FullPayment).filter(models.FullPayment.student_id == student.id).delete()
        db.query(models.Installment).filter(models.Installment.student_id == student.id).delete()

        if data.full_payment:
            db.add(models.FullPayment(
                student_id=student.id,
                amount=data.full_payment.amount,
                date=data.full_payment.date,
                mode=data.full_payment.mode,
                bank_name=data.full_payment.bank_name or "",
                paid_to=data.full_payment.paid_to or "",
            ))
        if data.installments:
            for inst in data.installments:
                db.add(models.Installment(
                    student_id=student.id,
                    amount=inst.amount,
                    date=inst.date,
                    mode=inst.mode,
                    bank_name=inst.bank_name or "",
                    paid_to=inst.paid_to or "",
                ))

    db.commit()
    db.refresh(student)
    return get_student_by_id(db, student.id)


def toggle_student_status(db: Session, student_id: int):
    student = db.query(models.Student).filter(models.Student.id == student_id).first()
    if not student:
        return None

    # Toggle status: 1 -> 0, 0 -> 1
    if student.is_active == 1:
        student.is_active = 0
        is_active = False
        message = "Student deactivated successfully"
    else:
        student.is_active = 1
        is_active = True
        message = "Student activated successfully"

    # Also sync linked user's active status if user exists
    if student.user_id:
        user = db.query(models.User).filter(models.User.id == student.user_id).first()
        if user:
            user.isactive = student.is_active

    db.commit()
    db.refresh(student)

    return {
        "message": message,
        "id": student.id,
        "is_active": is_active
    }



def _build_student_response(student, user, subject, branch, standard, guardians, full_payment, installments):
    return {
        "id": student.id,
        "user_id": student.user_id,
        "photo": student.photo,
        "is_active": bool(student.is_active == 1) if student.is_active is not None else True,
        "academic_year": student.academic_year,
        "registration_date": student.registration_date,
        "course_type": student.course_type,
        "reference": student.reference,
        "branch_id": student.branch_id,
        "branch": {"id": branch.id, "name": branch.name} if branch else {"id": None, "name": ""},
        "standard_id": student.standard_id,
        "standard": {"id": standard.id, "name": standard.name} if standard else {"id": None, "name": ""},
        "subject_id": student.subject_id,
        "subject": {"id": subject.id, "name": subject.name} if subject else {"id": None, "name": ""},
        "first_name": student.first_name,
        "middle_name": student.middle_name,
        "surname": student.surname,
        "gender": student.gender,
        "email": user.email if user else "",
        "contact_no": user.mobile_number if user else "",
        "address": student.address,
        "school_college_name": student.school_college_name,
        "guardians": [
            {
                "id": g.id,
                "name": g.name,
                "relation": g.relation,
                "contact": g.contact,
                "email": g.email,
            } for g in guardians
        ],
        "payment_type": student.payment_type,
        "total_fees": student.total_fees,
        "discount_amount": student.discount_amount,
        "full_payment": {
            "id": full_payment.id,
            "amount": full_payment.amount,
            "date": full_payment.date,
            "mode": full_payment.mode,
            "bank_name": full_payment.bank_name,
            "paid_to": full_payment.paid_to,
        } if full_payment else None,
        "installments": [
            {
                "id": i.id,
                "amount": i.amount,
                "date": i.date,
                "mode": i.mode,
                "bank_name": i.bank_name,
                "paid_to": i.paid_to,
            } for i in installments
        ],
    }

def create_user(db: Session, user: schemas.UserCreate):
    db_user = models.User(name=user.name, email=user.email,mobile_number=user.mobile_number,role=user.role,created_by=user.created_by)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_users(db: Session):
    return db.query(models.User).all()

def create_review(db, review):
    db_review = models.Review(
        name=review.name,
        org=review.org,
        message=review.message
    )
    db.add(db_review)
    db.commit()
    db.refresh(db_review)
    return db_review

def get_reviews(db):
    # return db.query(models.Review).all()
    return db.query(models.Review).filter(models.Review.isactive == 1).all()

def create_area(db: Session, area: schemas.AreaCreate):
    db_area = models.Area(name=area.name, is_active=area.is_active)
    db.add(db_area)
    db.commit()
    db.refresh(db_area)
    return db_area

def get_areas(db: Session):
    return db.query(models.Area).all()

def update_area(db: Session, area_id: int, area: schemas.AreaCreate):
    db_area = db.query(models.Area).filter(models.Area.id == area_id).first()
    if not db_area:
        return None
    db_area.name = area.name
    db_area.is_active = area.is_active
    db.commit()
    db.refresh(db_area)
    return db_area

def create_std(db: Session, StdCreate: schemas.StdCreate):
    db_area = models.Standards(name=StdCreate.name, is_active=StdCreate.is_active)
    db.add(db_area)
    db.commit()
    db.refresh(db_area)
    return db_area

def get_std(db: Session):
    return db.query(models.Standards).all()

def update_std(db: Session, std_id: int, std: schemas.StdCreate):
    db_std = db.query(models.Standards).filter(models.Standards.id == std_id).first()
    if not db_std:
        return None
    db_std.name = std.name
    db_std.is_active = std.is_active
    db.commit()
    db.refresh(db_std)
    return db_std

def create_branch(db: Session, branch: schemas.BranchCreate):
    db_branch = models.Branch(name=branch.name, area_id=branch.area_id, is_active=branch.is_active)
    db.add(db_branch)
    db.commit()
    db.refresh(db_branch)
    return db_branch

def get_branches(db: Session):
    return db.query(models.Branch).all()

def update_branch(db: Session, branch_id: int, branch: schemas.BranchUpdate):
    db_branch = db.query(models.Branch).filter(models.Branch.id == branch_id).first()
    if not db_branch:
        return None
    # Only update name and is_active, not area_id (as per user requirement)
    db_branch.name = branch.name
    db_branch.is_active = branch.is_active
    db.commit()
    db.refresh(db_branch)
    return db_branch

def create_subject(db: Session, subject: schemas.SubjectCreate):
    db_subject = models.Subject(name=subject.name, is_active=subject.is_active)
    db.add(db_subject)
    db.commit()
    db.refresh(db_subject)
    return db_subject

def get_subjects(db: Session):
    return db.query(models.Subject).all()

def update_subject(db: Session, subject_id: int, subject: schemas.SubjectCreate):
    db_subject = db.query(models.Subject).filter(models.Subject.id == subject_id).first()
    if not db_subject:
        return None
    db_subject.name = subject.name
    db_subject.is_active = subject.is_active
    db.commit()
    db.refresh(db_subject)
    return db_subject

def create_batch(db: Session, batch: schemas.BatchCreate):
    # Verify that the area exists
    area = db.query(models.Area).filter(models.Area.id == batch.area_id).first()
    if not area:
        return None, f"Area with id {batch.area_id} does not exist"

    # Verify that the branch exists and belongs to the area
    branch = db.query(models.Branch).filter(
        models.Branch.id == batch.branch_id
    ).first()
    if not branch:
        return None, f"Branch with id {batch.branch_id} does not exist"
    if branch.area_id != batch.area_id:
        return None, f"Branch with id {batch.branch_id} does not belong to area {batch.area_id} (branch belongs to area {branch.area_id})"

    # Verify that the subject exists
    subject = db.query(models.Subject).filter(models.Subject.id == batch.subject_id).first()
    if not subject:
        return None, f"Subject with id {batch.subject_id} does not exist"

    # Verify that the standard exists
    standard = db.query(models.Standards).filter(models.Standards.id == batch.standard_id).first()
    if not standard:
        return None, f"Standard with id {batch.standard_id} does not exist"

    # Verify that the teacher exists in Teachers model
    teacher = db.query(models.Teacher).filter(models.Teacher.id == batch.teacher_id).first()
    if not teacher:
        return None, f"Teacher with id {batch.teacher_id} does not exist in teachers table"

    db_batch = models.Batch(
        area_id=batch.area_id,
        branch_id=batch.branch_id,
        day=batch.day,
        start_time=batch.start_time,
        end_time=batch.end_time,
        time_slot=batch.time_slot,
        subject_id=batch.subject_id,
        standard_id=batch.standard_id,
        teacher_id=batch.teacher_id,
        capacity=batch.capacity,
        type=batch.type,
        status=batch.status
    )
    db.add(db_batch)
    db.commit()
    db.refresh(db_batch)
    return db_batch, None

def get_batches(db: Session):
    batches = db.query(models.Batch).all()
    areas = {a.id: a.name for a in db.query(models.Area).all()}
    branches = {b.id: b.name for b in db.query(models.Branch).all()}
    subjects = {s.id: s.name for s in db.query(models.Subject).all()}
    standards = {st.id: st.name for st in db.query(models.Standards).all()}
    teachers = {t.id: " ".join(filter(None, [t.first_name, t.last_name])) for t in db.query(models.Teacher).all()}

    batch_students_map = {}
    for bs in db.query(models.BatchStudent).filter(models.BatchStudent.status == 1).all():
        batch_students_map.setdefault(bs.batch_id, []).append(bs.student_id)

    result = []
    for batch in batches:
        area_name = areas.get(batch.area_id, "")
        branch_name = branches.get(batch.branch_id, "")
        subject_name = subjects.get(batch.subject_id, "")
        standard_name = standards.get(batch.standard_id, "")
        teacher_name = teachers.get(batch.teacher_id, "")

        time_display = batch.time_slot or (f"{batch.start_time} – {batch.end_time}" if batch.start_time and batch.end_time else "")
        parts = [p for p in [area_name, branch_name, batch.day, time_display] if p]
        name = " – ".join(parts) if parts else f"Batch {batch.id}"

        result.append({
            "id": batch.id,
            "name": name,
            "area_id": batch.area_id,
            "area_name": area_name,
            "branch_id": batch.branch_id,
            "branch_name": branch_name,
            "day": batch.day,
            "start_time": batch.start_time,
            "end_time": batch.end_time,
            "time_slot": batch.time_slot,
            "subject_id": batch.subject_id,
            "subject_name": subject_name,
            "standard_id": batch.standard_id,
            "standard_name": standard_name,
            "teacher_id": batch.teacher_id,
            "teacher_name": teacher_name,
            "capacity": batch.capacity,
            "type": batch.type,
            "status": batch.status,
            "student_ids": batch_students_map.get(batch.id, [])
        })
    return result

def get_batch_by_id(db: Session, batch_id: int):
    batch = db.query(models.Batch).filter(models.Batch.id == batch_id).first()
    if not batch:
        return None

    area = db.query(models.Area).filter(models.Area.id == batch.area_id).first() if batch.area_id else None
    branch = db.query(models.Branch).filter(models.Branch.id == batch.branch_id).first() if batch.branch_id else None
    subject = db.query(models.Subject).filter(models.Subject.id == batch.subject_id).first() if batch.subject_id else None
    standard = db.query(models.Standards).filter(models.Standards.id == batch.standard_id).first() if batch.standard_id else None
    teacher = db.query(models.Teacher).filter(models.Teacher.id == batch.teacher_id).first() if batch.teacher_id else None

    area_name = area.name if area else ""
    branch_name = branch.name if branch else ""
    subject_name = subject.name if subject else ""
    standard_name = standard.name if standard else ""
    teacher_name = " ".join(filter(None, [teacher.first_name, teacher.last_name])) if teacher else ""

    # Name: "Thane – Khopat – Monday – 09:00 AM – 10:30 AM"
    time_display = batch.time_slot or (f"{batch.start_time} – {batch.end_time}" if batch.start_time and batch.end_time else "")
    parts = [p for p in [area_name, branch_name, batch.day, time_display] if p]
    name = " – ".join(parts) if parts else f"Batch {batch.id}"

    # Assigned students
    batch_students = db.query(models.BatchStudent).filter(
        models.BatchStudent.batch_id == batch.id,
        models.BatchStudent.status == 1
    ).all()

    student_list = []
    for bs in batch_students:
        st = db.query(models.Student).filter(models.Student.id == bs.student_id).first()
        if not st:
            continue
        user = db.query(models.User).filter(models.User.id == st.user_id).first() if st.user_id else None
        st_std = db.query(models.Standards).filter(models.Standards.id == st.standard_id).first() if st.standard_id else None

        student_list.append({
            "id": st.id,
            "name": " ".join(filter(None, [st.first_name, st.surname])),
            "roll_no": f"STU-{st.id:04d}",
            "contact_no": user.mobile_number if user else "",
            "email": user.email if user else "",
            "standard": st_std.name if st_std else ""
        })

    created_at_str = batch.created_at.strftime("%Y-%m-%d") if getattr(batch, "created_at", None) else None
    completed_at_str = batch.completed_at.strftime("%Y-%m-%d") if getattr(batch, "completed_at", None) else None

    return {
        "id": batch.id,
        "name": name,
        "type": batch.type,
        "status": batch.status,
        "area_id": batch.area_id,
        "area_name": area_name,
        "branch_id": batch.branch_id,
        "branch_name": branch_name,
        "day": batch.day,
        "start_time": batch.start_time,
        "end_time": batch.end_time,
        "time_slot": batch.time_slot,
        "subject_id": batch.subject_id,
        "subject_name": subject_name,
        "standard_id": batch.standard_id,
        "standard_name": standard_name,
        "teacher_id": batch.teacher_id,
        "teacher_name": teacher_name,
        "capacity": batch.capacity,
        "created_at": created_at_str,
        "completed_at": completed_at_str,
        "students": student_list
    }

def update_batch(db: Session, batch_id: int, batch: schemas.BatchUpdate):
    db_batch = db.query(models.Batch).filter(models.Batch.id == batch_id).first()
    if not db_batch:
        return None
    # Update only the fields that are provided
    if batch.day is not None:
        db_batch.day = batch.day
    if batch.start_time is not None:
        db_batch.start_time = batch.start_time
    if batch.end_time is not None:
        db_batch.end_time = batch.end_time
    if batch.time_slot is not None:
        db_batch.time_slot = batch.time_slot
    if batch.subject_id is not None:
        db_batch.subject_id = batch.subject_id
    if batch.standard_id is not None:
        db_batch.standard_id = batch.standard_id
    if batch.teacher_id is not None:
        db_batch.teacher_id = batch.teacher_id
    if batch.capacity is not None:
        db_batch.capacity = batch.capacity
    if batch.type is not None:
        db_batch.type = batch.type
    if batch.status is not None:
        db_batch.status = batch.status
    db.commit()
    db.refresh(db_batch)
    return db_batch


def toggle_teacher_status(db: Session, teacher_id: int):
    teacher = db.query(models.Teacher).filter(models.Teacher.id == teacher_id).first()
    if not teacher:
        return None

    # Toggle status: 1 -> 0, 0 -> 1
    if teacher.isactive == 1:
        teacher.isactive = 0
        is_active = False
        message = "Teacher deactivated successfully"
    else:
        teacher.isactive = 1
        is_active = True
        message = "Teacher activated successfully"

    # Also sync linked user's active status if user exists
    if teacher.user_id:
        user = db.query(models.User).filter(models.User.id == teacher.user_id).first()
        if user:
            user.isactive = teacher.isactive

    db.commit()
    db.refresh(teacher)

    return {
        "message": message,
        "id": teacher.id,
        "is_active": is_active
    }


def assign_students_to_batch(db: Session, batch_id: int, student_ids: list[int]):
    batch = db.query(models.Batch).filter(models.Batch.id == batch_id).first()
    if not batch:
        return None, "Batch not found"

    assigned_count = 0
    for sid in student_ids:
        student = db.query(models.Student).filter(models.Student.id == sid).first()
        if not student:
            continue

        existing = db.query(models.BatchStudent).filter(
            models.BatchStudent.batch_id == batch_id,
            models.BatchStudent.student_id == sid
        ).first()

        if existing:
            existing.status = 1
        else:
            new_bs = models.BatchStudent(
                batch_id=batch_id,
                student_id=sid,
                status=1
            )
            db.add(new_bs)

        assigned_count += 1

    db.commit()

    return {
        "status": "success",
        "message": "Students assigned to batch successfully",
        "batch_id": batch_id,
        "assigned_count": assigned_count
    }, None


def toggle_batch_status(db: Session, batch_id: int):
    batch = db.query(models.Batch).filter(models.Batch.id == batch_id).first()
    if not batch:
        return None

    if batch.status == "Active":
        batch.status = "Inactive"
        is_active = False
        message = "Batch deactivated successfully"
    else:
        batch.status = "Active"
        is_active = True
        message = "Batch activated successfully"

    db.commit()
    db.refresh(batch)

    return {
        "message": message,
        "id": batch.id,
        "status": batch.status,
        "is_active": is_active
    }


# ─── Attendance CRUD ───────────────────────────────────────────────────────────

def save_attendance(db: Session, data: schemas.AttendanceCreateRequest):
    # 1. Verify batch exists
    batch = db.query(models.Batch).filter(models.Batch.id == data.batch_id).first()
    if not batch:
        return None, f"Batch with id {data.batch_id} does not exist"

    # 2. Determine is_submitted flag (0 for draft, 1 for submitted)
    is_sub = 1 if (data.is_submitted or (data.status and data.status.lower() == "submitted")) else 0

    # 3. Resolve marked_by user ID
    user_id = None
    if data.marked_by is not None:
        marked_str = str(data.marked_by).strip()
        if marked_str.isdigit():
            user = db.query(models.User).filter(models.User.id == int(marked_str)).first()
            if user:
                user_id = user.id
        if not user_id:
            user = db.query(models.User).filter(models.User.name == marked_str).first()
            if not user:
                user = db.query(models.User).filter(models.User.email == marked_str).first()
            if user:
                user_id = user.id
            else:
                admin_user = db.query(models.User).filter(models.User.role == 0).first()
                if admin_user:
                    user_id = admin_user.id

    # 4. Find or create AttendanceSession
    session = db.query(models.AttendanceSession).filter(
        models.AttendanceSession.batch_id == data.batch_id,
        models.AttendanceSession.date == data.date
    ).first()

    if session:
        session.is_submitted = is_sub
        if user_id:
            session.marked_by = user_id
        session.updated_at = datetime.utcnow()
        session.records.clear()
        db.flush()
    else:
        session = models.AttendanceSession(
            batch_id=data.batch_id,
            date=data.date,
            marked_by=user_id,
            is_submitted=is_sub,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        db.add(session)
        db.flush()

    # 5. Add attendance records
    for rec in data.records:
        rec_status_str = str(rec.status).strip().lower()
        if rec_status_str in ["present", "1", "true"]:
            status_val = 1
            is_recovery_val = 1 if rec.from_batch_id else 0
        elif rec_status_str in ["recovery"]:
            status_val = 1
            is_recovery_val = 1
        elif rec_status_str in ["absent", "0", "false"]:
            status_val = 0
            is_recovery_val = 0
        else:
            status_val = 0
            is_recovery_val = 0

        from_b_id = rec.from_batch_id if is_recovery_val else None
        m_date = rec.missed_date if is_recovery_val else None

        db_record = models.AttendanceRecord(
            attendance_session_id=session.id,
            student_id=rec.student_id,
            status=status_val,
            remark=rec.remark or "",
            is_recovery=is_recovery_val,
            from_batch_id=from_b_id,
            missed_date=m_date,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        db.add(db_record)

    db.commit()
    db.refresh(session)
    return session, None


def get_attendance(db: Session, batch_id: int, attendance_date: date):
    session = db.query(models.AttendanceSession).filter(
        models.AttendanceSession.batch_id == batch_id,
        models.AttendanceSession.date == attendance_date
    ).first()

    if not session:
        return None

    records = []
    for r in session.records:
        from_b_name = None
        if r.from_batch_id:
            fb = db.query(models.Batch).filter(models.Batch.id == r.from_batch_id).first()
            if fb:
                fb_std = db.query(models.Standards).filter(models.Standards.id == fb.standard_id).first() if fb.standard_id else None
                fb_subj = db.query(models.Subject).filter(models.Subject.id == fb.subject_id).first() if fb.subject_id else None
                fb_area = db.query(models.Area).filter(models.Area.id == fb.area_id).first() if fb.area_id else None
                fb_branch = db.query(models.Branch).filter(models.Branch.id == fb.branch_id).first() if fb.branch_id else None

                std_subj = f"{fb_std.name} {fb_subj.name}".strip() if (fb_std and fb_subj) else ""
                parts = [p for p in [fb_area.name if fb_area else "", fb_branch.name if fb_branch else "", fb.day, fb.time_slot] if p]
                full_slot = " – ".join(parts) if parts else ""
                from_b_name = std_subj or full_slot or f"Batch {fb.id}"

        status_str = "Recovery" if r.is_recovery == 1 else ("Present" if r.status == 1 else "Absent")

        rec_item = {
            "student_id": r.student_id,
            "status": status_str,
            "remark": r.remark or ""
        }
        if r.is_recovery == 1 or r.from_batch_id is not None:
            rec_item["from_batch_id"] = r.from_batch_id
            rec_item["from_batch_name"] = from_b_name
            rec_item["missed_date"] = str(r.missed_date) if r.missed_date else None

        records.append(rec_item)

    marked_by_name = None
    if session.marked_by:
        u = db.query(models.User).filter(models.User.id == session.marked_by).first()
        marked_by_name = u.name if u else str(session.marked_by)

    return {
        "batch_id": session.batch_id,
        "date": str(session.date),
        "marked_by": marked_by_name or "Admin",
        "is_submitted": bool(session.is_submitted),
        "status": "submitted" if session.is_submitted == 1 else "draft",
        "records": records
    }


def get_batch_attendance_dates(db: Session, batch_id: int):
    batch = db.query(models.Batch).filter(models.Batch.id == batch_id).first()
    if not batch:
        return None, f"Batch with id {batch_id} not found"

    results = db.query(models.AttendanceSession.date).filter(
        models.AttendanceSession.batch_id == batch_id
    ).order_by(models.AttendanceSession.date.desc()).distinct().all()

    dates = [str(r[0]) for r in results]
    return dates, None



