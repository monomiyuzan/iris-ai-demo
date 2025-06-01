from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from datetime import datetime

router = APIRouter(
    prefix="/ir-reports",
    tags=["IR情報"]
)

class IRReportResponse(BaseModel):
    id: int
    company_id: int
    title: str
    summary: str

mock_reports = [
    {"id": 1, "company_id": 1, "title": "2023 Q4 Financials", "summary": "売上と利益が大幅増"},
    {"id": 2, "company_id": 2, "title": "新規プロダクト発表", "summary": "AI関連の新技術を発表"},
    {"id": 3, "company_id": 3, "title": "株主総会資料", "summary": "今後の成長戦略について説明"}
]

@router.get("", response_model=List[IRReportResponse])
async def list_ir_reports():
    return mock_reports

@router.get("/{id}", response_model=IRReportResponse)
async def get_ir_report(id: int):
    for report in mock_reports:
        if report["id"] == id:
            return report
    raise HTTPException(status_code=404, detail="Report not found")