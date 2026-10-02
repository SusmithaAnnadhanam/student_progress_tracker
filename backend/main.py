from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
import jwt
import  os 
import shutil 
from datetime import date
from fastapi.staticfiles import StaticFiles

from database import Base, engine, get_db
from models import Student, Skill,Project,Goal, Certificate
from auth import hash_password, verify_password, create_access_token, SECRET_KEY, ALGORITHM

Base.metadata.create_all(bind=engine)

app = FastAPI()
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")
security = HTTPBearer()
def get_current_student(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    token = credentials.credentials

    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        student_id = payload.get("student_id")

        if student_id is None:
            raise HTTPException(
                status_code=401,
                detail="Invalid token"
            )

    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token"
        )

    student = db.query(Student).filter(
        Student.id == student_id
    ).first()

    if not student:
        raise HTTPException(
            status_code=401,
            detail="Student not found"
        )

    return student
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

@app.get("/")
def home():
    return {"message": "Student Progress Tracker API is running"}

@app.post("/register")
def register(data: RegisterRequest, db: Session = Depends(get_db)):

    existing_student = db.query(Student).filter(
        Student.email == data.email
    ).first()

    if existing_student:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    student = Student(
        name=data.name,
        email=data.email,
        password=hash_password(data.password)
    )

    db.add(student)
    db.commit()
    db.refresh(student)

    return {
        "message": "Student registered successfully",
        "student_id": student.id
    }

@app.post("/login")
def login(data: LoginRequest, db: Session = Depends(get_db)):

    student = db.query(Student).filter(
        Student.email == data.email
    ).first()

    if not student:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    if not verify_password(data.password, student.password):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    token = create_access_token(student.id)

    return {
        "message": "Login successful",
        "access_token": token,
        "token_type": "bearer"
    }
@app.get("/me")
def get_my_profile(
    student: Student = Depends(get_current_student)
):
    return {
        "id": student.id,
        "name": student.name,
        "email": student.email
    }
from pydantic import BaseModel, EmailStr, Field

class ProfileRequest(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    phone: str = Field(default="", max_length=20)
    college: str = Field(default="", max_length=150)
    department: str = Field(default="", max_length=100)
    year: str = Field(default="", max_length=20)
    bio: str = Field(default="", max_length=500)


@app.get("/profile")
def get_profile(
    student: Student = Depends(get_current_student)
):
    return {
        "id": student.id,
        "name": student.name,
        "email": student.email,
        "phone": student.phone,
        "college": student.college,
        "department": student.department,
        "year": student.year,
        "bio": student.bio
    }


@app.put("/profile")
def update_profile(
    data: ProfileRequest,
    student: Student = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    student.name = data.name
    student.email = data.email
    student.phone = data.phone
    student.college = data.college
    student.department = data.department
    student.year = data.year
    student.bio = data.bio

    db.commit()
    db.refresh(student)

    return {
        "message": "Profile updated successfully"
    }
class SkillRequest(BaseModel):
    skill_name: str
    category: str = ""
    level: str = ""
    progress: int = 0
@app.post("/skills")
def add_skill(
    data: SkillRequest,
    student: Student = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    if data.progress < 0 or data.progress > 100:
        raise HTTPException(
            status_code=400,
            detail="Progress must be between 0 and 100"
        )

    skill = Skill(
        student_id=student.id,
        skill_name=data.skill_name,
        category=data.category,
        level=data.level,
        progress=data.progress
    )

    db.add(skill)
    db.commit()
    db.refresh(skill)

    return {
        "message": "Skill added successfully",
        "skill_id": skill.id
    }
@app.put("/skills/{skill_id}")
def update_skill(
    skill_id: int,
    data: SkillRequest,
    student: Student = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    skill = db.query(Skill).filter(
        Skill.id == skill_id,
        Skill.student_id == student.id
    ).first()

    if not skill:
        raise HTTPException(
            status_code=404,
            detail="Skill not found"
        )

    if data.progress < 0 or data.progress > 100:
        raise HTTPException(
            status_code=400,
            detail="Progress must be between 0 and 100"
        )

    skill.skill_name = data.skill_name
    skill.category = data.category
    skill.level = data.level
    skill.progress = data.progress

    db.commit()
    db.refresh(skill)

    return {
        "message": "Skill updated successfully"
    }
@app.delete("/skills/{skill_id}")
def delete_skill(
    skill_id: int,
    student: Student = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    skill = db.query(Skill).filter(
        Skill.id == skill_id,
        Skill.student_id == student.id
    ).first()

    if not skill:
        raise HTTPException(
            status_code=404,
            detail="Skill not found"
        )

    db.delete(skill)
    db.commit()

    return {
        "message": "Skill deleted successfully"
    }
@app.get("/skills")
def get_skills(
    student: Student = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    skills = db.query(Skill).filter(
        Skill.student_id == student.id
    ).all()

    return skills
class ProjectRequest(BaseModel):
    title: str
    description: str = ""
    technologies: str = ""
    github_url: str = ""
    start_date: str = ""
    end_date: str = ""
    status: str = "In Progress"
@app.get("/projects")
def get_projects(
    student: Student = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    projects = db.query(Project).filter(
        Project.student_id == student.id
    ).all()

    return projects
@app.post("/projects")
def add_project(
    data: ProjectRequest,
    student: Student = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    project = Project(
        student_id=student.id,
        title=data.title,
        description=data.description,
        technologies=data.technologies,
        github_url=data.github_url,
        start_date=data.start_date or None,
        end_date=data.end_date or None,
        status=data.status
    )

    db.add(project)
    db.commit()
    db.refresh(project)

    return {
        "message": "Project added successfully",
        "project_id": project.id
    }
@app.put("/projects/{project_id}")
def update_project(
    project_id: int,
    data: ProjectRequest,
    student: Student = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    project = db.query(Project).filter(
        Project.id == project_id,
        Project.student_id == student.id
    ).first()

    if not project:
        raise HTTPException(
            status_code=404,
            detail="Project not found"
        )

    project.title = data.title
    project.description = data.description
    project.technologies = data.technologies
    project.github_url = data.github_url
    project.start_date = data.start_date or None
    project.end_date = data.end_date or None
    project.status = data.status

    db.commit()
    db.refresh(project)

    return {
        "message": "Project updated successfully"
    }
@app.delete("/projects/{project_id}")
def delete_project(
    project_id: int,
    student: Student = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    project = db.query(Project).filter(
        Project.id == project_id,
        Project.student_id == student.id
    ).first()

    if not project:
        raise HTTPException(
            status_code=404,
            detail="Project not found"
        )

    db.delete(project)
    db.commit()

    return {
        "message": "Project deleted successfully"
    }
class GoalRequest(BaseModel):
    title: str
    description: str = ""
    target_date: str = ""
    progress: int = 0
    status: str = "In Progress"
@app.get("/goals")
def get_goals(
    student: Student = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    goals = db.query(Goal).filter(
        Goal.student_id == student.id
    ).all()

    return goals
@app.post("/goals")
def add_goal(
    data: GoalRequest,
    student: Student = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    if data.progress < 0 or data.progress > 100:
        raise HTTPException(
            status_code=400,
            detail="Progress must be between 0 and 100"
        )

    goal = Goal(
        student_id=student.id,
        title=data.title,
        description=data.description,
        target_date=data.target_date or None,
        progress=data.progress,
        status=data.status
    )

    db.add(goal)
    db.commit()
    db.refresh(goal)

    return {
        "message": "Goal added successfully",
        "goal_id": goal.id
    }
@app.put("/goals/{goal_id}")
def update_goal(
    goal_id: int,
    data: GoalRequest,
    student: Student = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    goal = db.query(Goal).filter(
        Goal.id == goal_id,
        Goal.student_id == student.id
    ).first()

    if not goal:
        raise HTTPException(
            status_code=404,
            detail="Goal not found"
        )

    if data.progress < 0 or data.progress > 100:
        raise HTTPException(
            status_code=400,
            detail="Progress must be between 0 and 100"
        )

    goal.title = data.title
    goal.description = data.description
    goal.target_date = data.target_date or None
    goal.progress = data.progress
    goal.status = data.status

    db.commit()
    db.refresh(goal)

    return {
        "message": "Goal updated successfully"
    }
@app.delete("/goals/{goal_id}")
def delete_goal(
    goal_id: int,
    student: Student = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    goal = db.query(Goal).filter(
        Goal.id == goal_id,
        Goal.student_id == student.id
    ).first()

    if not goal:
        raise HTTPException(
            status_code=404,
            detail="Goal not found"
        )

    db.delete(goal)
    db.commit()

    return {
        "message": "Goal deleted successfully"
    }
@app.get("/dashboard")
def get_dashboard(
    student: Student = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    skills = db.query(Skill).filter(
        Skill.student_id == student.id
    ).all()

    projects = db.query(Project).filter(
        Project.student_id == student.id
    ).all()

    goals = db.query(Goal).filter(
        Goal.student_id == student.id
    ).all()

    total_skills = len(skills)
    total_projects = len(projects)
    total_goals = len(goals)

    completed_goals = len([
        goal for goal in goals
        if goal.status == "Completed"
    ])

    if total_skills > 0:
        average_skill_progress = round(
            sum(skill.progress for skill in skills) / total_skills
        )
    else:
        average_skill_progress = 0

    return {
        "student": {
            "id": student.id,
            "name": student.name,
            "email": student.email
        },
        "skills": skills,
        "projects": projects,
        "goals": goals,
        "summary": {
            "total_skills": total_skills,
            "total_projects": total_projects,
            "total_goals": total_goals,
            "completed_goals": completed_goals,
            "average_skill_progress": average_skill_progress
        }
    }
@app.get("/certificates")
def get_certificates(
    student: Student = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    certificates = db.query(Certificate).filter(
        Certificate.student_id == student.id
    ).all()

    return certificates


@app.post("/certificates")
def add_certificate(
    title: str = Form(...),
    issuer: str = Form(""),
    issue_date: str = Form(""),
    certificate_url: str = Form(""),
    file: UploadFile = File(None),
    student: Student = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    file_path = ""

    if file:
        os.makedirs("uploads", exist_ok=True)

        file_name = f"{student.id}_{file.filename}"
        file_path = os.path.join("uploads", file_name)

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

    certificate = Certificate(
        student_id=student.id,
        title=title,
        issuer=issuer,
        issue_date=issue_date or None,
        certificate_url=certificate_url,
        file_path=file_path
    )

    db.add(certificate)
    db.commit()
    db.refresh(certificate)

    return {
        "message": "Certificate added successfully",
        "certificate_id": certificate.id
    }


@app.put("/certificates/{certificate_id}")
def update_certificate(
    certificate_id: int,
    title: str = Form(...),
    issuer: str = Form(""),
    issue_date: str = Form(""),
    certificate_url: str = Form(""),
    student: Student = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    certificate = db.query(Certificate).filter(
        Certificate.id == certificate_id,
        Certificate.student_id == student.id
    ).first()

    if not certificate:
        raise HTTPException(
            status_code=404,
            detail="Certificate not found"
        )

    certificate.title = title
    certificate.issuer = issuer
    certificate.issue_date = issue_date or None
    certificate.certificate_url = certificate_url

    db.commit()
    db.refresh(certificate)

    return {
        "message": "Certificate updated successfully"
    }


@app.delete("/certificates/{certificate_id}")
def delete_certificate(
    certificate_id: int,
    student: Student = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    certificate = db.query(Certificate).filter(
        Certificate.id == certificate_id,
        Certificate.student_id == student.id
    ).first()

    if not certificate:
        raise HTTPException(
            status_code=404,
            detail="Certificate not found"
        )

    if certificate.file_path and os.path.exists(certificate.file_path):
        os.remove(certificate.file_path)

    db.delete(certificate)
    db.commit()

    return {
        "message": "Certificate deleted successfully"
    }
@app.get("/analytics")
def get_analytics(
    student: Student = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    skills = db.query(Skill).filter(
        Skill.student_id == student.id
    ).all()

    projects = db.query(Project).filter(
        Project.student_id == student.id
    ).all()

    goals = db.query(Goal).filter(
        Goal.student_id == student.id
    ).all()

    total_skills = len(skills)
    total_projects = len(projects)
    total_goals = len(goals)

    completed_projects = len([
        project for project in projects
        if project.status == "Completed"
    ])

    completed_goals = len([
        goal for goal in goals
        if goal.status == "Completed"
    ])

    in_progress_projects = len([
        project for project in projects
        if project.status == "In Progress"
    ])

    in_progress_goals = len([
        goal for goal in goals
        if goal.status == "In Progress"
    ])

    if total_skills > 0:
        average_skill_progress = round(
            sum(skill.progress for skill in skills) / total_skills
        )
    else:
        average_skill_progress = 0

    skill_data = []

    for skill in skills:
        skill_data.append({
            "skill_name": skill.skill_name,
            "progress": skill.progress
        })

    return {
        "summary": {
            "total_skills": total_skills,
            "total_projects": total_projects,
            "completed_projects": completed_projects,
            "in_progress_projects": in_progress_projects,
            "total_goals": total_goals,
            "completed_goals": completed_goals,
            "in_progress_goals": in_progress_goals,
            "average_skill_progress": average_skill_progress
        },
        "skills": skill_data
    }
@app.get("/skill-gap")
def get_skill_gap(
    student: Student = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    skills = db.query(Skill).filter(
        Skill.student_id == student.id
    ).all()

    strong_skills = []
    developing_skills = []
    needs_improvement = []

    for skill in skills:

        if skill.progress >= 70:
            strong_skills.append({
                "skill_name": skill.skill_name,
                "progress": skill.progress
            })

        elif skill.progress >= 40:
            developing_skills.append({
                "skill_name": skill.skill_name,
                "progress": skill.progress
            })

        else:
            needs_improvement.append({
                "skill_name": skill.skill_name,
                "progress": skill.progress
            })

    return {
        "strong_skills": strong_skills,
        "developing_skills": developing_skills,
        "needs_improvement": needs_improvement
    }