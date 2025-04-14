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
llm = ChatOpenAI(model="gpt-4o")

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

    # Task 1: 감정 분석
    analyze_task = Task(
        description=(
            f"사용자의 일기를 읽고, 감정과 주요 사건을 요약해줘.\n\n"
            f"{data.diary}\n\n"
            "출력 형식:\n감정: ...\n사건 요약: ..."
        ),
        agent=analyzer
    )
    emotion_summary = analyze_task.execute()

    # Task 2: 동화 생성
    generate_task = Task(
        description=(
            f"아래 감정과 사건 요약을 참고해서, "
            f"'{data.character}'라는 캐릭터가 주인공인 짧은 동화를 작성해줘.\n"
            f"{emotion_summary}\n\n"
            "감성적이고 따뜻한 느낌으로, 자연스러운 한국어로 작성해줘.\n"
            "**'동화:' 같은 머리말 없이, 본문만 출력해줘. 영어 표현은 쓰지 마.**"
        ),
        agent=generator
    )
    story_text = generate_task.execute()

    # Task 3: 무드 조정
    mood_task = Task(
        description=(
            f"다음 동화를 '{data.mood}'한 무드로 자연스럽게 바꿔줘.\n"
            "예: '희망찬'이면 밝은 결말과 긍정적 분위기, '잔잔한'이면 조용하고 부드러운 흐름.\n"
            "**'수정된 동화 내용:' 같은 문구 없이 동화 본문만 출력해줘.**\n\n"
            f"{story_text}"
        ),
        agent=mooder
    )
    final_story = mood_task.execute()

    crew = Crew(
        agents=[analyzer, generator, mooder],
        tasks=[analyze_task, generate_task, mood_task],
        verbose=True,
        manager_llm=llm
    )

    result = crew.kickoff()
    return {"story": final_story}

@app.post("/generate-poem")
def generate_poem(data: StoryRequest):
    analyzer = Agent(
        role="일기 분석가",
        goal="사용자의 감정과 핵심 사건을 분석하기",
        backstory="감정 심리를 잘 파악하는 AI 분석가",
        llm=llm,
        verbose=True
    )
    poet = Agent(
        role="시 생성기",
        goal="감정을 바탕으로 감성적인 자유시를 생성하기",
        backstory="섬세한 감정을 잘 표현하는 시인",
        llm=llm,
        verbose=True
    )
    mooder = Agent(
        role="무드 조정가",
        goal="선택된 무드에 맞게 시 분위기를 조정하기",
        backstory="감정 흐름에 따라 시의 정서를 섬세하게 조정하는 시인",
        llm=llm,
        verbose=True
    )

    # Task 1: 감정 요약
    analyze_task = Task(
        description=(
            f"다음 일기를 읽고 감정과 사건 요약을 해줘:\n\n{data.diary}\n\n"
            "형식:\n감정: ...\n사건 요약: ..."
        ),
        agent=analyzer
    )
    emotion_summary = analyze_task.execute()

    # Task 2: 시 생성
    generate_task = Task(
        description=(
            f"아래 감정과 사건 요약을 바탕으로, '{data.character}'가 등장하고 감정을 담은 자유시를 작성해줘.\n"
            f"{emotion_summary}\n\n"
            "줄바꿈과 운율을 갖춘 자유시로, 감정을 섬세하게 표현하고 자연스러운 한국어로 작성해줘."
        ),
        agent=poet
    )
    poem_text = generate_task.execute()

    # Task 3: 시 무드 조정
    mood_task = Task(
        description=(
            f"다음 시를 '{data.mood}'한 분위기로 자연스럽게 바꿔줘.\n"
            "예: '잔잔한' 무드면 고요하고 서정적인 흐름, '슬픈' 무드면 애절한 톤으로.\n"
            "**'수정된 시:' 같은 문구 없이 시 본문만 출력해줘.**\n\n"
            f"{poem_text}"
        ),
        agent=mooder
    )
    final_poem = mood_task.execute()

    crew = Crew(
        agents=[analyzer, poet, mooder],
        tasks=[analyze_task, generate_task, mood_task],
        verbose=True,
        manager_llm=llm
    )

    result = crew.kickoff()
    return {"story": final_poem}
