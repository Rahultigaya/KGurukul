from pydantic import BaseModel

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