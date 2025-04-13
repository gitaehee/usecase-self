// app/poem/page.tsx

'use client';

import { useStoryStore } from '@/lib/store';
import { generatePoem } from '@/lib/api';
import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function PoemPage() {
  const {
    diary,
    mood,
    character,
    defaultMood,
    defaultCharacter,
    poem,
    setPoem,
    setDiary,
    getDiaryByDate,
    savePoem,
    savedPoems,
  } = useStoryStore();

  const searchParams = useSearchParams();
  const shouldGenerate = searchParams.get('generate') === 'true';
  const dateParam = searchParams.get('date');
  const selectedKey = dateParam || new Date().toISOString().split('T')[0];

  const [localPoem, setLocalPoem] = useState(poem || '');
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const alreadySaved = savedPoems.includes(poem);

  const effectiveMood = mood || defaultMood;
  const effectiveCharacter = character || defaultCharacter;
  const hasGeneratedRef = useRef(false);

  useEffect(() => {
    const diaryForDate = getDiaryByDate(selectedKey);

    // ✅ 기존 시 불러오기
    if (!shouldGenerate && poem) {
      setLocalPoem(poem);
      return;
    }

    if (!hasGeneratedRef.current && shouldGenerate && diaryForDate) {
      hasGeneratedRef.current = true;

      const generate = async () => {
        setLoading(true);
        try {
          const text = await generatePoem({
            diary: diaryForDate,
            mood: effectiveMood,
            character: effectiveCharacter,
          });
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
  }, [selectedKey]);

  return (
    <div className="p-6 max-w-xl mx-auto text-white">
      <h1 className="text-2xl font-bold mb-6 text-pink-200">🌙 오늘의 시</h1>

      <div className="whitespace-pre-wrap bg-[#1d1b16] p-6 rounded-2xl border border-[#3f3c36] shadow-inner text-lg leading-relaxed font-serif min-h-[200px]">
        {loading ? '시를 만드는 중...' : localPoem || '일기를 먼저 작성해주세요.'}
      </div>

      {localPoem && !alreadySaved && (
        <button
          onClick={() => {
            savePoem();
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
    </div>
  );
}
