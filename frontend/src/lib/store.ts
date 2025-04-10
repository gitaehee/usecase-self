// src/lib/store.ts

import { create } from 'zustand';
interface StoryState {
  diary: string;
  mood: string;
  character: string;
  story: string;
  storyHistory: string[];
  defaultMood: string;
  defaultCharacter: string;
  savedStories: string[]; // ⭐ 저장된 동화
  poem: string; // ✅ 시 저장 필드 추가
  setStory: (data: { diary: string; mood: string; character: string }) => void;
  setStoryText: (text: string) => void;
  setDefaults: (data: { mood: string; character: string }) => void;
  saveStory: (story: string) => void; // ⭐ 저장 함수
  setPoem: (poem: string) => void; // ✅ 추가
}


export const useStoryStore = create<StoryState>((set, get) => ({
  diary: '',
  mood: 'happy',
  character: '토끼',
  poem: '', // ✅ 시 저장 필드 추가
  story: '',
  storyHistory: [],
  savedStories: [], // ⭐
  defaultMood: 'happy',
  defaultCharacter: '토끼',
  setPoem: (poem) => set({ poem }), // ✅ 추가

  setStory: ({ diary, mood, character }) => set({ diary, mood, character }),

  setStoryText: (story) => {
    const { storyHistory } = get();
    set({ story, storyHistory: [story, ...storyHistory.slice(0, 4)] });
  },

  setDefaults: ({ mood, character }) =>
    set({ defaultMood: mood, defaultCharacter: character }),

  saveStory: (story) => {
    const { savedStories } = get();
    if (!savedStories.includes(story)) {
      set({ savedStories: [story, ...savedStories] });
    }
  },
}));
