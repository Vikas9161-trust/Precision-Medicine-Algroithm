# PharmaGuard
Demo Video-https://www.linkedin.com/posts/shikha-gupta-8439b4268_rift2026-unstop-hackathon-ugcPost-7430434293060960256-DGJN?utm_source=share&utm_medium=member_android&rcm=ACoAAEGkxrMB1PMTL7eKmfJoWg6ZtC-0b5Q6Bfk

**Precision Medicine Powered by AI - From DNA to Drug Decision — In Seconds**

## Project Overview

PharmaGuard is a production-ready, scalable, AI-powered Clinical Decision Support System designed to analyze patient genetic data (VCF) and provide personalized drug response predictions. It leverages CPIC-aligned pharmacogenomic rules and Large Language Models (LLM) to deliver clear, actionable insights for clinicians.

## Key Features

- **VCF Upload & Parsing**: Supports VCF v4.2 format, extracting variants for 6 critical genes (CYP2D6, CYP2C19, CYP2C9, SLCO1B1, TPMT, DPYD).
- **CPIC-Aligned Rule Engine**: Applies clinical guidelines to determine phenotypes (PM, IM, NM, RM, URM) and drug risks.
- **AI-Powered Explanations**: Generates biological reasoning and clinical recommendations using LLMs.
- **Production-Ready Architecture**: Built with FastAPI (Backend) and Next.js (Frontend).
- **Secure & Scalable**: Designed for deployment on Render and Vercel.

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS, Framer Motion
- **Backend**: FastAPI, Python, Uvicorn, Pydantic
- **Database**: MongoDB (Optional)
- **AI**: OpenAI / Gemini API (LLM Integration)

## Live Hosting (Vercel)

PharmaGuard is optimized for seamless deployment on **Vercel**.

### Quick Deploy
1.  **Push to GitHub**: Push your local changes to a GitHub repository.
2.  **Import to Vercel**: Connect your repository to Vercel.
3.  **Environment Variables**: Add `GEMINI_API_KEY` to the Vercel project settings.
4.  **Auto-Build**: Vercel will automatically detect the `vercel.json` configuration and build both the Next.js frontend and the FastAPI backend.

> [!NOTE]
> This project uses SQLite (`pharmaguard.db`) by default. On Vercel, the file system is ephemeral, meaning database changes will be reset after each server restart. For persistent data, consider connecting to a hosted database like Neon (PostgreSQL) or MongoDB.

## Getting Started

### Prerequisites

- Python 3.9+
- Node.js 18+
- Git

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/PharmaGuard.git
    cd PharmaGuard
    ```

2.  **Setup Environment:**
    Copy `.env.example` to `.env` in the root, `backend/`, and `frontend/` directories and fill in your keys.

3.  **Backend Setup:**
    ```bash
    cd backend
    python -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    pip install -r requirements.txt
    uvicorn app.main:app --reload
    ```

4.  **Frontend Setup:**
    ```bash
    cd frontend
    npm install
    npm run dev
    ```

## API Documentation

The backend API documentation is available at `http://localhost:8000/docs` (local) or your-vercel-url.app/api/docs (live).

## License

MIT License
