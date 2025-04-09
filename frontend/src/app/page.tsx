// src/app/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStoryStore } from '@/lib/store';
import { generateStory } from '@/lib/api';

export default function Home() {
  const router = useRouter();

  // ✅ Zustand에서 기본값 가져오기
  const {
    defaultMood,
    defaultCharacter,
    setStory,
    setStoryText,
  } = useStoryStore();

  // ✅ 가져온 기본값을 초기값으로 세팅
  const [diary, setDiary] = useState('');
  const [mood, setMood] = useState(defaultMood);
  const [character, setCharacter] = useState(defaultCharacter);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!diary.trim()) {
      alert('일기를 입력해주세요!');
      return;
    }

    setStory({ diary, mood, character });
    setLoading(true);

    try {
      const result = await generateStory({ diary, mood, character });
      setStoryText(result);
      router.push('/story');
    } catch (error) {
      alert('동화 생성 중 오류가 발생했어요 😢');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">일기 작성하기</h1>

      <textarea
        value={diary}
        onChange={(e) => setDiary(e.target.value)}
        placeholder="오늘 하루는 어땠나요?"
        className="w-full p-4 border border-gray-300 rounded mb-4"
        rows={6}
      />

      {/* 캐릭터와 무드 선택도 추가할 수 있음 (옵션) */}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-pink-300 hover:bg-pink-400 text-black px-4 py-2 rounded-xl w-full font-semibold"
      >
        {loading ? '동화를 만드는 중...' : '🌸 이야기 만들어줘'}
      </button>
    </div>
  );
}
