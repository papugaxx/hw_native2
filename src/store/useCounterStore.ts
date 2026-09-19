import { create } from 'zustand';

type CounterStore = {
  count: number;
  increment: (value: number) => void;
  decrement: (value: number) => void;
  reset: () => void;
};

export const useCounterStore = create<CounterStore>((set) => ({
  count: 0,

  increment: (value) =>
    set((state) => ({
      count: Math.max(0, state.count + value),
    })),

  decrement: (value) =>
    set((state) => ({
      count: Math.max(0, state.count - value),
    })),

  reset: () => set({
    count: 0,
  }),
}));