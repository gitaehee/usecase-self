// app/mypage/page.tsx
'use client';

import { useStoryStore } from '@/lib/store';

export default function MyPage() {
  const {
    defaultMood,
    defaultCharacter,
    setDefaults,
    storyHistory,
    savedStories,
    savedPoems,
    deleteSavedStory, // ✅ 추가
    deleteSavedPoem,  // ✅ 추가
  } = useStoryStore();

  const handleMoodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDefaults({ mood: e.target.value, character: defaultCharacter });
  };

  const handleCharacterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDefaults({ mood: defaultMood, character: e.target.value });
  };

  return (
    <div className="p-6 max-w-xl mx-auto text-white">
      <h1 className="text-2xl font-bold mb-6 text-pink-100">🌟 마이페이지</h1>

      {/* 기본 설정 */}
      <div className="bg-[#1d1b16] rounded-xl p-4 mb-6 border border-[#3f3c36] shadow-inner space-y-4">
        <div>
          <label className="block mb-1 text-pink-200">기본 무드</label>
          <select
            value={defaultMood}
            onChange={handleMoodChange}
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
            value={defaultCharacter}
            onChange={handleCharacterChange}
            className="bg-[#2a281f] text-white border border-[#5c584f] p-2 rounded-lg w-full"
          >
            <option value="토끼">토끼</option>
            <option value="고양이">고양이</option>
            <option value="강아지">강아지</option>
          </select>
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
                  className="bg-[#2a281f] text-sm text-gray-100 p-4 rounded-xl border border-[#4c493f]"
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
                <span>{s.slice(0, 100)}...</span>
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
                <span>{p.slice(0, 100)}...</span>
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
    </div>
  );
}
