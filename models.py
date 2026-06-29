from sqlalchemy import Column, Integer, String,DateTime, Text,Date, ForeignKey
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100))
    email = Column(String(100))
    mobile_number = Column(String(10))
    role = Column(Integer)  # 0-admin,1-parent,2-student,3-teacher
    created_by = Column(Integer)
    isactive = Column(Integer,default=1)
    otp = Column(String(6))  # ✔ store as string
    otp_created_at = Column(DateTime)
    refresh_token = Column(String(500), nullable=True)

class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100))
    org = Column(String(100))
    message = Column(Text)
    isactive = Column(Integer,default=1)

class Teacher(Base):
    __tablename__ = "teachers"

    id = Column(Integer, primary_key=True, index=True)
    # 🔗 Relation with users table
    user_id = Column(Integer, ForeignKey("users.id"))
    first_name = Column(String(100))
    middle_name = Column(String(100), nullable=True)
    last_name = Column(String(100))
    joining_date = Column(Date)
    photo = Column(String(255), nullable=True)
    isactive = Column(Integer, default=1)

class Area(Base):
    __tablename__ = "areas"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100))
    is_active = Column(Integer, default=1)

class Standards(Base):
    __tablename__ = "standards"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100))
    is_active = Column(Integer, default=1)

class Branch(Base):
    __tablename__ = "branches"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100))
    area_id = Column(Integer, ForeignKey("areas.id"))
    is_active = Column(Integer, default=1)

class Subject(Base):
    __tablename__ = "subjects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100))
    is_active = Column(Integer, default=1)

class Batch(Base):
    __tablename__ = "batches"

    id = Column(Integer, primary_key=True, index=True)
    area_id = Column(Integer, ForeignKey("areas.id"))
    branch_id = Column(Integer, ForeignKey("branches.id"))
    day = Column(String(20))  # Monday, Tuesday, etc.
    start_time = Column(String(20))  # "09:00"
    end_time = Column(String(20))  # "11:00"
    time_slot = Column(String(50))  # "09:00 AM – 11:00 AM"
    subject_id = Column(Integer, ForeignKey("subjects.id"))
    standard_id = Column(Integer, ForeignKey("standards.id"))
    teacher_id = Column(Integer, ForeignKey("teachers.id"))
    capacity = Column(Integer)  # Max students
    type = Column(String(20))  # "Regular" or "Premium"
    status = Column(String(20), default="Active")  # "Active" or "Inactive"
