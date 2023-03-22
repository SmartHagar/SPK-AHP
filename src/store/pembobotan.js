/** @format */

import { create } from "zustand";
import { devtools } from "zustand/middleware";

const usePembobotan = create(
  devtools((set, get) => ({
    dtPembobotan: [],
    setGabung: () => {
      const dataPembobotan =
        JSON.parse(localStorage.getItem("pembobotan")) || [];
      const dataKriteria = JSON.parse(localStorage.getItem("kriteria")) || [];
      // menggabungkan data
      const dataGabungan = dataPembobotan.map((pembobotan) => {
        const kriteria = dataKriteria.find(
          (kriteria) => kriteria.id === pembobotan.kriteria_id
        );
        return {
          ...pembobotan,
          kriteria,
        };
      });
      return dataGabungan;
    },
    setPembobotan: async ({}) => {
      try {
        const dataGabungan = get().setGabung();
        // sortir by nama kriteria
        const dataGabunganSorted = dataGabungan.sort((a, b) => {
          if (a.kriteria.nama < b.kriteria.nama) {
            return -1;
          }
          if (a.kriteria.nama > b.kriteria.nama) {
            return 1;
          }
          return 0;
        });
        set((state) => ({ ...state, dtPembobotan: dataGabunganSorted }));
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
        // ambil data dari local storage
        const getData = JSON.parse(localStorage.getItem("pembobotan")) || [];
        // tambah data ke array
        const addData = [row, ...getData];
        // konversi json ke string
        // tambahkan ke localstorage
        localStorage.setItem("pembobotan", JSON.stringify(addData));
        // memanggil isi data
        const dataGabungan = get().setGabung();
        set((state) => ({ ...state, dtPembobotan: dataGabungan }));
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
    },
    // hapus data
    removeData: async (id) => {
      try {
        set((prevState) => ({
          dtPembobotan: prevState.dtPembobotan.filter((item) => item.id !== id),
        }));
        // mengambil isi state
        // @ts-ignore
        const isiState = get().dtPembobotan;
        // konversi json ke string
        // tambahkan ke localstorage
        localStorage.setItem("pembobotan", JSON.stringify(isiState));
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
    // ubah data
    updateData: async (id, row) => {
      try {
        // ambil data dari local storage
        const getData = JSON.parse(localStorage.getItem("pembobotan"));
        // ubah data array berdasarkan id
        const addData = getData.map((item) => {
          if (item.id === id) {
            return {
              ...item,
              ...row,
            };
          } else {
            return item;
          }
        });
        // konversi json ke string
        // tambahkan ke localstorage
        localStorage.setItem("pembobotan", JSON.stringify(addData));
        // memanggil isi data
        const dataGabungan = get().setGabung();
        set((state) => ({ ...state, dtPembobotan: dataGabungan }));
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
  }))
);

export default usePembobotan;
