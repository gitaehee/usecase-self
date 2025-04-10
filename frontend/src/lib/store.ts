// src/lib/store.ts

'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface StoryStore {
  diary: string;
  diaryByDate: { [date: string]: string }; // ✅ 날짜별 일기 저장

  mood: string;
  character: string;
  story: string;
  poem: string;

  storyHistory: string[];
  savedStories: string[];
  poemHistory: string[];
  savedPoems: string[];

  defaultMood: string;
  defaultCharacter: string;

  setDiary: (text: string) => void;
  setDiaryByDate: (date: string, text: string) => void;  // ✅ 추가
  getDiaryByDate: (date: string) => string | undefined;  // ✅ 추가

  setStory: (text: string) => void;
  setPoem: (text: string) => void;
  saveStory: () => void;
  savePoem: () => void;
  deleteSavedStory: (index: number) => void;
  deleteSavedPoem: (index: number) => void;
  setDefaults: (defaults: { mood: string; character: string }) => void;
}

export const useStoryStore = create<StoryStore>()(
  persist(
    (set, get) => ({
      diary: '',
      diaryByDate: {}, // ✅ 초기값

      mood: '',
      character: '',
      story: '',
      poem: '',

      storyHistory: [],
      savedStories: [],
      poemHistory: [],
      savedPoems: [],

      defaultMood: 'happy',
      defaultCharacter: '토끼',

      setDiary: (text) => set({ diary: text }),

      setDiaryByDate: (date, text) =>
        set((state) => ({
          diaryByDate: {
            ...state.diaryByDate,
            [date]: text,
          },
          diary: text, // 현재 다이어리도 업데이트
        })),

      getDiaryByDate: (date) => get().diaryByDate?.[date] || '',

      setStory: (text) =>
        set((state) => ({
          story: text,
          storyHistory: [...state.storyHistory, text],
        })),
      setPoem: (text) =>
        set((state) => ({
          poem: text,
          poemHistory: [...state.poemHistory, text],
        })),
      saveStory: () =>
        set((state) => ({
          savedStories: [...state.savedStories, state.story],
        })),
      savePoem: () =>
        set((state) => ({
          savedPoems: [...state.savedPoems, state.poem],
        })),
      deleteSavedStory: (index) =>
        set((state) => ({
          savedStories: state.savedStories.filter((_, i) => i !== index),
        })),
      deleteSavedPoem: (index) =>
        set((state) => ({
          savedPoems: state.savedPoems.filter((_, i) => i !== index),
        })),
      setDefaults: ({ mood, character }) =>
        set({ defaultMood: mood, defaultCharacter: character }),
    }),
    {
      name: 'story-storage',
    }
  )
);
