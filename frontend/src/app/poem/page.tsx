// app/poem/page.tsx

'use client';

import { useStoryStore } from '@/lib/store';
import { generatePoem } from '@/lib/api';
import { useEffect, useState } from 'react';

export default function PoemPage() {
  const { diary, mood, character } = useStoryStore();
  const [poem, setPoem] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!diary) return;

    generatePoem({ diary, mood, character })
      .then((text) => setPoem(text))
      .catch(() => setPoem('시를 만드는 데 실패했어요.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6 max-w-xl mx-auto text-white">
      <h1 className="text-2xl font-bold mb-6 text-pink-200">🌙 오늘의 시</h1>
      <div className="whitespace-pre-wrap bg-[#1d1b16] p-6 rounded-2xl border border-[#3f3c36] shadow-inner text-lg leading-relaxed font-serif">
        {loading ? '시를 쓰는 중입니다...' : poem}
      </div>
    </div>
  );
}
