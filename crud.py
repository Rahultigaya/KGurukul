from sqlalchemy.orm import Session
import models, schemas

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