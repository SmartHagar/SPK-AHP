/** @format */

import React, { useEffect, useRef, useState } from "react";
import PrioritasKriteria from "./PrioritasKriteria";

const BobotKriteria = ({ dtKriteria, dtNilaiKriteria }) => {
  // state
  const [bobotMatriks, setBobotMatriks] = useState([]);
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
          const bobot = (nilai / jumlah_nilai_b).toFixed(2);
          result.push({
            kriteria_id_a,
            kriteria_id_b,
            bobot,
          });
        }
      });
    });
    setBobotMatriks(result);
    return result;
  };

  useEffect(() => {
    hitungBobot();

    return () => {};
  }, [dtNilaiKriteria]);

  return (
    <div>
      <div>
        <h4 className="text-xl font-bold">Bobot Kriteria</h4>
        <div>
          <table className="table table-zebra w-full" ref={tableRef}>
            <tbody>
              <tr>
                <td>Kriteria</td>
                {dtKriteria.map((desc, idex) => (
                  <td className="font-bold" key={idex}>
                    {desc.nama}
                  </td>
                ))}
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
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <div className="mt-4">
        <PrioritasKriteria
          bobotMatriks={bobotMatriks}
          dtKriteria={dtKriteria}
        />
      </div>
    </div>
  );
};

export default BobotKriteria;
