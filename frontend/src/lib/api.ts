// src/lib/api.ts

export async function generateStory(data: {
    diary: string;
    mood: string;
    character: string;
  }): Promise<string> { // 백엔드 실제 주소링크로 바꾸기
    const response = await fetch('http://localhost:8000/generate-story', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  
    if (!response.ok) {
      throw new Error('동화 생성 실패');
    }
  
    const result = await response.json();
    return result.story; // story는 백엔드가 반환하는 동화 텍스트라고 가정
  }
  

  export async function generatePoem(data: {
    diary: string;
    mood: string;
    character: string;
  }): Promise<string> {
    const response = await fetch('http://localhost:8000/generate-poem', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data), // format 제거해도 됨, 별도 엔드포인트니까
    });
  
    if (!response.ok) {
      throw new Error('시 생성 실패');
    }
  
    const result = await response.json();
    return result.story;
  }
  