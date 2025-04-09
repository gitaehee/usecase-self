// app/mypage/page.tsx

'use client';

import { useStoryStore } from '@/lib/store';
import { useState } from 'react';

export default function MyPage() {
  const {
    defaultMood,
    defaultCharacter,
    setDefaults,
    storyHistory,
    savedStories,
  } = useStoryStore();

  const [mood, setMood] = useState(defaultMood);
  const [character, setCharacter] = useState(defaultCharacter);

  const handleSave = () => {
    setDefaults({ mood, character });
    alert('기본 설정이 저장되었어요!');
  };

  return (
    <div className="p-6 max-w-xl mx-auto text-white">
      <h1 className="text-2xl font-bold mb-6 text-pink-100">🌟 마이페이지</h1>

      {/* 기본 설정 */}
      <div className="bg-[#1d1b16] rounded-xl p-4 mb-6 border border-[#3f3c36] shadow-inner space-y-4">
        <div>
          <label className="block mb-1 text-pink-200">기본 무드</label>
          <select
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            className="bg-[#2a281f] text-white border border-[#5c584f] p-2 rounded-lg w-full"
          >
            <option value="happy">해피엔딩</option>
            <option value="sad">슬픈엔딩</option>
            <option value="angry">화남엔딩</option>
            <option value="revenge">복수엔딩</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 text-pink-200">기본 캐릭터</label>
          <select
            value={character}
            onChange={(e) => setCharacter(e.target.value)}
            className="bg-[#2a281f] text-white border border-[#5c584f] p-2 rounded-lg w-full"
          >
            <option value="토끼">토끼</option>
            <option value="고양이">고양이</option>
            <option value="강아지">강아지</option>
          </select>
        </div>

        <button
          onClick={handleSave}
          className="bg-pink-300 hover:bg-pink-400 text-black font-semibold w-full py-2 rounded-xl mt-2"
        >
          설정 저장하기 💾
        </button>
      </div>

      {/* 최근 생성한 동화 */}
      <div className="mb-10">
        <h2 className="text-xl text-pink-200 mb-3">📖 최근 생성한 동화</h2>
        <ul className="space-y-3">
          {storyHistory.length === 0 ? (
            <p className="text-gray-400">아직 생성된 동화가 없어요.</p>
          ) : (
            storyHistory.map((s, i) => (
              <li
                key={i}
                className="bg-[#2a281f] text-sm text-gray-100 p-4 rounded-xl border border-[#4c493f]"
              >
                {s.slice(0, 100)}...
              </li>
            ))
          )}
        </ul>
      </div>

      {/* ⭐ 저장한 동화 */}
      <div>
        <h2 className="text-xl text-yellow-200 mb-3">⭐ 저장한 동화</h2>
        <ul className="space-y-3">
          {savedStories.length === 0 ? (
            <p className="text-gray-400">저장된 동화가 아직 없어요.</p>
          ) : (
            savedStories.map((s, i) => (
              <li
                key={i}
                className="bg-[#2a281f] text-sm text-yellow-100 p-4 rounded-xl border border-[#5a554a]"
              >
                {s.slice(0, 100)}...
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
