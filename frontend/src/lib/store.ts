// src/lib/store.ts

'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface StoryStore {
  diary: string;
  diaryByDate: { [date: string]: string };

  mood: string;
  character: string;
  story: string;
  poem: string;

  storyByDate: { [date: string]: string };
  poemByDate: { [date: string]: string };
  savedStoriesByDate: { [date: string]: boolean };
  savedPoemsByDate: { [date: string]: boolean };

  storyHistory: string[];
  savedStories: string[];
  poemHistory: string[];
  savedPoems: string[];

  defaultMood: string;
  defaultCharacter: string;

  setDiary: (text: string) => void;
  setDiaryByDate: (date: string, text: string) => void;
  getDiaryByDate: (date: string) => string | undefined;

  getStoryByDate: (date: string) => string | undefined;
  setStoryByDate: (date: string, text: string) => void;
  saveStoryByDate: (date: string) => void;

  getPoemByDate: (date: string) => string | undefined;
  setPoemByDate: (date: string, text: string) => void;
  savePoemByDate: (date: string) => void;

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
      diaryByDate: {},

      mood: '',
      character: '',
      story: '',
      poem: '',

      storyByDate: {},
      poemByDate: {},
      savedStoriesByDate: {},
      savedPoemsByDate: {},

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
          diary: text,
        })),

      getDiaryByDate: (date) => get().diaryByDate?.[date] || '',

      getStoryByDate: (date) => get().storyByDate?.[date] || '',
      setStoryByDate: (date, text) =>
        set((state) => ({
          storyByDate: {
            ...state.storyByDate,
            [date]: text,
          },
        })),
      saveStoryByDate: (date) =>
        set((state) => ({
          savedStoriesByDate: {
            ...state.savedStoriesByDate,
            [date]: true,
          },
        })),

      getPoemByDate: (date) => get().poemByDate?.[date] || '',
      setPoemByDate: (date, text) =>
        set((state) => ({
          poemByDate: {
            ...state.poemByDate,
            [date]: text,
          },
        })),
      savePoemByDate: (date) =>
        set((state) => ({
          savedPoemsByDate: {
            ...state.savedPoemsByDate,
            [date]: true,
          },
        })),

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
      storage: createJSONStorage(() => localStorage),
      partialize: (state: StoryStore) => ({
        diary: state.diary,
        diaryByDate: state.diaryByDate,
        story: state.story,
        poem: state.poem,
        storyByDate: state.storyByDate,
        poemByDate: state.poemByDate,
        savedStoriesByDate: state.savedStoriesByDate,
        savedPoemsByDate: state.savedPoemsByDate,
        savedStories: state.savedStories,
        savedPoems: state.savedPoems,
        storyHistory: state.storyHistory,
        poemHistory: state.poemHistory,
        defaultMood: state.defaultMood,
        defaultCharacter: state.defaultCharacter,
      }),
    }
  )
);