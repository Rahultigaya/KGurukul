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

class TeacherResponse(BaseModel):
    id: int
    first_name: str
    middle_name: str
    last_name: str
    email: str
    joining_date: str
    status: str  # Active / Inactive