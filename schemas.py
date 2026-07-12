from pydantic import BaseModel
from datetime import date
from typing import Optional


# ─── Student Schemas ────────────────────────────────────────────────────────────


class GuardianBase(BaseModel):
    name: str
    email: str
    contact: str
    relation: str


class GuardianCreate(GuardianBase):
    pass


class GuardianResponse(GuardianBase):
    id: int

    class Config:
        from_attributes = True


class FullPaymentBase(BaseModel):
    amount: str
    date: Optional[date] = None
    mode: str
    bank_name: Optional[str] = ""
    paid_to: Optional[str] = ""


class FullPaymentCreate(FullPaymentBase):
    date: date


class FullPaymentResponse(FullPaymentBase):
    id: int

    class Config:
        from_attributes = True


class InstallmentBase(BaseModel):
    amount: str
    date: Optional[date] = None
    mode: str
    bank_name: Optional[str] = ""
    paid_to: Optional[str] = ""


class InstallmentCreate(InstallmentBase):
    date: date


class InstallmentResponse(InstallmentBase):
    id: int

    class Config:
        from_attributes = True


class StudentCreate(BaseModel):
    photo: Optional[str] = None
    academic_year: str
    registration_date: date
    subject_id: int
    branch_id: int
    standard_id: int
    course_type: str
    reference: Optional[str] = ""
    # Student name
    surname: str
    first_name: str
    middle_name: Optional[str] = ""
    gender: str
    # User fields (stored in users table)
    email: str
    contact_no: str
    # Address & school
    address: str
    school_college_name: str
    # Payment
    payment_type: str  # full / installment / later
    total_fees: str
    discount_amount: str = "0"
    guardians: list[GuardianCreate] = []
    full_payment: Optional[FullPaymentCreate] = None
    installments: list[InstallmentCreate] = []


class SubjectResponse(BaseModel):
    id: int
    name: str

    class Config:
        from_attributes = True


class BranchResponse(BaseModel):
    id: int
    name: str

    class Config:
        from_attributes = True


class StandardResponse(BaseModel):
    id: int
    name: str

    class Config:
        from_attributes = True


class StudentResponse(BaseModel):
    id: int
    user_id: int
    photo: Optional[str]
    academic_year: str
    registration_date: date
    course_type: str
    reference: Optional[str]
    surname: str
    first_name: str
    middle_name: Optional[str]
    gender: str
    address: str
    school_college_name: str
    payment_type: str
    total_fees: str
    discount_amount: str
    email: str
    contact_no: str
    subject: SubjectResponse
    branch: BranchResponse
    standard: StandardResponse
    guardians: list[GuardianResponse]
    full_payment: Optional[FullPaymentResponse]
    installments: list[InstallmentResponse]

    class Config:
        from_attributes = True

class UserCreate(BaseModel):
    name: str
    email: str
    mobile_number: str
    role: int
    created_by : str

class UserResponse(UserCreate):
    id: int

    class Config:
        from_attributes = True

class ReviewCreate(BaseModel):
    name: str
    org: str
    message: str

class ReviewResponse(ReviewCreate):
    id: int

    class Config:
        from_attributes = True

class TeacherCreate(BaseModel):
    first_name: str
    middle_name: str | None = None
    last_name: str
    email: str
    joining_date: str
    photo: str | None = None  # Cloudinary URL

class TeacherUpdate(BaseModel):
    first_name: str | None = None
    middle_name: str | None = None
    last_name: str | None = None
    status: str | None = None  # Active / Inactive
    photo: str | None = None  # Cloudinary URL

class TeacherResponse(BaseModel):
    id: int
    first_name: str
    middle_name: str
    last_name: str
    email: str
    joining_date: str
    status: str  # Active / Inactive
    photo: str | None = None  # Cloudinary URL

class AreaCreate(BaseModel):
    name: str
    is_active: int = 1

class StdCreate(BaseModel):
    name: str
    is_active: int = 1

class AreaResponse(BaseModel):
    id: int
    name: str
    is_active: int

    class Config:
        from_attributes = True

class BranchCreate(BaseModel):
    name: str
    area_id: int
    is_active: int = 1

class BranchUpdate(BaseModel):
    name: str
    is_active: int

class BranchResponse(BaseModel):
    id: int
    name: str
    area_id: int
    is_active: int

    class Config:
        from_attributes = True

class SubjectCreate(BaseModel):
    name: str
    is_active: int = 1

class SubjectResponse(BaseModel):
    id: int
    name: str
    is_active: int

    class Config:
        from_attributes = True

class BatchCreate(BaseModel):
    area_id: int
    branch_id: int
    day: str
    start_time: str
    end_time: str
    time_slot: str
    subject_id: int
    standard_id: int
    teacher_id: int
    capacity: int
    type: str  # "Regular" or "Premium"
    status: str = "Active"  # "Active" or "Inactive"

class BatchUpdate(BaseModel):
    day: str | None = None
    start_time: str | None = None
    end_time: str | None = None
    time_slot: str | None = None
    subject_id: int | None = None
    standard_id: int | None = None
    teacher_id: int | None = None
    capacity: int | None = None
    type: str | None = None
    status: str | None = None

class BatchResponse(BaseModel):
    id: int
    area_id: int
    branch_id: int
    day: str
    start_time: str
    end_time: str
    time_slot: str
    subject_id: int
    standard_id: int
    teacher_id: int
    capacity: int
    type: str
    status: str

    class Config:
        from_attributes = True