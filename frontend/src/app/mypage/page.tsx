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
    storyHistory,
    savedStories,
    savedPoems,
    deleteSavedStory,
    deleteSavedPoem,
  } = useStoryStore();

  const [openText, setOpenText] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [moodInput, setMoodInput] = useState(defaultMood);
  const [characterInput, setCharacterInput] = useState(defaultCharacter);

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
              <option key={opt} value={opt}>{opt}엔딩</option>
            ))}
            <option value="기타">직접 입력</option>
          </select>
          {moodOptions.includes(moodInput) ? null : (
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
              <option key={opt} value={opt}>{opt}</option>
            ))}
            <option value="기타">직접 입력</option>
          </select>
          {characterOptions.includes(characterInput) ? null : (
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

      {/* 최근 생성한 동화 */}
      <div className="mb-10">
        <h2 className="text-xl text-pink-200 mb-3">📖 최근 생성한 동화</h2>
        <ul className="space-y-3">
          {storyHistory.length === 0 ? (
            <p className="text-gray-400">아직 생성된 동화가 없어요.</p>
          ) : (
            [...storyHistory]
              .slice(-5)
              .reverse()
              .map((s, i) => (
                <li
                  key={i}
                  className="bg-[#2a281f] text-sm text-gray-100 p-4 rounded-xl border border-[#4c493f] cursor-pointer"
                  onClick={() => {
                    setOpenText(s);
                    setShowModal(true);
                  }}
                >
                  {s.slice(0, 100)}...
                </li>
              ))
          )}
        </ul>
      </div>

      {/* ⭐ 저장한 동화 */}
      <div className="mb-10">
        <h2 className="text-xl text-yellow-200 mb-3">⭐ 저장한 동화</h2>
        <ul className="space-y-3">
          {savedStories.length === 0 ? (
            <p className="text-gray-400">저장된 동화가 아직 없어요.</p>
          ) : (
            savedStories.map((s, i) => (
              <li
                key={i}
                className="bg-[#2a281f] text-sm text-yellow-100 p-4 rounded-xl border border-[#5a554a] flex justify-between items-start gap-4"
              >
                <span
                  onClick={() => {
                    setOpenText(s);
                    setShowModal(true);
                  }}
                  className="cursor-pointer flex-1"
                >
                  {s.slice(0, 100)}...
                </span>
                <button
                  onClick={() => deleteSavedStory(i)}
                  className="text-red-300 hover:text-red-500 text-xs"
                >
                  🗑️
                </button>
              </li>
            ))
          )}
        </ul>
      </div>

      {/* 💖 저장한 시 */}
      <div>
        <h2 className="text-xl text-purple-300 mb-3">💖 저장한 시</h2>
        <ul className="space-y-3">
          {savedPoems.length === 0 ? (
            <p className="text-gray-400">저장된 시가 아직 없어요.</p>
          ) : (
            savedPoems.map((p, i) => (
              <li
                key={i}
                className="bg-[#2a281f] text-sm text-purple-100 p-4 rounded-xl border border-[#5a554a] flex justify-between items-start gap-4"
              >
                <span
                  onClick={() => {
                    setOpenText(p);
                    setShowModal(true);
                  }}
                  className="cursor-pointer flex-1"
                >
                  {p.slice(0, 100)}...
                </span>
                <button
                  onClick={() => deleteSavedPoem(i)}
                  className="text-red-300 hover:text-red-500 text-xs"
                >
                  🗑️
                </button>
              </li>
            ))
          )}
        </ul>
      </div>

      {showModal && (
        <StoryModal text={openText} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
}
