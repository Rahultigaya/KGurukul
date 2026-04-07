from auth import get_current_user
from sqlalchemy.orm import Session
import models, schemas, crud
from database import engine, SessionLocal
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi_mail import FastMail, MessageSchema
from database import SessionLocal
import models
from email_config import conf
import random
from datetime import datetime,timedelta
import pytz
from auth import create_access_token, create_refresh_token
from jose import jwt, JWTError
import os
from models import User, Teacher

SECRET_KEY=os.getenv("SECRET_KEY")
ALGORITHM=os.getenv("ALGORITHM")

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# CORS (important for React)
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/users")
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    return crud.create_user(db, user)

@app.get("/users")
def read_users(db: Session = Depends(get_db)):
    return crud.get_users(db)

@app.post("/reviews")
def add_review(review: schemas.ReviewCreate, db: Session = Depends(get_db)):
    return crud.create_review(db, review)

@app.get("/reviews")
def get_all_reviews(db: Session = Depends(get_db)):
    return crud.get_reviews(db)

@app.post("/send-otp")
async def send_otp(email: str, db: Session = Depends(get_db)):
    
    user = db.query(models.User).filter(models.User.email == email,models.User.isactive == 1).first()

    if not user:
        raise HTTPException(status_code=404, detail="Email not found")
    
    # 🔒 RATE LIMIT (30 seconds)
    if user.otp_created_at and datetime.utcnow() < user.otp_created_at + timedelta(seconds=30):
        raise HTTPException(
            status_code=400,
            detail="OTP already Sent to this Email"
        )

    otp = str(random.randint(100000, 999999))

    ist = pytz.timezone("Asia/Kolkata")

    # Save OTP in DB
    user.otp = otp
    user.otp_created_at = datetime.now(ist)
    db.commit()

    # Send email
    message = MessageSchema(
    subject="Your Login OTP Code",
    recipients=[email],
    body=f"""
    <html>
    <body style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 20px;">
        
        <div style="max-width: 500px; margin: auto; background: white; padding: 30px; border-radius: 10px; text-align: center;">
            
            <h2 style="color: #333;">🔐 Login Verification</h2>
            
            <p style="font-size: 16px; color: #555;">
                Use the OTP below to login to your account
            </p>
            
            <div style="font-size: 28px; font-weight: bold; letter-spacing: 5px; 
                        background: #f1f5f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
                {otp}
            </div>

            <p style="color: #888; font-size: 14px;">
                This OTP is valid for <b>10 minutes</b>.
            </p>

            <p style="color: #888; font-size: 12px; margin-top: 20px;">
                If you did not request this, please ignore this email.
            </p>

        </div>

    </body>
    </html>
    """,
    subtype="html"
    )

    fm = FastMail(conf)
    await fm.send_message(message)

    return {"message": "OTP sent successfully"}

@app.post("/verify-otp")
def verify_otp(email: str, otp: str, db: Session = Depends(get_db)):

    user = db.query(models.User).filter(
        models.User.email == email,
        models.User.isactive == 1
    ).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if user.otp != otp:
        raise HTTPException(status_code=400, detail="Invalid OTP")

    access_token = create_access_token({
        "user_id": user.id,
        "email": user.email,
        "role": user.role
    })

    refresh_token = create_refresh_token({
        "user_id": user.id
    })

    # Save refresh token
    user.refresh_token = refresh_token
    user.otp = None
    user.otp_created_at = None
    db.commit()

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }

@app.post("/refresh-token")
def refresh_token_api(refresh_token: str, db: Session = Depends(get_db)):

    try:
        payload = jwt.decode(refresh_token, SECRET_KEY, algorithms=[ALGORITHM])

        if payload.get("type") != "refresh":
            raise HTTPException(status_code=401, detail="Invalid token type")

        user_id = payload.get("user_id")

    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid refresh token")

    user = db.query(models.User).filter(models.User.id == user_id).first()

    if not user or user.refresh_token != refresh_token:
        raise HTTPException(status_code=401, detail="Unauthorized")

    # ✅ Generate new access token
    new_access_token = create_access_token({
        "user_id": user.id,
        "email": user.email,
        "role": user.role
    })

    return {
        "access_token": new_access_token
    }

@app.post("/logout")
def logout(user=Depends(get_current_user), db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.id == user["user_id"]).first()
    db_user.refresh_token = None
    db.commit()
    return {"message": "Logged out"}

@app.post("/create-teacher")
def create_teacher(data: schemas.TeacherCreate, db: Session = Depends(get_db)):

    existing = db.query(User).filter(User.email == data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already exists")

    # Create user
    user = User(email=data.email, role=3)
    db.add(user)
    db.commit()
    db.refresh(user)

    # Create teacher
    teacher = Teacher(
        user_id=user.id,
        first_name=data.first_name,
        middle_name=data.middle_name,
        last_name=data.last_name,
        joining_date=datetime.strptime(data.joining_date, "%Y-%m-%d").date()
    )

    db.add(teacher)
    db.commit()

    return {"message": "Teacher created successfully"}

@app.get("/teachers", response_model=list[schemas.TeacherResponse])
def get_teachers(db: Session = Depends(get_db)):

    results = db.query(Teacher, User).join(
        User, Teacher.user_id == User.id
    ).all()

    teacher_list = []

    for teacher, user in results:
        teacher_list.append({
            "id": teacher.id,
            "first_name": teacher.first_name,
            "middle_name": teacher.middle_name,
            "last_name": teacher.last_name,
            "email": user.email,
            "joining_date": str(teacher.joining_date),
            "status": "Active" if teacher.isactive == 1 else "Inactive"
        })

    return teacher_list