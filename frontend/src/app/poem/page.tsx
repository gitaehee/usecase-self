// app/poem/page.tsx
'use client';

import { useStoryStore } from '@/lib/store';
import { generatePoem } from '@/lib/api';
import { useState } from 'react';

export default function PoemPage() {
  const { diary, mood, character, poem, setPoem } = useStoryStore();
  const [localPoem, setLocalPoem] = useState(poem || '');
  const [loading, setLoading] = useState(false);

  const handleGeneratePoem = async () => {
    setLoading(true);
    try {
      const text = await generatePoem({ diary, mood, character });
      setPoem(text);        // 글로벌 상태 저장
      setLocalPoem(text);   // 로컬 상태 반영
    } catch {
      setLocalPoem('시를 만드는 데 실패했어요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto text-white">
      <h1 className="text-2xl font-bold mb-6 text-pink-200">🌙 오늘의 시</h1>

      <button
        onClick={handleGeneratePoem}
        className="mb-4 bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded-2xl transition"
        disabled={loading}
      >
        {loading ? '시를 만드는 중...' : '시 만들기'}
      </button>

      <div className="whitespace-pre-wrap bg-[#1d1b16] p-6 rounded-2xl border border-[#3f3c36] shadow-inner text-lg leading-relaxed font-serif min-h-[200px]">
        {localPoem || '시를 만들면 이곳에 나타납니다.'}
      </div>
    </div>
  );
}
