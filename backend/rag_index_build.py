# backend/scripts/rag_index_build.py

from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain.docstore.document import Document

# Step 1: 埋め込みモデルの準備
embedding = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

# Step 2: インデックスに入れるドキュメントを定義（テスト用の固定文章でもOK）
docs = [
    Document(page_content="Apple is a technology company that designs, manufactures, and sells smartphones."),
    Document(page_content="Tesla makes electric vehicles and renewable energy solutions."),
    Document(page_content="Amazon is a global e-commerce and cloud computing company.")
]

# Step 3: FAISSに埋め込みを渡してインデックスを作成
db = FAISS.from_documents(docs, embedding)

# Step 4: 保存（初回だけ）
db.save_local("faiss_index")
print("✅ faiss_index saved successfully.")
