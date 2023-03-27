/** @format */

import React, { useEffect, useRef, useState } from "react";
import { MathJax, MathJaxContext } from "better-react-mathjax";
import usePrioritasKriteria from "../../store/prioritasKriteria";

const BobotKriteria = ({ dtKriteria, dtNilaiKriteria }) => {
  // store
  const { setPrioritsKriteria, dtPrioritasKriteria, addData } =
    usePrioritasKriteria();
  // state
  const [bobotMatriks, setBobotMatriks] = useState([]);
  const [jmlKriteria, setJmlKriteria] = useState(0);
  const [filterJumlah, setFilterJumlah] = useState([]);
  const [cosisten, setCosisten] = useState({});
  const tableRef = useRef();

  const hitungBobot = () => {
    const sum_b = {};
    // Hitung jumlah nilai berdasarkan kriteria_id_b
    dtNilaiKriteria.forEach((item) => {
      const { kriteria_id_b, nilai } = item;

      sum_b[kriteria_id_b] = sum_b[kriteria_id_b]
        ? sum_b[kriteria_id_b] + nilai
        : nilai;
    });

    const result = [];

    Object.keys(sum_b).forEach((sum_id_b) => {
      const jumlah_nilai_b = sum_b[sum_id_b];
      // Hitung hasil bagi setiap nilai dengan jumlah nilai pada kriteria_id_a yang sama
      dtNilaiKriteria.forEach((item) => {
        const { kriteria_id_a, kriteria_id_b, nilai } = item;

        if (kriteria_id_b === sum_id_b) {
          const bobot = (nilai / jumlah_nilai_b).toFixed(3);
          result.push({
            kriteria_id_a,
            kriteria_id_b,
            bobot,
            jumlah_nilai_b,
          });
        }
      });
    });
    setBobotMatriks(result);
  };

  const totalBobot = () => {
    const sum_bobot = {};
    bobotMatriks.forEach((item) => {
      const { kriteria_id_a, bobot } = item;
      sum_bobot[kriteria_id_a] = sum_bobot[kriteria_id_a]
        ? sum_bobot[kriteria_id_a] + parseFloat(bobot)
        : parseFloat(bobot);
    });
    const result = [];
    Object.keys(sum_bobot).forEach((sum_id_a) => {
      const jumlah = sum_bobot[sum_id_a];
      const prioritas = jumlah / jmlKriteria;
      result.push({
        kriteria_id_a: sum_id_a,
        bobot: jumlah.toFixed(3),
        prioritas: prioritas.toFixed(3),
      });
    });
    addData(result);
  };

  const countCI = () => {
    // mengambil prioritas
    // mengambil bobotMatriks
    // jika kriteria_id_a pada prioritas === kriteria_id_b pada bobotMatriks maka dikalikan kemudian dijumlahkan
    const filterJumlah = [];
    dtPrioritasKriteria.map((current) => {
      const kriteriaA = current.kriteria_id_a;
      const prioritas = parseFloat(current.prioritas);

      const nilai = bobotMatriks
        .filter((m) => m.kriteria_id_b === kriteriaA)
        .map((m) => parseFloat(m.jumlah_nilai_b));
      filterJumlah.push({
        kriteria_id_a: kriteriaA,
        prioritas,
        jumlah_nilai: nilai[0],
      });
    }, []);
    const maks = filterJumlah
      .map((item) => item.jumlah_nilai * item.prioritas)
      .reduce((a, b) => a + b, 0)
      .toFixed(3);

    const CI = (maks - jmlKriteria) / (jmlKriteria - 1);
    // mengambil IR dari localStorage
    const IR = JSON.parse(localStorage.getItem("IR"));
    // mencari nilai IR berdasarkan jmlKriteria
    const nilaiIR = IR.find((item) => item.om === jmlKriteria);
    // // mencari nilai CR
    const nilaiCR = CI / nilaiIR?.ri;
    setCosisten({
      maks,
      ci: CI.toFixed(3),
      ri: nilaiIR?.ri,
      cr: nilaiCR.toFixed(3),
    });

    setFilterJumlah(filterJumlah);
  };

  useEffect(() => {
    hitungBobot();
    setJmlKriteria(dtKriteria.length);
    return () => {};
  }, [dtNilaiKriteria, jmlKriteria]);

  useEffect(() => {
    totalBobot();
    // setPrioritsKriteria();
  }, [bobotMatriks, dtNilaiKriteria]);

  useEffect(() => {
    countCI();
  }, [dtPrioritasKriteria]);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h4 className="text-xl font-bold">Bobot Kriteria</h4>
        <div className="mt-2">
          <table className="table table-zebra w-full" ref={tableRef}>
            <tbody>
              <tr>
                <td>Kriteria</td>
                {dtKriteria.map((desc, idex) => (
                  <td className="font-bold" key={idex}>
                    {desc.nama}
                  </td>
                ))}
                <td className="font-bold">Jumlah</td>
                <td className="font-bold">Bobot Prioritas</td>
              </tr>
              {dtKriteria.map((row, rowIndex) => {
                return (
                  <tr data-row={rowIndex} key={row.id}>
                    <td className="font-bold">{row.nama}</td>
                    {bobotMatriks &&
                      bobotMatriks.map(
                        (col, colIndex) =>
                          col.kriteria_id_a === row.id && (
                            <td key={colIndex}>{col.bobot}</td>
                          )
                      )}
                    {dtPrioritasKriteria &&
                      dtPrioritasKriteria.map(
                        (col, colIndex) =>
                          col.kriteria_id_a === row.id && (
                            <td key={colIndex}>{col.bobot}</td>
                          )
                      )}
                    {dtPrioritasKriteria &&
                      dtPrioritasKriteria.map(
                        (col, colIndex) =>
                          col.kriteria_id_a === row.id && (
                            <td key={colIndex}>{col.prioritas}</td>
                          )
                      )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <div className="mb-[10%]">
        <h4 className="text-lg font-bold">Menghitung Consistency Index (CI)</h4>
        <MathJaxContext>
          <div className="flex flex-col gap-4 mt-4">
            <MathJax style={{ fontSize: "20px" }}>
              {`\\(\\lambda_{maximum}= \\frac{${filterJumlah
                .map((row) => row.prioritas + "*" + row.jumlah_nilai)
                .join("+")}}{${jmlKriteria}-1}\\)`}
            </MathJax>
            <MathJax style={{ fontSize: "20px" }}>
              {`\\(CI= \\frac{${cosisten.maks}-${jmlKriteria}}{${jmlKriteria}-1}=${cosisten.ci}\\)`}
            </MathJax>
            <MathJax style={{ fontSize: "20px" }}>
              {`\\(CR= \\frac{${cosisten.ci}}{${cosisten.ri}}=${cosisten.cr}\\)`}
            </MathJax>
          </div>
        </MathJaxContext>
        <div className="mt-2">
          {cosisten.cr <= 0.1 ? (
            <p>Karena nilai CR {"<="} 0.1 maka perhitungannya konsisten</p>
          ) : (
            <p>
              Karena nilai CR {">="} 0.1 maka perhitungannya tidak konsisten dan
              tidak bisa diterima mohon memasukan nilai kembali
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BobotKriteria;
