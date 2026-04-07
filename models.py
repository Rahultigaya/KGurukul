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
