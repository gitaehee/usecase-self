// src/app/story/page.tsx
'use client';

import { useStoryStore } from '@/lib/store';
import { useState } from 'react';

export default function StoryPage() {
  const story = useStoryStore((state) => state.story);
  const saveStory = useStoryStore((state) => state.saveStory);

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    saveStory(story);
    setSaved(true);
  };

  return (
    <div className="p-6 max-w-xl mx-auto text-white">
      <h1 className="text-2xl font-bold mb-6 text-rose-200">✨ 오늘의 동화 ✨</h1>

      <div className="whitespace-pre-wrap bg-[#1d1b16] p-6 rounded-2xl border border-[#3f3c36] shadow-inner text-lg leading-relaxed">
        {story ? story : '동화가 없습니다. 일기를 먼저 작성해주세요!'}
      </div>

      {story && !saved && (
        <button
          onClick={handleSave}
          className="mt-6 bg-yellow-300 hover:bg-yellow-400 text-black font-semibold px-4 py-2 rounded-xl transition w-full"
        >
          ⭐ 이 동화 저장하기
        </button>
      )}

      {saved && (
        <div className="mt-6 text-center text-sm text-green-400">
          ✅ 동화가 저장되었습니다!
        </div>
      )}
    </div>
  );
}
