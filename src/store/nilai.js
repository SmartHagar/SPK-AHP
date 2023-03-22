/** @format */

import { create } from "zustand";
import { devtools } from "zustand/middleware";

const useNilai = create(
  devtools((set, get) => ({
    dtNilai: [],
    setGabung: () => {
      const dataNilai = JSON.parse(localStorage.getItem("nilai")) || [];
      const dataKriteria = JSON.parse(localStorage.getItem("kriteria")) || [];
      const dataAlternatif =
        JSON.parse(localStorage.getItem("alternatif")) || [];
      return dataNilai;
    },
    setNilai: async ({}) => {
      try {
        const dataGabungan = get().setGabung();

        set((state) => ({ ...state, dtNilai: dataGabungan }));
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
        const getData = JSON.parse(localStorage.getItem("nilai")) || [];
        // tambah data ke array
        // cek apakah data sudah ada berdasarkan kriteria_id dan alternatif_id
        const index = getData.findIndex(
          (data) =>
            data.kriteria_id === row.kriteria_id &&
            data.alternatif_id === row.alternatif_id
        );

        // jika data sudah ada, ubah data
        if (index >= 0) {
          getData[index] = {
            ...getData[index],
            ...row,
          };
        } else {
          // jika data belum ada, tambahkan data
          getData.push(row);
        }
        // konversi json ke string
        // tambahkan ke localstorage
        localStorage.setItem("nilai", JSON.stringify(getData));
        // memanggil isi data
        const dataGabungan = get().setGabung();
        set((state) => ({ ...state, dtNilai: dataGabungan }));
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
          dtNilai: prevState.dtNilai.filter((item) => item.id !== id),
        }));
        // mengambil isi state
        // @ts-ignore
        const isiState = get().dtNilai;
        // konversi json ke string
        // tambahkan ke localstorage
        localStorage.setItem("nilai", JSON.stringify(isiState));
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
        const getData = JSON.parse(localStorage.getItem("nilai"));
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
        localStorage.setItem("nilai", JSON.stringify(addData));
        // memanggil isi data
        const dataGabungan = get().setGabung();
        set((state) => ({ ...state, dtNilai: dataGabungan }));
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

export default useNilai;
