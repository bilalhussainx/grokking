import { Module } from "../types";

export const module2: Module = {
  id: "rag-agents",
  title: "RAG Systems & AI Agents",
  description: "Build retrieval-augmented generation pipelines, vector databases, agentic tool use, function calling, and multi-step reasoning systems",
  lessons: [
    {
      id: "rag-agents-production",
      slug: "rag-agents-production",
      title: "RAG Pipelines & Agentic Systems",
      content: `# RAG and AI Agents

Two paradigms dominate LLM engineering: RAG (give the model relevant knowledge) and Agents (give the model tools to act). Understanding both — and when to use each — is the core skill.

---

## RAG: Retrieval-Augmented Generation

\`\`\`concept
{
  "title": "Why RAG Works",
  "variant": "mental-model",
  "content": "LLMs hallucinate when asked about things they don't know. RAG fixes this by retrieving relevant documents at query time and putting them in the context window. Instead of 'What do you know about X?', the model gets 'Here are 5 relevant documents about X. Answer the question based ONLY on these documents.' Groundedness dramatically reduces hallucination."
}
\`\`\`

## RAG Pipeline Architecture

\`\`\`sysdiag
{
  "type": "pipeline",
  "title": "RAG System Architecture",
  "steps": [
    { "step": "Document Ingestion", "detail": "Load PDFs/docs → split into chunks (512-1024 tokens) → embed each chunk → store in vector DB" },
    { "step": "Query Processing", "detail": "User query → embed query → cosine similarity search → retrieve top-k chunks" },
    { "step": "Context Assembly", "detail": "Retrieved chunks + user query → structured prompt with source attribution" },
    { "step": "Generation", "detail": "LLM generates answer grounded in retrieved context → stream response" },
    { "step": "Citation", "detail": "Return answer with source document references for verification" }
  ]
}
\`\`\`

## Building a RAG System

\`\`\`python
# Full RAG pipeline using LangChain + pgvector (Supabase)
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain_community.vectorstores import SupabaseVectorStore
from langchain.chains import RetrievalQA
from langchain.prompts import ChatPromptTemplate
from supabase import create_client
import PyPDF2

# --- 1. INGESTION PIPELINE ---
def ingest_pdf(file_path: str) -> None:
    # Load PDF:
    reader = PyPDF2.PdfReader(file_path)
    full_text = "\\n".join(page.extract_text() for page in reader.pages)

    # Split into chunks (with overlap for context continuity):
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,        # ~750 words per chunk
        chunk_overlap=200,      # 200 token overlap prevents context split
        separators=["\\n\\n", "\\n", " ", ""],  # Try paragraph → sentence → word
    )
    chunks = splitter.create_documents(
        [full_text],
        metadatas=[{"source": file_path, "type": "pdf"}],
    )

    # Embed and store:
    embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

    SupabaseVectorStore.from_documents(
        documents=chunks,
        embedding=embeddings,
        client=supabase,
        table_name="documents",   # pgvector table
        query_name="match_documents",
    )
    print(f"Ingested {len(chunks)} chunks from {file_path}")

# --- 2. RETRIEVAL + GENERATION ---
def answer_question(question: str) -> dict:
    embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
    supabase   = create_client(SUPABASE_URL, SUPABASE_KEY)

    vectorstore = SupabaseVectorStore(
        client=supabase,
        embedding=embeddings,
        table_name="documents",
        query_name="match_documents",
    )

    # Retrieve top-5 most relevant chunks:
    retriever = vectorstore.as_retriever(
        search_type="similarity",
        search_kwargs={"k": 5},
    )

    # Custom prompt template:
    prompt = ChatPromptTemplate.from_template("""
You are a helpful assistant. Answer the question based ONLY on the provided context.
If the context doesn't contain enough information, say "I don't have enough information."
Always cite your sources.

Context:
{context}

Question: {question}

Answer:""")

    llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.1)
    chain = RetrievalQA.from_chain_type(
        llm=llm,
        chain_type="stuff",           # Stuff all retrieved docs into context
        retriever=retriever,
        chain_type_kwargs={"prompt": prompt},
        return_source_documents=True,
    )

    result = chain.invoke({"query": question})
    return {
        "answer": result["result"],
        "sources": [doc.metadata["source"] for doc in result["source_documents"]],
    }
\`\`\`

## Function Calling & AI Agents

\`\`\`python
# Function calling: give the LLM structured tools to call
# The model decides WHICH tool to call and with WHAT arguments

tools = [
    {
        "type": "function",
        "function": {
            "name": "search_database",
            "description": "Search the product database for items matching criteria",
            "parameters": {
                "type": "object",
                "properties": {
                    "query": {"type": "string", "description": "Search query"},
                    "max_price": {"type": "number", "description": "Maximum price in USD"},
                    "category": {"type": "string", "enum": ["electronics", "clothing", "books"]},
                },
                "required": ["query"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "get_order_status",
            "description": "Get the status of an order by order ID",
            "parameters": {
                "type": "object",
                "properties": {
                    "order_id": {"type": "string"},
                },
                "required": ["order_id"],
            },
        },
    },
]

def run_agent(user_message: str) -> str:
    messages = [{"role": "user", "content": user_message}]

    while True:
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=messages,
            tools=tools,
            tool_choice="auto",   # Model decides when to use tools
        )
        msg = response.choices[0].message

        # If no tool call — final answer:
        if not msg.tool_calls:
            return msg.content

        # Execute tool calls:
        messages.append(msg)   # Add assistant message with tool call

        for tool_call in msg.tool_calls:
            name = tool_call.function.name
            args = json.loads(tool_call.function.arguments)

            # Route to the right function:
            if name == "search_database":
                result = search_database(**args)
            elif name == "get_order_status":
                result = get_order_status(**args)
            else:
                result = {"error": f"Unknown tool: {name}"}

            # Return tool result to model:
            messages.append({
                "role": "tool",
                "tool_call_id": tool_call.id,
                "content": json.dumps(result),
            })
        # Loop: model processes tool results, may call more tools or respond
\`\`\`

\`\`\`takeaways
["RAG: chunk size 512-1024 tokens, overlap 10-20%, separate ingestion from retrieval pipelines", "Chunk overlap prevents splitting ideas across chunks — 200 token overlap is typical", "Answer based ONLY on context prompt: dramatically reduces hallucination vs open-ended prompts", "Function calling: model returns structured tool call JSON, you execute it, return result, model continues", "ReAct pattern: Reason (what do I need?) → Act (call tool) → Observe (process result) — loop until done", "Agentic systems need timeout, max iterations, and error handling — infinite loops are real failure modes"]
\`\`\`
`,
    },
  ],
};
