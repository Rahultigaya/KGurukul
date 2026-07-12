from auth import get_current_user
from sqlalchemy.orm import Session
import models, schemas, crud
from database import engine, SessionLocal
from fastapi import FastAPI, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from fastapi_mail import FastMail, MessageSchema
from database import SessionLocal
import models
from email_config import conf
from fastapi.responses import ORJSONResponse
import random
from datetime import datetime,timedelta
import pytz
from auth import create_access_token, create_refresh_token
from jose import jwt, JWTError
import os
from dotenv import load_dotenv
import cloudinary
import cloudinary.uploader
from models import User, Teacher, Area, Branch, Subject, Batch, Student, Guardian, FullPayment, Installment

# Load environment variables from .env file
load_dotenv()

SECRET_KEY=os.getenv("SECRET_KEY")
ALGORITHM=os.getenv("ALGORITHM")

# Cloudinary Configuration
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET")
)

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

@app.post("/area")
def create_area(area: schemas.AreaCreate, db: Session = Depends(get_db)):
    return crud.create_area(db, area)

@app.get("/areas")
def get_areas(db: Session = Depends(get_db)):
    return crud.get_areas(db)

@app.put("/area/{area_id}")
def update_area(area_id: int, area: schemas.AreaCreate, db: Session = Depends(get_db)):
    updated_area = crud.update_area(db, area_id, area)
    if not updated_area:
        raise HTTPException(status_code=404, detail="Area not found")
    return updated_area

@app.post("/standards")
def create_std(area: schemas.StdCreate, db: Session = Depends(get_db)):
    return crud.create_std(db, area)

@app.get("/standard")
def get_std(db: Session = Depends(get_db)):
    return crud.get_std(db)

@app.put("/standard/{std_id}")
def update_std(std_id: int, std: schemas.StdCreate, db: Session = Depends(get_db)):
    updated_std = crud.update_std(db, std_id, std)
    if not updated_std:
        raise HTTPException(status_code=404, detail="Standard not found")
    return updated_std

@app.post("/branch")
def create_branch(branch: schemas.BranchCreate, db: Session = Depends(get_db)):
    return crud.create_branch(db, branch)

@app.get("/branches")
def get_branches(db: Session = Depends(get_db)):
    return crud.get_branches(db)

@app.put("/branch/{branch_id}")
def update_branch(branch_id: int, branch: schemas.BranchUpdate, db: Session = Depends(get_db)):
    updated_branch = crud.update_branch(db, branch_id, branch)
    if not updated_branch:
        raise HTTPException(status_code=404, detail="Branch not found")
    return updated_branch

@app.post("/subject")
def create_subject(subject: schemas.SubjectCreate, db: Session = Depends(get_db)):
    return crud.create_subject(db, subject)

@app.get("/subjects")
def get_subjects(db: Session = Depends(get_db)):
    return crud.get_subjects(db)

@app.put("/subject/{subject_id}")
def update_subject(subject_id: int, subject: schemas.SubjectCreate, db: Session = Depends(get_db)):
    updated_subject = crud.update_subject(db, subject_id, subject)
    if not updated_subject:
        raise HTTPException(status_code=404, detail="Subject not found")
    return updated_subject

@app.post("/add-batch")
def add_batch(batch: schemas.BatchCreate, db: Session = Depends(get_db)):
    new_batch, error = crud.create_batch(db, batch)
    if error:
        raise HTTPException(status_code=400, detail=error)
    return new_batch

@app.get("/batches")
def get_batches(db: Session = Depends(get_db)):
    return crud.get_batches(db)

@app.put("/batch/{batch_id}")
def update_batch(batch_id: int, batch: schemas.BatchUpdate, db: Session = Depends(get_db)):
    updated_batch = crud.update_batch(db, batch_id, batch)
    if not updated_batch:
        raise HTTPException(status_code=404, detail="Batch not found")
    return updated_batch

@app.get("/batch/{batch_id}")
def get_batch(batch_id: int, db: Session = Depends(get_db)):
    batch = crud.get_batch_by_id(db, batch_id)
    if not batch:
        raise HTTPException(status_code=404, detail="Batch not found")
    return batch

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
        joining_date=datetime.strptime(data.joining_date, "%Y-%m-%d").date(),
        photo=data.photo  # Store Cloudinary URL
    )

    db.add(teacher)
    db.commit()
    db.refresh(teacher)

    return {
        "message": "Teacher created successfully",
        "teacher_id": teacher.id,
        "photo": teacher.photo
    }

@app.put("/teacher/{teacher_id}")
def update_teacher(teacher_id: int, data: schemas.TeacherUpdate, db: Session = Depends(get_db)):
    teacher = db.query(Teacher).filter(Teacher.id == teacher_id).first()
    if not teacher:
        raise HTTPException(status_code=404, detail="Teacher not found")

    if data.first_name is not None:
        teacher.first_name = data.first_name
    if data.middle_name is not None:
        teacher.middle_name = data.middle_name
    if data.last_name is not None:
        teacher.last_name = data.last_name
    if data.photo is not None:
        teacher.photo = data.photo

    # Handle status field - convert "Active"/"Inactive" to isactive 1/0
    if data.status is not None:
        if data.status == "Active":
            teacher.isactive = 1
        elif data.status == "Inactive":
            teacher.isactive = 0
        else:
            raise HTTPException(status_code=400, detail="Status must be 'Active' or 'Inactive'")

    db.commit()
    db.refresh(teacher)

    return {
        "message": "Teacher updated successfully",
        "teacher_id": teacher.id,
        "status": "Active" if teacher.isactive == 1 else "Inactive",
        "photo": teacher.photo
    }

@app.post("/upload-image")
async def upload_image(request: Request):
    try:
        # Check if Cloudinary is configured
        cloud_name = os.getenv("CLOUDINARY_CLOUD_NAME")
        api_key = os.getenv("CLOUDINARY_API_KEY")
        api_secret = os.getenv("CLOUDINARY_API_SECRET")

        if not all([cloud_name, api_key, api_secret]):
            raise HTTPException(
                status_code=500,
                detail=f"Cloudinary not configured properly. Cloud name: {cloud_name}, API key: {api_key}"
            )

        body = await request.json()
        file = body.get("file")  # base64 string
        folder = body.get("folder", "kgurukul")  # folder name

        if not file:
            raise HTTPException(status_code=400, detail="No file provided in request body")

        # Upload to Cloudinary using SDK
        result = cloudinary.uploader.upload(file, folder=folder)
        return {
            "url": result["secure_url"],
            "public_id": result["public_id"],
            "message": "Image uploaded successfully"
        }
    except HTTPException as he:
        raise he
    except Exception as e:
        print(f"Upload error details: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")

@app.get("/test-cloudinary")
def test_cloudinary():
    """Test endpoint to verify Cloudinary configuration"""
    cloud_name = os.getenv("CLOUDINARY_CLOUD_NAME")
    api_key = os.getenv("CLOUDINARY_API_KEY")
    api_secret = os.getenv("CLOUDINARY_API_SECRET")

    return {
        "cloud_name": cloud_name,
        "api_key": api_key,
        "api_secret_set": bool(api_secret),
        "configured": bool(cloud_name and api_key and api_secret)
    }

@app.delete("/delete-image")
async def delete_image(request: Request):
    try:
        body = await request.json()
        public_id = body.get("publicId")

        if not public_id:
            raise HTTPException(status_code=400, detail="No public_id provided")

        # Delete from Cloudinary
        result = cloudinary.uploader.destroy(public_id)
        return {
            "result": result,
            "message": "Image deleted successfully"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Delete failed: {str(e)}")

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
            "status": "Active" if teacher.isactive == 1 else "Inactive",
            "photo": teacher.photo
        })

    return teacher_list


# ─── Student Registration ────────────────────────────────────────────────────────


@app.post("/students", response_class=ORJSONResponse, status_code=201)
def create_student(data: schemas.StudentCreate, db: Session = Depends(get_db)):
    """
    Register a new student.

    Flow:
    1. Creates a User record (role=2 for student) with the student's email & contact.
    2. Creates a Student record linked to that user.
    3. Creates Guardian records.
    4. Creates FullPayment or Installment records based on payment_type.
    """
    student = crud.create_student(db, data)
    return student


@app.get("/students", response_class=ORJSONResponse)
def list_students(
    skip: int = 0,
    limit: int = 100,
    academic_year: str = None,
    db: Session = Depends(get_db)
):
    return crud.get_students(db, skip=skip, limit=limit, academic_year=academic_year)