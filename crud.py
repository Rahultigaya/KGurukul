from sqlalchemy.orm import Session
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


def get_students(db: Session, skip: int = 0, limit: int = 100, academic_year: str = None):
    q = db.query(models.Student).filter(models.Student.is_active == 1)
    if academic_year is not None:
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


def _build_student_response(student, user, subject, branch, standard, guardians, full_payment, installments):
    return {
        "id": student.id,
        "user_id": student.user_id,
        "photo": student.photo,
        "academic_year": student.academic_year,
        "registration_date": student.registration_date,
        "course_type": student.course_type,
        "reference": student.reference,
        "surname": student.surname,
        "first_name": student.first_name,
        "middle_name": student.middle_name,
        "gender": student.gender,
        "address": student.address,
        "school_college_name": student.school_college_name,
        "payment_type": student.payment_type,
        "total_fees": student.total_fees,
        "discount_amount": student.discount_amount,
        "email": user.email if user else "",
        "contact_no": user.mobile_number if user else "",
        "subject": {"id": subject.id, "name": subject.name} if subject else {"id": None, "name": ""},
        "branch": {"id": branch.id, "name": branch.name} if branch else {"id": None, "name": ""},
        "standard": {"id": standard.id, "name": standard.name} if standard else {"id": None, "name": ""},
        "guardians": [
            {
                "id": g.id,
                "name": g.name,
                "email": g.email,
                "contact": g.contact,
                "relation": g.relation,
            } for g in guardians
        ],
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
    return db.query(models.Batch).all()

def get_batch_by_id(db: Session, batch_id: int):
    return db.query(models.Batch).filter(models.Batch.id == batch_id).first()

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