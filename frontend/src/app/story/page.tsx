// src/app/story/page.tsx


'use client';

import { useStoryStore } from '@/lib/store';
import { generateStory } from '@/lib/api';
import { useEffect, useRef, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Bookmark, BookmarkCheck } from 'lucide-react';

const getKSTDateKey = () => {
  const date = new Date();
  const offset = date.getTimezoneOffset() * 60000;
  const kstDate = new Date(date.getTime() - offset + 9 * 60 * 60000);
  return kstDate.toISOString().split('T')[0];
};

const formatDateTitle = (dateStr: string) => {
  const date = new Date(dateStr);
  return `${date.getMonth() + 1}월 ${date.getDate()}일`;
};

export default function StoryPage() {
  const {
    mood,
    character,
    defaultMood,
    defaultCharacter,
    getDiaryByDate,
    getStoryByDate,
    setStoryByDate,
    saveStoryByDate,
    deleteSavedStoryByDate,
    savedStoriesByDate,
  } = useStoryStore();

  const searchParams = useSearchParams();
  const router = useRouter();
  const shouldGenerate = searchParams.get('generate') === 'true';
  const dateParam = searchParams.get('date');
  const selectedKey = dateParam || getKSTDateKey();

  const storyForDate = getStoryByDate(selectedKey);
  const alreadySaved = savedStoriesByDate[selectedKey] || false;

  const effectiveMood = mood || defaultMood;
  const effectiveCharacter = character || defaultCharacter;

  const [localStory, setLocalStory] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);

  const hasGeneratedRef = useRef(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    const diaryForDate = getDiaryByDate(selectedKey);

    if (!shouldGenerate || hasGenerated || hasGeneratedRef.current) {
      if (storyForDate && storyForDate.trim() !== '') {
        setLocalStory(storyForDate);
        setIsSaved(alreadySaved);
      }
      return;
    }

    if (shouldGenerate && diaryForDate?.trim()) {
      hasGeneratedRef.current = true;
      setHasGenerated(true);
      setLoading(true);
      setIsSaved(false);

      const generate = async () => {
        try {
          const text = await generateStory({
            diary: diaryForDate,
            mood: effectiveMood,
            character: effectiveCharacter,
          });
          setStoryByDate(selectedKey, text);
          deleteSavedStoryByDate(selectedKey); // 새로 만들면 저장상태 초기화
          setLocalStory(text);
          setIsSaved(false);
        } catch (error) {
          console.error('동화 생성 오류:', error);
          setLocalStory('동화 생성에 실패했어요.');
        } finally {
          setLoading(false);
        }
      };

      generate();
    }
  }, [hydrated, selectedKey, shouldGenerate, hasGenerated]);

  const toggleSave = () => {
    if (isSaved) {
      deleteSavedStoryByDate(selectedKey);
      setIsSaved(false);
    } else {
      saveStoryByDate(selectedKey);
      setIsSaved(true);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto text-white">
      <h1 className="text-2xl font-bold mb-4 text-rose-200">
        ✨ {formatDateTitle(selectedKey)}의 동화
      </h1>

      <button
        onClick={() => {
          router.push(`/story?generate=true&date=${selectedKey}`);
        }}
        disabled={loading}
        className="bg-rose-600 hover:bg-rose-700 px-4 py-2 rounded-xl mb-6"
      >
        {loading ? '생성 중...' : localStory ? '다른 동화 생성하기' : '동화 생성하기'}
      </button>

      {localStory && (
        <div className="relative bg-[#1d1b16] text-lg whitespace-pre-wrap p-6 rounded-2xl mb-4 leading-relaxed">
          <button
            onClick={toggleSave}
            className="absolute top-4 right-4"
          >
            {isSaved ? (
              <BookmarkCheck className="w-6 h-6 text-yellow-400" />
            ) : (
              <Bookmark className="w-6 h-6 text-white opacity-30 hover:opacity-80" />
            )}
          </button>
          {localStory}
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
