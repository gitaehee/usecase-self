// src/app/story/page.tsx

'use client';

import { useStoryStore } from '@/lib/store';
import { generateStory } from '@/lib/api';
import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function StoryPage() {
  const {
    mood,
    character,
    defaultMood,
    defaultCharacter,
    story,
    setStory,
    setDiary,
    getDiaryByDate,
    saveStory,
    savedStories,
  } = useStoryStore();

  const searchParams = useSearchParams();
  const shouldGenerate = searchParams.get('generate') === 'true';
  const dateParam = searchParams.get('date');
  const selectedKey = dateParam || new Date().toISOString().split('T')[0];

  const [localStory, setLocalStory] = useState(story || '');
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const alreadySaved = savedStories.includes(story);

  const effectiveMood = mood || defaultMood;
  const effectiveCharacter = character || defaultCharacter;

  const hasGeneratedRef = useRef(false);

  useEffect(() => {
    const diaryForDate = getDiaryByDate(selectedKey);

    if (!diaryForDate || !shouldGenerate || hasGeneratedRef.current) return;

    hasGeneratedRef.current = true;
    setDiary(diaryForDate);

    const generate = async () => {
      setLoading(true);
      try {
        const text = await generateStory({
          diary: diaryForDate,
          mood: effectiveMood,
          character: effectiveCharacter,
        });
        setStory(text);
        setLocalStory(text);
      } catch {
        setLocalStory('동화 생성에 실패했어요.');
      } finally {
        setLoading(false);
      }
    };

    generate();
  }, [selectedKey]);

  return (
    <div className="p-6 max-w-xl mx-auto text-white">
      <h1 className="text-2xl font-bold mb-6 text-rose-200">✨ 오늘의 동화 ✨</h1>

      <div className="whitespace-pre-wrap bg-[#1d1b16] p-6 rounded-2xl border border-[#3f3c36] shadow-inner text-lg leading-relaxed min-h-[200px]">
        {loading ? '동화를 만드는 중...' : localStory || '일기를 먼저 작성해주세요.'}
      </div>

      {localStory && !alreadySaved && (
        <button
          onClick={() => {
            saveStory();
            setSaved(true);
          }}
          className="mt-6 bg-yellow-300 hover:bg-yellow-400 text-black font-semibold px-4 py-2 rounded-xl transition w-full"
        >
          ⭐ 이 동화 저장하기
        </button>
      )}

      {saved || alreadySaved ? (
        <div className="mt-6 text-center text-sm text-green-400">
          ✅ 동화가 저장되었습니다!
        </div>
      ) : null}
    </div>
  );
}
