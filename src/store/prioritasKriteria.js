/** @format */

import { create } from "zustand";
import { devtools } from "zustand/middleware";

const usePrioritasKriteria = create(
  devtools((set, get) => ({
    dtPrioritasKriteria: [],
    setPrioritasKriteria: () => {
      try {
        const dataPrioritasKriteria =
          JSON.parse(localStorage.getItem("prioritasKriteria")) || [];
        set((state) => ({
          ...state,
          dtPrioritasKriteria: dataPrioritasKriteria,
        }));
        return {
          status: "berhasil",
        };
      } catch (error) {
        return {
          status: "error",
          error: error,
        };
      }
    },
    // tambah data
    addData: async (row) => {
      try {
        try {
          set(() => ({
            dtPrioritasKriteria: row,
          }));
          // mengambil isi state
          const isiState = get().dtPrioritasKriteria;
          // konversi json ke string
          // tambahkan ke localstorage
          localStorage.setItem("prioritasKriteria", JSON.stringify(isiState));
          return {
            status: "berhasil tambah",
            data: row,
          };
        } catch (error) {
          return {
            status: "error",
            data: error,
          };
        }
      } catch (error) {
        return {
          status: "error",
          data: error,
        };
      }
    },
  }))
);

export default usePrioritasKriteria;
