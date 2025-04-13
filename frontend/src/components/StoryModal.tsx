// src/components/StoryModal.tsx
'use client';

import { useEffect } from 'react';

interface StoryModalProps {
  text: string;
  onClose: () => void;
}

export default function StoryModal({ text, onClose }: StoryModalProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 backdrop-blur-sm bg-black/40 flex items-center justify-center">
      <div className="bg-[#1d1b16] text-white max-w-xl w-full max-h-[80vh] overflow-y-auto p-6 rounded-2xl shadow-xl relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-400 hover:text-white text-xl"
        >
          ✕
        </button>
        <div className="whitespace-pre-wrap text-lg leading-relaxed font-serif">
          {text}
        </div>
      </div>
    </div>
  );
}
