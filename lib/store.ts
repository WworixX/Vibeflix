"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Profile = {
  id: string;
  name: string;
  color: string;
  kids?: boolean;
};

type State = {
  isAuthed: boolean;
  email: string | null;
  isPremium: boolean;
  billing: "monthly" | "yearly";
  profileId: string | null;
  profiles: Profile[];
  watchlist: string[];
  signIn: (email: string) => void;
  signOut: () => void;
  upgrade: (billing?: "monthly" | "yearly") => void;
  downgrade: () => void;
  selectProfile: (id: string) => void;
  addProfile: (p: Omit<Profile, "id">) => void;
  toggleWatch: (titleId: string) => void;
};

const defaultProfiles: Profile[] = [
  { id: "p1", name: "Noah", color: "from-mint-400 via-mint-500 to-mint-700" },
  { id: "p2", name: "Lina", color: "from-amber-200 via-rose-400 to-fuchsia-500" },
  { id: "p3", name: "Kids", color: "from-cyan-300 via-emerald-400 to-mint-500", kids: true },
];

export const useStore = create<State>()(
  persist(
    (set, get) => ({
      isAuthed: false,
      email: null,
      isPremium: false,
      billing: "monthly",
      profileId: null,
      profiles: defaultProfiles,
      watchlist: [],
      signIn: (email) => set({ isAuthed: true, email }),
      signOut: () =>
        set({ isAuthed: false, email: null, profileId: null, isPremium: false }),
      upgrade: (billing = "monthly") => set({ isPremium: true, billing }),
      downgrade: () => set({ isPremium: false }),
      selectProfile: (id) => set({ profileId: id }),
      addProfile: (p) =>
        set({ profiles: [...get().profiles, { ...p, id: `p${Date.now()}` }] }),
      toggleWatch: (titleId) =>
        set({
          watchlist: get().watchlist.includes(titleId)
            ? get().watchlist.filter((id) => id !== titleId)
            : [...get().watchlist, titleId],
        }),
    }),
    { name: "vibeflix-store-v2" }
  )
);
