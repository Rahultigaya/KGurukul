from pydantic import BaseModel, field_validator
from datetime import date
from typing import Optional, Union


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


class StudentUpdate(BaseModel):
    photo: Optional[str] = None
    academic_year: Optional[str] = None
    registration_date: Optional[date] = None
    subject_id: Optional[int] = None
    branch_id: Optional[int] = None
    standard_id: Optional[int] = None
    course_type: Optional[str] = None
    reference: Optional[str] = ""
    # Student name
    surname: Optional[str] = None
    first_name: Optional[str] = None
    middle_name: Optional[str] = ""
    gender: Optional[str] = None
    # User fields (stored in users table)
    email: Optional[str] = None
    contact_no: Optional[str] = None
    # Address & school
    address: Optional[str] = None
    school_college_name: Optional[str] = None
    # Payment
    payment_type: Optional[str] = None
    total_fees: Optional[str] = None
    discount_amount: Optional[str] = "0"
    guardians: Optional[list[GuardianCreate]] = None
    full_payment: Optional[FullPaymentCreate] = None
    installments: Optional[list[InstallmentCreate]] = None



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
    user_id: Optional[int] = None
    photo: Optional[str] = None
    is_active: bool = True
    academic_year: str
    registration_date: date
    course_type: str
    reference: Optional[str] = None
    branch_id: Optional[int] = None
    branch: BranchResponse
    standard_id: Optional[int] = None
    standard: StandardResponse
    subject_id: Optional[int] = None
    subject: SubjectResponse
    first_name: str
    middle_name: Optional[str] = None
    surname: str
    gender: str
    email: str
    contact_no: str
    address: str
    school_college_name: str
    guardians: list[GuardianResponse] = []
    payment_type: str
    total_fees: str
    discount_amount: str
    full_payment: Optional[FullPaymentResponse] = None
    installments: list[InstallmentResponse] = []

    class Config:
        from_attributes = True


class StudentToggleStatusResponse(BaseModel):
    message: str
    id: int
    is_active: bool

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

class TeacherToggleStatusResponse(BaseModel):
    message: str
    id: int
    is_active: bool

    class Config:
        from_attributes = True

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
    name: Optional[str] = None
    area_id: int
    area_name: Optional[str] = None
    branch_id: int
    branch_name: Optional[str] = None
    day: str
    start_time: str
    end_time: str
    time_slot: str
    subject_id: int
    subject_name: Optional[str] = None
    standard_id: int
    standard_name: Optional[str] = None
    teacher_id: int
    teacher_name: Optional[str] = None
    capacity: int
    type: str
    status: str
    student_ids: list[int] = []

    class Config:
        from_attributes = True


class BatchStudentItem(BaseModel):
    id: int
    name: str
    roll_no: str
    contact_no: str
    email: str
    standard: str

    class Config:
        from_attributes = True


class BatchDetailResponse(BaseModel):
    id: int
    name: str
    type: str
    status: str
    area_id: int
    area_name: str
    branch_id: int
    branch_name: str
    day: str
    start_time: str
    end_time: str
    time_slot: str
    subject_id: int
    subject_name: str
    standard_id: int
    standard_name: str
    teacher_id: int
    teacher_name: str
    capacity: int
    created_at: Optional[str] = None
    completed_at: Optional[str] = None
    students: list[BatchStudentItem] = []

    class Config:
        from_attributes = True


class BatchAssignStudentsRequest(BaseModel):
    batch_id: Optional[int] = None
    student_ids: list[int]


class BatchAssignStudentsResponse(BaseModel):
    status: str
    message: str
    batch_id: int
    assigned_count: int

    class Config:
        from_attributes = True


class BatchToggleStatusResponse(BaseModel):
    message: str
    id: int
    status: str
    is_active: bool

    class Config:
        from_attributes = True


# ─── Attendance Schemas ─────────────────────────────────────────────────────────

class AttendanceRecordItem(BaseModel):
    student_id: int
    status: str  # "Present", "Absent", "Recovery"
    remark: Optional[str] = ""
    from_batch_id: Optional[int] = None
    from_batch_name: Optional[str] = None
    missed_date: Optional[Union[date, str]] = None

    @field_validator("missed_date", mode="before")
    @classmethod
    def parse_missed_date(cls, v):
        if not v or v == "":
            return None
        return v

    @field_validator("remark", mode="before")
    @classmethod
    def parse_remark(cls, v):
        if v is None:
            return ""
        return str(v)


class AttendanceCreateRequest(BaseModel):
    batch_id: int
    date: date
    marked_by: Optional[Union[str, int]] = "Admin"
    is_submitted: bool = False
    status: Optional[str] = "draft"
    records: list[AttendanceRecordItem] = []


class AttendanceResponse(BaseModel):
    success: bool
    message: str


class AttendanceRecordResponse(BaseModel):
    student_id: int
    status: str
    remark: Optional[str] = ""
    from_batch_id: Optional[int] = None
    from_batch_name: Optional[str] = None
    missed_date: Optional[str] = None


class AttendanceSessionResponse(BaseModel):
    batch_id: int
    date: str
    marked_by: Optional[str] = "Admin"
    is_submitted: bool
    status: str
    records: list[AttendanceRecordResponse] = []

