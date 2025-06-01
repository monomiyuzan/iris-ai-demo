from fastapi import APIRouter
from pydantic import BaseModel
from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_core.documents import Document
from langchain_core.runnables import RunnablePassthrough
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain.chains import create_retrieval_chain
from langchain_openai import ChatOpenAI
from langchain.prompts import PromptTemplate
import os
from dotenv import load_dotenv

# .envの読み込み
load_dotenv()

router = APIRouter(
    prefix="/analysis",
    tags=["分析"]
)

# ======= モックのセンチメント判定 =======
class SentimentRequest(BaseModel):
    text: str

class SentimentResponse(BaseModel):
    sentiment: str

@router.post("/sentiment", response_model=SentimentResponse)
async def analyze_sentiment(request: SentimentRequest):
    sentiment = "positive" if len(request.text) > 10 else "negative"
    return {"sentiment": sentiment}


# ======= RAG要約 =======
class RAGRequest(BaseModel):
    text: str

class RAGResponse(BaseModel):
    summary: str

@router.post("/rag", response_model=RAGResponse)
async def analyze_with_rag(request: RAGRequest):
    # ① ベクトルDBをロード
    embedding = HuggingFaceEmbeddings(model_name="intfloat/multilingual-e5-small")
    db = FAISS.load_local("faiss_index", embedding, allow_dangerous_deserialization=True)

    # ② Retrieverを作成
    retriever = db.as_retriever()

    # ③ OpenAIのLLMを設定
    llm = ChatOpenAI(
        model="gpt-4o-mini",  # もしくは gpt-4 など
        openai_api_key=os.getenv("OPENAI_API_KEY"),
    )

    # ④ chain構成を定義
    prompt = PromptTemplate(
        input_variables=["context", "input"],
        template="""
        以下の文書に基づいて質問に答えてください。

        文書:
        {context}

        質問:
        {input}
        """
    )

    combine_docs_chain = create_stuff_documents_chain(llm=llm, prompt=prompt)
    rag_chain = create_retrieval_chain(retriever=retriever, combine_docs_chain=combine_docs_chain)

    # ⑤ 実行して結果を取得
    result = rag_chain.invoke({"input": request.text})

    # ⑥ 結果を出力
    print(result)

    # ⑦ 結果を返す
    return {"summary": result["answer"]}