// src/app/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStoryStore } from '@/lib/store';
import dynamic from 'next/dynamic';
import 'react-calendar/dist/Calendar.css';
import { CalendarType } from 'react-calendar';

const Calendar = dynamic(() => import('react-calendar'), { ssr: false });

const getKeyFromDate = (date: Date) => {
  return date.toLocaleDateString('sv-SE'); // YYYY-MM-DD (KST)
};

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
    storyHistory,
    storyHistoryByDate,
    setDiary,
    setDiaryByDate,
    getDiaryByDate,
    getStoryByDate,
    getPoemByDate,
    setStoryByDate,
    setPoemByDate,
    setStory,
    setPoem,
    addStoryToHistory,
    clearStoryHistoryByDate,
  } = useStoryStore();

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [localDiary, setLocalDiary] = useState('');
  const [saved, setSaved] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const selectedKey = selectedDate ? getKeyFromDate(selectedDate) : '';
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const isFutureDate = selectedDate
    ? new Date(selectedDate).setHours(0, 0, 0, 0) > today.getTime()
    : false;

  const hasSavedStory = !!getStoryByDate(selectedKey)?.trim();
  const hasSavedPoem = !!getPoemByDate(selectedKey)?.trim();
  const shouldShowPreview = saved || hasSavedStory || hasSavedPoem;
  const historyForDate = storyHistoryByDate[selectedKey] || [];

  useEffect(() => {
    if (!selectedDate) return;
    const savedDiary = getDiaryByDate(selectedKey);
    setLocalDiary(savedDiary || '');
    setDiary(savedDiary || '');
    setSaved(!!savedDiary);
    setShowHistory(false);
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
    setStoryByDate(selectedKey, '');
    setPoemByDate(selectedKey, '');
    clearStoryHistoryByDate(selectedKey);
    setSaved(true);
  };

  const handleReset = () => {
    setDiaryByDate(selectedKey, '');
    setDiary('');
    setStory('');
    setPoem('');
    setStoryByDate(selectedKey, '');
    setPoemByDate(selectedKey, '');
    clearStoryHistoryByDate(selectedKey);
    setLocalDiary('');
    setSaved(false);
  };

  const handleGoToStory = () => {
    if (!saved) {
      alert('먼저 일기를 저장해주세요!');
      return;
    }
    const hasStory = getStoryByDate(selectedKey)?.trim();
    router.push(`/story?generate=${!hasStory}&date=${selectedKey}`);
  };

  const handleGoToPoem = () => {
    if (!saved) {
      alert('먼저 일기를 저장해주세요!');
      return;
    }
    const hasPoem = getPoemByDate(selectedKey)?.trim();
    router.push(`/poem?generate=${!hasPoem}&date=${selectedKey}`);
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <div className="w-fit mx-auto scale-[1.2] md:scale-[1.25] mb-6">
        <Calendar
          onChange={(value) => setSelectedDate(value as Date)}
          value={selectedDate || new Date()}
          calendarType={'gregory' as CalendarType}
          tileClassName={({ date }) => {
            const key = getKeyFromDate(date);
            return getDiaryByDate(key) ? 'saved-date' : undefined;
          }}
        />
      </div>

      {selectedDate && (
        <>
          <h1 className="text-xl font-bold text-gray-400 mt-16 mb-2">
            {formatDisplayDate(selectedDate)}
          </h1>
          <h2 className="text-2xl font-bold mb-4 text-white">일기 작성</h2>

          {isFutureDate ? (
            <div className="text-red-400 text-sm mb-4">
              미래 날짜의 일기는 작성할 수 없어요!
            </div>
          ) : shouldShowPreview ? (
            <>
              {saved && (
                <div className="bg-yellow-50 border border-yellow-300 text-yellow-800 p-4 rounded mb-4">
                  ✅ 이 날의 일기가 저장되어 있어요 😊
                  <div className="mt-2 bg-white text-black p-3 rounded whitespace-pre-wrap text-sm max-h-40 overflow-y-auto">
                    {localDiary}
                  </div>
                  <button
                    onClick={handleReset}
                    className="mt-3 inline-flex items-center gap-1 text-red-500 hover:text-red-600 text-sm"
                  >
                    🗑️ 삭제하고 다시 쓸게요
                  </button>
                </div>
              )}

              <div className="space-y-3">
                {!hasSavedStory && (
                  <div
                    onClick={handleGoToStory}
                    className="cursor-pointer bg-pink-300 hover:bg-pink-400 text-black px-4 py-4 rounded-xl shadow-md transition-transform hover:scale-105"
                  >
                    ✨ 동화 만들기
                  </div>
                )}

                {hasSavedStory && (
                  <div
                    className="p-4 bg-[#1d1b16] text-white rounded-xl shadow-md hover:shadow-lg transition-transform hover:scale-105 cursor-pointer"
                    onClick={handleGoToStory}
                  >
                    <p className="text-pink-300 font-bold mb-2">
                      📖 {formatDisplayDate(selectedDate)}의 동화 미리보기
                    </p>
                    <div className="text-sm whitespace-pre-wrap overflow-hidden text-ellipsis max-h-[100px] line-clamp-4">
                      {getStoryByDate(selectedKey) || '동화가 아직 없어요.'}
                    </div>
                    <p className="mt-2 text-sm text-blue-300 hover:underline">전체 보기 →</p>
                  </div>
                )}

                {!hasSavedPoem && (
                  <div
                    onClick={handleGoToPoem}
                    className="cursor-pointer bg-purple-300 hover:bg-purple-400 text-black px-4 py-4 rounded-xl shadow-md transition-transform hover:scale-105"
                  >
                    🌙 시 만들기
                  </div>
                )}

                {hasSavedPoem && (
                  <div
                    className="p-4 bg-[#1d1b16] text-white rounded-xl shadow-md hover:shadow-lg transition-transform hover:scale-105 cursor-pointer"
                    onClick={handleGoToPoem}
                  >
                    <p className="text-purple-300 font-bold mb-2">🌙 시 미리보기</p>
                    <div className="text-sm whitespace-pre-wrap overflow-hidden text-ellipsis max-h-[100px]">
                      {getPoemByDate(selectedKey) || '시는 아직 없어요.'}
                    </div>
                    <p className="mt-2 text-sm text-blue-300 hover:underline">전체 보기 →</p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
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
                <div
                  onClick={handleGoToStory}
                  className="cursor-pointer bg-pink-300 hover:bg-pink-400 text-black px-4 py-4 rounded-xl shadow-md transition-transform hover:scale-105"
                >
                  ✨ 동화 만들기
                </div>

                <div
                  onClick={handleGoToPoem}
                  className="cursor-pointer bg-purple-300 hover:bg-purple-400 text-black px-4 py-4 rounded-xl shadow-md transition-transform hover:scale-105"
                >
                  🌙 시 만들기
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
