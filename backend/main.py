# main.py
from fastapi import FastAPI
from routers import companies, users, auth, ir_reports, analysis, portfolio
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()
app = FastAPI()

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(companies.router)
app.include_router(ir_reports.router)
app.include_router(analysis.router)
app.include_router(portfolio.router)


# CORS設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)