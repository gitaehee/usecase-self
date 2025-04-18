// src/app/story/page.tsx

'use client';

import { useStoryStore } from '@/lib/store';
import { generateStory } from '@/lib/api';
import { useEffect, useRef, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

const getKSTDateKey = () => {
  const date = new Date();
  const offset = date.getTimezoneOffset() * 60000;
  const kstDate = new Date(date.getTime() - offset + 9 * 60 * 60000);
  return kstDate.toISOString().split('T')[0];
};

export default function StoryPage() {
  const {
    mood,
    character,
    defaultMood,
    defaultCharacter,
    setDiary,
    getDiaryByDate,
    getStoryByDate,
    setStoryByDate,
    saveStoryByDate,
    savedStoriesByDate,
  } = useStoryStore();

  const searchParams = useSearchParams();
  const router = useRouter();
  const shouldGenerate = searchParams.get('generate') === 'true';
  const dateParam = searchParams.get('date');
  const selectedKey = dateParam || getKSTDateKey();

  const [localStory, setLocalStory] = useState('');
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  const storyForDate = getStoryByDate(selectedKey);
  const alreadySaved = !!storyForDate && storyForDate.trim() !== '';
  const effectiveMood = mood || defaultMood;
  const effectiveCharacter = character || defaultCharacter;
  const hasGeneratedRef = useRef(false);

  const formatDateTitle = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}월 ${date.getDate()}일`;
  };

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    const diaryForDate = getDiaryByDate(selectedKey);

    if (!shouldGenerate && storyForDate && storyForDate.trim() !== '') {
      setLocalStory(storyForDate);
      return;
    }

    if (!hasGeneratedRef.current && shouldGenerate && diaryForDate?.trim()) {
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
          setStoryByDate(selectedKey, text);
          setLocalStory(text);
        } catch {
          setLocalStory('동화 생성에 실패했어요.');
        } finally {
          setLoading(false);
        }
      };

      generate();
    }
  }, [hydrated, selectedKey, shouldGenerate]);

  const handleDelete = () => {
    setStoryByDate(selectedKey, '');
    setLocalStory('');
    setSaved(false);
  };

  return (
    <div className="p-6 max-w-xl mx-auto text-white">
      <h1 className="text-2xl font-bold mb-6 text-rose-200">
        ✨ {formatDateTitle(selectedKey)}의 동화 ✨
      </h1>

      <div className="whitespace-pre-wrap bg-[#1d1b16] p-6 rounded-2xl border border-[#3f3c36] shadow-inner text-lg leading-relaxed min-h-[200px]">
        {loading ? '동화를 만드는 중...' : localStory || '일기를 먼저 작성해주세요.'}
      </div>

      {localStory && !alreadySaved && (
        <button
          onClick={() => {
            saveStoryByDate(selectedKey);
            setSaved(true);
          }}
          className="mt-6 bg-yellow-300 hover:bg-yellow-400 text-black font-semibold px-4 py-2 rounded-xl transition w-full"
        >
          ⭐ 이 동화 저장하기
        </button>
      )}

      {(saved || alreadySaved) && localStory.trim() !== '' && (
        <div className="mt-6 text-center">
          <div className="text-sm text-green-400 mb-2">✅ 동화가 저장되었습니다!</div>
          <button
            onClick={handleDelete}
            className="text-sm text-red-400 hover:text-red-500"
          >
            🗑️ 저장된 동화 삭제하기
          </button>
        </div>
      )}

      <button
        onClick={() => router.push('/')}
        className="mt-6 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-xl w-full"
      >
        🗓️ 달력으로 돌아가기
      </button>
    </div>
  );
}
