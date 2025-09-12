// src/store/usePrjStore.ts
import { create } from "zustand";
import type { ImageSourcePropType } from "react-native";
import { Prj, PrjName, projects } from "../../data/projects";

type PrjState = {
  selectedProject: Prj;
  setSelectedProject: (p: Prj) => void;
  setSelectedByTitle: (t: PrjName) => void;
};

export const usePrjStore = create<PrjState>((set, get) => ({
  selectedProject: projects[0], // single source of truth
  setSelectedProject: (p) => {
    if (get().selectedProject.title !== p.title) set({ selectedProject: p });
  },
  setSelectedByTitle: (t) => {
    const found = projects.find((p) => p.title === t);
    if (found && get().selectedProject.title !== found.title) {
      set({ selectedProject: found });
    }
  },
}));
