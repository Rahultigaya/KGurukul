"""Quick test script to debug get_students."""
import sys
sys.path.insert(0, ".")

from database import SessionLocal
import crud

db = SessionLocal()
try:
    result = crud.get_students(db, skip=0, limit=10, academic_year=None)
    print("SUCCESS:", result)
except Exception as e:
    import traceback
    traceback.print_exc()
finally:
    db.close()
