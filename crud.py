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