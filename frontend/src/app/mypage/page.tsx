// app/mypage/page.tsx


'use client';

import { useStoryStore } from '@/lib/store';
import { useState } from 'react';
import StoryModal from '../../components/StoryModal';

export default function MyPage() {
  const {
    defaultMood,
    defaultCharacter,
    setDefaults,
    storyByDate,
    savedStoriesByDate,
    poemByDate,
    savedPoemsByDate,
    getDiaryByDate,
    setStoryByDate,
    setPoemByDate,
  } = useStoryStore();

  const [openText, setOpenText] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [moodInput, setMoodInput] = useState(defaultMood);
  const [characterInput, setCharacterInput] = useState(defaultCharacter);
  const [storyPage, setStoryPage] = useState(1);
  const [poemPage, setPoemPage] = useState(1);
  const [sortStory, setSortStory] = useState<'saved' | 'oldest' | 'newest'>('saved');
  const [sortPoem, setSortPoem] = useState<'saved' | 'oldest' | 'newest'>('saved');

  const moodOptions = ['happy', 'sad', 'angry', 'revenge'];
  const characterOptions = ['토끼', '고양이', '강아지'];

  const handleMoodChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const value = e.target.value;
    setMoodInput(value);
    setDefaults({ mood: value, character: defaultCharacter });
  };

  const handleCharacterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const value = e.target.value;
    setCharacterInput(value);
    setDefaults({ mood: defaultMood, character: value });
  };

  const sortDates = (dates: string[], order: 'saved' | 'oldest' | 'newest') => {
    if (order === 'oldest') return [...dates].sort((a, b) => a.localeCompare(b));
    if (order === 'newest') return [...dates].sort((a, b) => b.localeCompare(a));
    // 저장순일 경우 역순으로 표시 (최근에 저장한 게 위로)
    return [...dates].reverse();
  };
  

  const sortedStoryDates = sortDates(
    Object.entries(savedStoriesByDate)
      .filter(([_, s]) => s)
      .map(([d]) => d),
    sortStory
  );
  const storyFiltered = sortedStoryDates.filter((d) => storyByDate[d]?.trim());
  const storyDisplay = storyFiltered.slice(0, 5 + (storyPage - 1) * 10);

  const sortedPoemDates = sortDates(
    Object.entries(savedPoemsByDate)
      .filter(([_, s]) => s)
      .map(([d]) => d),
    sortPoem
  );
  const poemFiltered = sortedPoemDates.filter((d) => poemByDate[d]?.trim());
  const poemDisplay = poemFiltered.slice(0, 5 + (poemPage - 1) * 10);

  return (
    <div className="p-6 max-w-xl mx-auto text-white">
      <h1 className="text-2xl font-bold mb-6 text-pink-100">🌟 마이페이지</h1>

      {/* 기본 설정 */}
      <div className="bg-[#1d1b16] rounded-xl p-4 mb-6 border border-[#3f3c36] shadow-inner space-y-4">
        <div>
          <label className="block mb-1 text-pink-200">기본 무드</label>
          <select
            value={moodOptions.includes(moodInput) ? moodInput : '기타'}
            onChange={handleMoodChange}
            className="bg-[#2a281f] text-white border border-[#5c584f] p-2 rounded-lg w-full mb-2"
          >
            {moodOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}엔딩
              </option>
            ))}
            <option value="기타">직접 입력</option>
          </select>
          {!moodOptions.includes(moodInput) && (
            <input
              type="text"
              value={moodInput}
              onChange={handleMoodChange}
              placeholder="예: 몽환엔딩"
              className="bg-[#2a281f] text-white border border-[#5c584f] p-2 rounded-lg w-full"
            />
          )}
        </div>
        <div>
          <label className="block mb-1 text-pink-200">기본 캐릭터</label>
          <select
            value={characterOptions.includes(characterInput) ? characterInput : '기타'}
            onChange={handleCharacterChange}
            className="bg-[#2a281f] text-white border border-[#5c584f] p-2 rounded-lg w-full mb-2"
          >
            {characterOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
            <option value="기타">직접 입력</option>
          </select>
          {!characterOptions.includes(characterInput) && (
            <input
              type="text"
              value={characterInput}
              onChange={handleCharacterChange}
              placeholder="예: 곰돌이, 여우 등"
              className="bg-[#2a281f] text-white border border-[#5c584f] p-2 rounded-lg w-full"
            />
          )}
        </div>
      </div>

      {/* 저장한 동화 */}
      <h2 className="text-xl text-yellow-200 mb-3">⭐ 저장한 동화</h2>
      <div className="flex gap-2 mb-4">
        {['saved', 'oldest', 'newest'].map((o) => (
          <button
            key={o}
            onClick={() => setSortStory(o as any)}
            className={`px-3 py-1 rounded ${
              sortStory === o ? 'bg-yellow-400 text-black' : 'bg-gray-600 text-white'
            }`}
          >
            {o === 'saved' ? '저장순' : o === 'oldest' ? '오래된 순' : '최신 순'}
          </button>
        ))}
      </div>
      <ul className="space-y-3 mb-2">
        {storyDisplay.length === 0 ? (
          <p className="text-gray-400">저장된 동화가 아직 없어요.</p>
        ) : (
          storyDisplay.map((date) => (
            <li
              key={date}
              className="bg-[#2a281f] text-sm text-yellow-100 p-4 rounded-xl border border-[#5a554a] cursor-pointer"
              onClick={() => {
                setOpenText(storyByDate[date] || '');
                setShowModal(true);
              }}
            >
              <div className="flex justify-between items-start gap-2">
                <div className="w-full">
                  <p className="font-medium mb-1">{date}</p>
                  <p className="break-words whitespace-pre-wrap line-clamp-3 overflow-hidden text-ellipsis">
                    {storyByDate[date]}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setStoryByDate(date, '');
                  }}
                  className="text-red-400 hover:text-red-500 text-sm"
                >
                  🗑️
                </button>
              </div>
            </li>
          ))
        )}
      </ul>
      {storyDisplay.length < storyFiltered.length && (
        <button onClick={() => setStoryPage((p) => p + 1)} className="text-yellow-300 hover:underline">
          더보기 +10개
        </button>
      )}

      {/* 저장한 시 */}
      <h2 className="text-xl text-purple-300 mb-3 mt-10">💖 저장한 시</h2>
      <div className="flex gap-2 mb-4">
        {['saved', 'oldest', 'newest'].map((o) => (
          <button
            key={o}
            onClick={() => setSortPoem(o as any)}
            className={`px-3 py-1 rounded ${
              sortPoem === o ? 'bg-purple-400 text-black' : 'bg-gray-600 text-white'
            }`}
          >
            {o === 'saved' ? '저장순' : o === 'oldest' ? '오래된 순' : '최신 순'}
          </button>
        ))}
      </div>
      <ul className="space-y-3 mb-2">
        {poemDisplay.length === 0 ? (
          <p className="text-gray-400">저장된 시가 아직 없어요.</p>
        ) : (
          poemDisplay.map((date) => (
            <li
              key={date}
              className="bg-[#2a281f] text-sm text-purple-100 p-4 rounded-xl border border-[#5a554a] cursor-pointer"
              onClick={() => {
                setOpenText(poemByDate[date] || '');
                setShowModal(true);
              }}
            >
              <div className="flex justify-between items-start gap-2">
                <div className="w-full">
                  <p className="font-medium mb-1">{date}</p>
                  <p className="break-words whitespace-pre-wrap line-clamp-3 overflow-hidden text-ellipsis">
                    {poemByDate[date]}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setPoemByDate(date, '');
                  }}
                  className="text-red-400 hover:text-red-500 text-sm"
                >
                  🗑️
                </button>
              </div>
            </li>
          ))
        )}
      </ul>
      {poemDisplay.length < poemFiltered.length && (
        <button onClick={() => setPoemPage((p) => p + 1)} className="text-purple-300 hover:underline">
          더보기 +10개
        </button>
      )}

      {showModal && <StoryModal text={openText} onClose={() => setShowModal(false)} />}
    </div>
  );
}
