from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

# ✅ CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or ["http://localhost:3000"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ 요청 바디 모델 정의
class StoryRequest(BaseModel):
    diary: str
    mood: str
    character: str
    format: str = "story"  # 기본값 story

@app.post("/generate-story")
async def generate_story(data: StoryRequest):
    if data.format == "poem":
        story = f"""
        {data.character}의 하루는

        "{data.diary}"

        그리고 그 마음은

        {data.mood}의 노래로 남았어요.
        """
    else:
        story = f"""
        옛날 옛적에 {data.character}가 살고 있었어요.
        그 {data.character}는 오늘 이렇게 느꼈어요:

        "{data.diary}"

        그리고 그 이야기는 결국 {data.mood}한 결말로 끝이 났어요.
        """
    return {"story": story}
