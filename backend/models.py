from sqlalchemy import Column, Integer, String, DateTime, Text,Date, func
from database import Base

class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, nullable=False, index=True)
    password = Column(String(255), nullable=False)
    phone = Column(String(20))
    college = Column(String(150))
    department = Column(String(100))
    year = Column(String(20))
    bio = Column(Text)
    created_at = Column(DateTime, server_default=func.now())
class Skill(Base):
    __tablename__ = "skills"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, nullable=False)
    skill_name = Column(String(100), nullable=False)
    category = Column(String(100))
    level = Column(String(50))
    progress = Column(Integer, default=0)
    created_at = Column(DateTime, server_default=func.now())
class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, nullable=False)
    title = Column(String(150), nullable=False)
    description = Column(Text)
    technologies = Column(String(300))
    github_url = Column(String(300))
    start_date = Column(Date)
    end_date = Column(Date)
    status = Column(String(50))
    created_at = Column(DateTime, server_default=func.now()) 
class Goal(Base):
    __tablename__ = "goals"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, nullable=False)
    title = Column(String(150), nullable=False)
    description = Column(Text)
    target_date = Column(Date)
    progress = Column(Integer, default=0)
    status = Column(String(50), default="In Progress")
    created_at = Column(DateTime, server_default=func.now())   
class Certificate(Base):
    __tablename__ = "certificates"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, nullable=False)
    title = Column(String(150), nullable=False)
    issuer = Column(String(150))
    issue_date = Column(Date)
    certificate_url = Column(String(300))
    file_path = Column(String(300))
    created_at = Column(DateTime, server_default=func.now())    