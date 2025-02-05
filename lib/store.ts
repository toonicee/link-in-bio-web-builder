import { create } from 'zustand';

interface WebsiteState {
  title: string;
  imageUrl: string;
  content: string;
  footer: string;
  setTitle: (title: string) => void;
  setImageUrl: (url: string) => void;
  setContent: (content: string) => void;
  setFooter: (footer: string) => void;
}

export const useWebsiteStore = create<WebsiteState>((set) => ({
  title: '',
  imageUrl: '',
  content: '',
  footer: '',
  setTitle: (title) => set({ title }),
  setImageUrl: (imageUrl) => set({ imageUrl }),
  setContent: (content) => set({ content }),
  setFooter: (footer) => set({ footer }),
}));