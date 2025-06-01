from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter(
    prefix="/users",
    tags=["ユーザー"]
)

class UserResponse(BaseModel):
    id: int
    email: str
    name: str 

@router.get("/me", response_model=UserResponse)
async def get_current_user():
    """現在のユーザー情報を取得"""
    # 仮のユーザー情報を返す
    return {
        "id": 1,
        "email": "testemail.mail.com",
        "name": "テストユーザー"
    } 