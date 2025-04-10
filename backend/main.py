from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from crewai import Agent, Task, Crew
from langchain_openai import ChatOpenAI
from dotenv import load_dotenv
import os

# ✅ .env에서 API 키 가져오기
load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")
if not api_key:
    raise ValueError("OPENAI_API_KEY가 설정되지 않았습니다.")
os.environ["OPENAI_API_KEY"] = api_key  # ChatOpenAI가 내부에서 이걸 사용함

# ✅ ChatOpenAI 호출 시 openai_api_key 인자 ❌
llm = ChatOpenAI(model="gpt-3.5-turbo")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class StoryRequest(BaseModel):
    diary: str
    mood: str
    character: str
    format: str = "story"

@app.post("/generate-story")
def generate_story(data: StoryRequest):
    analyzer = Agent(
        role="일기 분석가",
        goal="사용자의 감정과 핵심 사건을 분석하기",
        backstory="감정 심리를 잘 파악하는 AI 분석가",
        llm=llm,
        verbose=True
    )
    generator = Agent(
        role="스토리 생성기",
        goal="감정과 캐릭터를 동화 형식으로 표현하기",
        backstory="상상력이 풍부한 동화 작가",
        llm=llm,
        verbose=True
    )
    mooder = Agent(
        role="무드 조정가",
        goal="선택된 무드에 맞게 이야기 분위기와 결말을 조정하기",
        backstory="감정 흐름에 따라 서사를 조정하는 마스터",
        llm=llm,
        verbose=True
    )

    # 1. 감정과 사건 요약 Task
    analyze_task = Task(
        description=(
            f"사용자의 일기를 읽고, 감정과 주요 사건을 다음 형식에 맞춰 요약해줘:\n\n"
            f"{data.diary}\n\n"
            "출력 형식:\n감정: [감정 내용]\n사건 요약: [사건 요약]"
        ),
        expected_output="감정: [감정 내용], 사건 요약: [사건 요약]",
        agent=analyzer
    )

    # 2. 동화 생성 Task
    generate_task = Task(
        description=(
            "이전 분석 결과(감정과 사건 요약)를 참고해서, "
            f"'{data.character}'라는 이름의 캐릭터를 주인공으로 한 짧은 동화를 써줘.\n"
            "감성적이고 따뜻한 느낌으로 구성해줘.\n\n"
            "출력 형식:\n동화: [동화 내용]"
        ),
        expected_output="동화: [감성적이고 따뜻한 짧은 동화]",
        agent=generator
    )

    # 3. 무드 조정 Task
    mood_task = Task(
        description=(
            f"다음 동화를 '{data.mood}'한 무드와 분위기로 자연스럽게 수정해줘.\n"
            "예를 들어, '희망찬' 무드라면 긍정적인 결말과 밝은 분위기로, "
            "'잔잔한' 무드라면 부드럽고 조용한 흐름으로 바꿔줘.\n\n"
            "출력 형식:\n감정 조정된 동화: [수정된 동화 내용]"
        ),
        expected_output=f"감정 조정된 동화: [{data.mood}한 분위기의 동화 전체]",
        agent=mooder
    )


    crew = Crew(
        agents=[analyzer, generator, mooder],
        tasks=[analyze_task, generate_task, mood_task],
        verbose=True,
        manager_llm=llm
    )

    result = crew.kickoff()
    return {"story": result}
