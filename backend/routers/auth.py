from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from jose import JWTError, jwt
from datetime import datetime, timedelta, timezone

router = APIRouter(
    prefix="/auth",
    tags=["認証"]
)

# 仮のシークレットキー（本番環境では環境変数から取得することを推奨）
SECRET_KEY = "your-secret-key-here"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

class LoginRequest(BaseModel):
    username: str
    password: str

class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

@router.post("/login", response_model=LoginResponse)
async def login(login_data: LoginRequest):
    """ユーザーログインエンドポイント"""
    # 仮の認証処理（実際の実装ではデータベースでユーザーを検証）
    if login_data.username == "test" and login_data.password == "test":
        access_token = create_access_token(
            data={"sub": login_data.username}
        )
        return {"access_token": access_token, "token_type": "bearer"}
    raise HTTPException(
        status_code=401,
        detail="Incorrect username or password"
    )

@router.post("/logout")
async def logout():
    """ユーザーログアウトエンドポイント"""
    return {"message": "Successfully logged out"}