// src/app/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStoryStore } from '@/lib/store';

const getTodayKey = () => new Date().toISOString().split('T')[0];
const getTodayDisplay = () =>
  new Date().toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  });

export default function Home() {
  const router = useRouter();
  const today = getTodayKey();

  const {
    setDiary,
    setDiaryByDate,
    getDiaryByDate,
    setStory,
    setPoem,
    diary,
  } = useStoryStore();

  const [localDiary, setLocalDiary] = useState('');
  const [saved, setSaved] = useState(false);
  const [isClient, setIsClient] = useState(false); // 👈 hydration-safe

  useEffect(() => {
    setIsClient(true); // ✅ hydration-safe trigger
    const saved = getDiaryByDate(today);
    setLocalDiary(saved || '');
    setDiary(saved || '');
  }, []);

  const handleSaveTodayDiary = () => {
    if (!localDiary.trim()) {
      alert('일기를 입력해주세요!');
      return;
    }

    const cleanDiary = localDiary.trim();
    setDiaryByDate(today, cleanDiary);
    setDiary(cleanDiary);
    setStory('');
    setPoem('');
    setSaved(true);
  };

  const handleResetToday = () => {
    setDiaryByDate(today, '');
    setDiary('');
    setStory('');
    setPoem('');
    setLocalDiary('');
    setSaved(false);
  };

  const handleGoToStory = () => {
    const diaryContent = getDiaryByDate(today);
    if (!diaryContent || !diaryContent.trim()) {
      alert('먼저 일기를 저장해주세요!');
      return;
    }
    router.push('/story?generate=true');
  };

  const handleGoToPoem = () => {
    const diaryContent = getDiaryByDate(today);
    if (!diaryContent || !diaryContent.trim()) {
      alert('먼저 일기를 저장해주세요!');
      return;
    }
    router.push('/poem?generate=true');
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-xl font-bold text-gray-400 mb-2">{getTodayDisplay()}</h1>
      <h2 className="text-2xl font-bold mb-4 text-white">오늘의 일기</h2>

      {/* ✅ 클라이언트에서만 렌더링되게 조심 */}
      {isClient && getDiaryByDate(today)?.trim() && (
        <div className="bg-yellow-50 border border-yellow-300 text-yellow-800 p-4 rounded mb-4">
          오늘 일기를 저장했어요 😊
          <br />
          <button
            onClick={handleResetToday}
            className="mt-2 inline-flex items-center gap-1 text-red-500 hover:text-red-600 text-sm"
          >
            🗑️ 일기 삭제하고 다시 쓸게요
          </button>
        </div>
      )}

      <textarea
        value={localDiary}
        onChange={(e) => setLocalDiary(e.target.value)}
        placeholder="오늘 하루는 어땠나요?"
        className="w-full p-4 border border-gray-300 rounded mb-4 bg-black text-white"
        rows={6}
      />

      <button
        onClick={handleSaveTodayDiary}
        className="bg-green-300 hover:bg-green-400 text-black px-4 py-2 rounded-xl w-full font-semibold mb-4"
      >
        📒 오늘의 일기 저장하기
      </button>

      <div className="space-y-3">
        <button
          onClick={handleGoToStory}
          className="bg-pink-300 hover:bg-pink-400 text-black px-4 py-2 rounded-xl w-full font-semibold"
        >
          ✨ 동화 만들기
        </button>

        <button
          onClick={handleGoToPoem}
          className="bg-purple-300 hover:bg-purple-400 text-black px-4 py-2 rounded-xl w-full font-semibold"
        >
          🌙 시 만들기
        </button>
      </div>
    </div>
  );
}
