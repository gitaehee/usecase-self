// src/app/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStoryStore } from '@/lib/store';
import dynamic from 'next/dynamic';
import 'react-calendar/dist/Calendar.css';

// ⛔ Calendar는 SSR 비활성화된 상태로 동적 import
const Calendar = dynamic(() => import('react-calendar'), { ssr: false });

const getKeyFromDate = (date: Date) => date.toISOString().split('T')[0];
const formatDisplayDate = (date: Date) =>
  date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  });

export default function Home() {
  const router = useRouter();
  const {
    diary,
    story,
    poem,
    setDiary,
    setDiaryByDate,
    getDiaryByDate,
    setStory,
    setPoem,
  } = useStoryStore();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [localDiary, setLocalDiary] = useState('');
  const [saved, setSaved] = useState(false);

  const selectedKey = getKeyFromDate(selectedDate);
  const todayKey = getKeyFromDate(new Date());

  useEffect(() => {
    const savedDiary = getDiaryByDate(selectedKey);
    setLocalDiary(savedDiary || '');
    setDiary(savedDiary || '');
    setSaved(!!savedDiary);
  }, [selectedKey]);

  const handleSave = () => {
    if (!localDiary.trim()) {
      alert('일기를 입력해주세요!');
      return;
    }
    const cleanDiary = localDiary.trim();
    setDiaryByDate(selectedKey, cleanDiary);
    setDiary(cleanDiary);
    setStory('');
    setPoem('');
    setSaved(true);
  };

  const handleReset = () => {
    setDiaryByDate(selectedKey, '');
    setDiary('');
    setStory('');
    setPoem('');
    setLocalDiary('');
    setSaved(false);
  };

  const handleGoToStory = () => {
    if (!localDiary.trim()) {
      alert('일기를 먼저 작성해주세요!');
      return;
    }
    router.push(`/story?generate=true&date=${selectedKey}`);
  };

  const handleGoToPoem = () => {
    if (!localDiary.trim()) {
      alert('일기를 먼저 작성해주세요!');
      return;
    }
    router.push(`/poem?generate=true&date=${selectedKey}`);
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <Calendar
        onChange={(value) => setSelectedDate(value as Date)}
        value={selectedDate}
        tileContent={({ date, view }) => {
          const key = getKeyFromDate(date);
          return getDiaryByDate(key) ? <span className="text-green-400">✔</span> : null;
        }}
      />

      <h1 className="text-xl font-bold text-gray-400 mt-6 mb-2">{formatDisplayDate(selectedDate)}</h1>
      <h2 className="text-2xl font-bold mb-4 text-white">일기 작성</h2>

      {saved && (
        <div className="bg-yellow-50 border border-yellow-300 text-yellow-800 p-4 rounded mb-4">
          이 날의 일기가 저장되어 있어요 😊
          <br />
          <button
            onClick={handleReset}
            className="mt-2 inline-flex items-center gap-1 text-red-500 hover:text-red-600 text-sm"
          >
            🗑️ 삭제하고 다시 쓸게요
          </button>
        </div>
      )}

      <textarea
        value={localDiary}
        onChange={(e) => setLocalDiary(e.target.value)}
        placeholder="이 날의 이야기를 남겨보세요."
        className="w-full p-4 border border-gray-300 rounded mb-4 bg-black text-white"
        rows={6}
      />

      <button
        onClick={handleSave}
        className="bg-green-300 hover:bg-green-400 text-black px-4 py-2 rounded-xl w-full font-semibold mb-4"
      >
        📒 일기 저장하기
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