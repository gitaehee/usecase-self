// src/app/story/page.tsx

'use client';

import { useStoryStore } from '@/lib/store';
import { generateStory } from '@/lib/api';
import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';

const getTodayKey = () => new Date().toISOString().split('T')[0];

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

  const [localStory, setLocalStory] = useState(story || '');
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const alreadySaved = savedStories.includes(story);

  const effectiveMood = mood || defaultMood;
  const effectiveCharacter = character || defaultCharacter;

  // ✅ 첫 생성 여부 추적용
  const hasGeneratedRef = useRef(false);

  useEffect(() => {
    const todayDiary = getDiaryByDate(getTodayKey());

    if (!todayDiary || !shouldGenerate || hasGeneratedRef.current) return;

    hasGeneratedRef.current = true; // ✅ 최초 1회만 생성되도록 막음
    setDiary(todayDiary);

    const generate = async () => {
      setLoading(true);
      try {
        const text = await generateStory({
          diary: todayDiary,
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
  }, []);

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
