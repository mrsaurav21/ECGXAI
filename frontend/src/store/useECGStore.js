import { create } from 'zustand';

export const useECGStore = create((set) => ({
  activeRecord: null,
  history: [],
  selectedLead: 'II',
  filterBandpass: true,
  isLoading: false,
  error: null,

  setActiveRecord: (record) => set({ activeRecord: record, error: null }),
  setHistory: (history) => set({ history }),
  setSelectedLead: (lead) => set({ selectedLead: lead }),
  toggleFilter: () => set((state) => ({ filterBandpass: !state.filterBandpass })),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error, isLoading: false }),
  clearActiveRecord: () => set({ activeRecord: null, error: null }),
}));