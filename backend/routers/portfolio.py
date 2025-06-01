# routers/portfolio.py

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from typing import Optional

router = APIRouter(
    prefix="/portfolio",
    tags=["ポートフォリオ"]
)

# モックデータ
portfolio_data = [
    {"id": 1, "company": "OpenAI", "shares": 10},
    {"id": 2, "company": "Google", "shares": 5},
]

class PortfolioItem(BaseModel):
    id: Optional[int] = None  # ← クライアントから来ない場合もあるので Optional
    company: str
    shares: int

@router.get("", response_model=List[PortfolioItem])
async def get_portfolio():
    return portfolio_data

@router.get("/{id}", response_model=PortfolioItem)
async def get_portfolio_item(id: int):
    """指定されたIDのポートフォリオアイテムを取得"""
    for item in portfolio_data:
        if item["id"] == id:
            return item
    raise HTTPException(status_code=404, detail="Portfolio item not found")


@router.post("", response_model=PortfolioItem)
async def create_portfolio(item: PortfolioItem):
    # IDを自動で振る
    new_id = max([p["id"] for p in portfolio_data], default=0) + 1
    item_dict = item.model_dump()
    item_dict["id"] = new_id
    portfolio_data.append(item_dict)
    return item_dict

@router.put("/{id}", response_model=PortfolioItem)
async def update_portfolio(id: int, item: PortfolioItem):
    for i, p in enumerate(portfolio_data):
        if p["id"] == id:
            portfolio_data[i] = item.model_dump()
            return item
    raise HTTPException(status_code=404, detail="Portfolio not found")

@router.delete("/{id}")
async def delete_portfolio(id: int):
    for i, p in enumerate(portfolio_data):
        if p["id"] == id:
            portfolio_data.pop(i)
            return {"message": "Deleted successfully"}
    raise HTTPException(status_code=404, detail="Portfolio not found")
