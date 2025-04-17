// app/poem/page.tsx
'use client';

import { useStoryStore } from '@/lib/store';
import { generatePoem } from '@/lib/api';
import { useEffect, useRef, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

const getKSTDateKey = () => {
  const date = new Date();
  const offset = date.getTimezoneOffset() * 60000;
  const kstDate = new Date(date.getTime() - offset + 9 * 60 * 60000);
  return kstDate.toISOString().split('T')[0];
};

export default function PoemPage() {
  const {
    mood,
    character,
    defaultMood,
    defaultCharacter,
    setDiary,
    getDiaryByDate,
    getPoemByDate,
    setPoemByDate,
    savePoemByDate,
    savedPoemsByDate,
    setPoem,
  } = useStoryStore();

  const searchParams = useSearchParams();
  const router = useRouter();
  const shouldGenerate = searchParams.get('generate') === 'true';
  const dateParam = searchParams.get('date');
  const selectedKey = dateParam || getKSTDateKey();

  const [localPoem, setLocalPoem] = useState('');
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  const alreadySaved = savedPoemsByDate[selectedKey];
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
    const poemForDate = getPoemByDate(selectedKey);

    if (!shouldGenerate && poemForDate && poemForDate.trim() !== '') {
      setLocalPoem(poemForDate);
      return;
    }

    if (!hasGeneratedRef.current && shouldGenerate && diaryForDate && diaryForDate.trim() !== '') {
      hasGeneratedRef.current = true;
      setDiary(diaryForDate);

      const generate = async () => {
        setLoading(true);
        try {
          const text = await generatePoem({
            diary: diaryForDate,
            mood: effectiveMood,
            character: effectiveCharacter,
          });
          setPoemByDate(selectedKey, text);
          setPoem(text);
          setLocalPoem(text);
        } catch {
          setLocalPoem('시를 만드는 데 실패했어요.');
        } finally {
          setLoading(false);
        }
      };

      generate();
    }
  }, [hydrated, selectedKey, shouldGenerate]);

  return (
    <div className="p-6 max-w-xl mx-auto text-white">
      <h1 className="text-2xl font-bold mb-6 text-pink-200">
        🌙 {formatDateTitle(selectedKey)}의 시
      </h1>

      <div className="whitespace-pre-wrap bg-[#1d1b16] p-6 rounded-2xl border border-[#3f3c36] shadow-inner text-lg leading-relaxed font-serif min-h-[200px]">
        {loading ? '시를 만드는 중...' : localPoem || '일기를 먼저 작성해주세요.'}
      </div>

      {localPoem && !alreadySaved && (
        <button
          onClick={() => {
            savePoemByDate(selectedKey);
            setSaved(true);
          }}
          className="mt-6 w-full px-4 py-2 rounded-xl font-semibold bg-yellow-300 hover:bg-yellow-400 text-black"
        >
          💖 이 시 저장하기
        </button>
      )}

      {saved || alreadySaved ? (
        <div className="mt-4 text-green-400 text-center">✅ 시가 저장되었습니다!</div>
      ) : null}

      <button
        onClick={() => router.push('/')}
        className="mt-6 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-xl w-full"
      >
        🗓️ 달력으로 돌아가기
      </button>
    </div>
  );
}
