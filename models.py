from sqlalchemy import Column, Integer, String, DateTime, Text, Date, ForeignKey
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100))
    email = Column(String(100))
    mobile_number = Column(String(10))
    role = Column(Integer)  # 0-admin, 1-parent, 2-student, 3-teacher
    created_by = Column(Integer)
    created_at = Column(DateTime, default=datetime.utcnow)
    isactive = Column(Integer, default=1)
    otp = Column(String(6))
    otp_created_at = Column(DateTime)
    refresh_token = Column(String(500), nullable=True)


class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    photo = Column(Text, nullable=True)
    academic_year = Column(String(20), nullable=False)
    registration_date = Column(Date, nullable=False)
    subject_id = Column(Integer, ForeignKey("subjects.id"), nullable=False)
    branch_id = Column(Integer, ForeignKey("branches.id"), nullable=False)
    standard_id = Column(Integer, ForeignKey("standards.id"), nullable=False)
    course_type = Column(String(50), nullable=False)  # Regular / Crash (Backlog)
    reference = Column(String(255), nullable=True)
    # Personal
    surname = Column(String(100), nullable=False)
    first_name = Column(String(100), nullable=False)
    middle_name = Column(String(100), nullable=True)
    gender = Column(String(20), nullable=False)  # male / female / other
    address = Column(Text, nullable=False)
    school_college_name = Column(String(255), nullable=False)
    # Payment
    payment_type = Column(String(20), nullable=False)  # full / installment / later
    total_fees = Column(String(20), nullable=False)
    discount_amount = Column(String(20), default="0")
    is_active = Column(Integer, default=1)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", backref="student")
    subject = relationship("Subject", backref="students")
    branch = relationship("Branch", backref="students")
    standard = relationship("Standards", backref="students")
    guardians = relationship("Guardian", back_populates="student", cascade="all, delete-orphan")
    full_payment = relationship("FullPayment", uselist=False, cascade="all, delete-orphan")
    installments = relationship("Installment", back_populates="student", cascade="all, delete-orphan")

    # Expose user.email and user.mobile_number as direct attributes for Pydantic
    @property
    def email(self):
        return self.user.email if self.user else ""

    @property
    def contact_no(self):
        return self.user.mobile_number if self.user else ""


class Guardian(Base):
    __tablename__ = "guardians"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False)
    contact = Column(String(15), nullable=False)
    relation = Column(String(50), nullable=False)
    student = relationship("Student", back_populates="guardians")


class FullPayment(Base):
    __tablename__ = "full_payments"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"), unique=True, nullable=False)
    amount = Column(String(20), nullable=False)
    date = Column(Date, nullable=False)
    mode = Column(String(50), nullable=False)  # Cash / UPI / Bank Transfer / Card
    bank_name = Column(String(100), nullable=True)
    paid_to = Column(String(255), nullable=True)
    student = relationship("Student", back_populates="full_payment")


class Installment(Base):
    __tablename__ = "installments"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    amount = Column(String(20), nullable=False)
    date = Column(Date, nullable=False)
    mode = Column(String(50), nullable=False)
    bank_name = Column(String(100), nullable=True)
    paid_to = Column(String(255), nullable=True)
    student = relationship("Student", back_populates="installments")

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
