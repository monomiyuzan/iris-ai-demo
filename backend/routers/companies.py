from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List

router = APIRouter(
    prefix="/companies",
    tags=["企業"]
)

#仮データ（モック）
companies = [
    {"id": 1, "name": "OpenAI", "ticker": "OAI"},
    {"id": 2, "name": "Google", "ticker": "GOOGL"},
    {"id": 3, "name": "Amazon", "ticker": "AMZN"}
]

class CompanyResponse(BaseModel):
    id: int
    name: str
    ticker: str

@router.get("", response_model=List[CompanyResponse])
async def get_companies():
    """企業一覧を取得"""
    return companies

@router.get("/{id}", response_model=CompanyResponse)
async def get_company(id: int):
    """指定されたIDの企業情報を取得"""
    for company in companies:
        if company["id"] == id:
            return company
    raise HTTPException(status_code=404, detail="Company not found")
