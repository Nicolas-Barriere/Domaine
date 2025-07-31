from fastapi import FastAPI, Form, HTTPException
from fastapi.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
import os, random
from dotenv import load_dotenv

load_dotenv(dotenv_path=os.getenv("ENV_FILE", ".env"))
BASE_URL = os.getenv("BASE_URL", "http://localhost:8000")
FRONTEND_ORIGIN = os.getenv("FRONTEND_ORIGIN", "http://localhost:3000")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_ORIGIN],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

db = {}
slugs = ["ta-mere-en-slip", "gros-fouuu"]

@app.post("/shorten")
def shorten(url: str = Form(...), slug: str = Form(None)):
    if slug:
        # if slug in db:
        #     raise HTTPException(status_code=400, detail="Ce slug est déjà pris.")
        db[slug] = url
        return {"short_url": f"{BASE_URL}/r/{slug}"}
    else:
        slug_choice = random.choice(slugs)
        # while slug_choice in db:
        #     slug_choice = random.choice(slugs)
        db[slug_choice] = url
        return {"short_url": f"{BASE_URL}/r/{slug_choice}"}

@app.get("/r/{slug}")
def redirect(slug: str):
    if slug in db:
        return RedirectResponse(db[slug])
    raise HTTPException(status_code=404, detail="Slug not found")
