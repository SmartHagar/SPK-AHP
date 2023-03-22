/** @format */

import React, { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import BobotKriteria from "./BobotKriteria";

const NilaiKriteria = ({ dtKriteria }) => {
  const [inputValues, setInputValues] = useState([]);
  const [dtNilaiKriteria, setDtNilaiKriteria] = useState([]);
  const tableRef = useRef();

  // pembagian
  const handleChange = (rowIndex, colIndex, event) => {
    const { value } = event.target;
    const pembagian = (1 / value).toFixed(2);

    const inputIndex = inputValues.findIndex(
      (input) => input.colRow === `${colIndex}-${rowIndex}`
    );
    if (inputIndex === -1) {
      // input with current colRow does not exist yet, create a new input object
      setInputValues([
        { colRow: `${colIndex}-${rowIndex}`, pembagian },
        ...inputValues,
      ]);
    } else {
      // input with current colRow already exists, update the pembagian property
      const updatedInputValues = [...inputValues];
      updatedInputValues[inputIndex] = {
        ...updatedInputValues[inputIndex],
        pembagian,
      };
      setInputValues(updatedInputValues);
    }
  };

  // penjumlahan kolom
  const countColoum = () => {
    const dataCols = tableRef.current.querySelectorAll("[data-col]");
    const jumlahElements = tableRef.current.querySelectorAll("[data-jumlah]");

    const jumlahValues = Array.from(dataCols).reduce((acc, cell) => {
      const colIndex = cell.dataset.col;
      let cellValue = Number(cell.innerText);

      // tambahkan nilai dari elemen input ke dalam nilai sel yang terkait
      const input = cell.querySelector('input[type="number"]');
      if (input) {
        const inputValue = Number(input.value);
        if (!isNaN(inputValue)) {
          cellValue = inputValue;
        }
      }

      acc[colIndex] = (acc[colIndex] || 0) + cellValue;
      return acc;
    }, {});

    // Update nilai elemen jumlah dengan hasil penjumlahan
    Object.keys(jumlahValues).forEach((colIndex) => {
      const jumlahElement = jumlahElements[colIndex];
      jumlahElement.innerText = jumlahValues[colIndex].toFixed(2);
    });
  };

  // simpan data matriks
  const handleSave = () => {
    // ambil semua data-kriteria_id
    const dataKriteriaIds =
      tableRef.current.querySelectorAll("[data-kriteria_id]");

    const nilaiKriteria = [];

    // loop melalui setiap elemen sel dengan data-kriteria_id
    dataKriteriaIds.forEach((cell) => {
      const kriteria_id = cell.dataset.kriteria_id;
      let nilai = Number(cell.innerText);

      // tambahkan nilai dari elemen input ke dalam nilai sel yang terkait
      const input = cell.querySelector('input[type="number"]');
      if (input) {
        const inputValue = Number(input.value);
        if (!isNaN(inputValue)) {
          nilai = inputValue;
        }
      }

      // memisahkan nilai kriteria_id berdasarkan -
      const splitKriteriaId = kriteria_id.split("-");
      const kriteria_id_a = splitKriteriaId[0];
      const kriteria_id_b = splitKriteriaId[1];

      // tambahkan nilai kriteria_id_a, kriteria_id_b, dan nilai ke dalam array
      nilaiKriteria.push({
        // id: uuidv4(),
        kriteria_id_a,
        kriteria_id_b,
        nilai,
      });
    });
    // simpan matriks kriteria ke localStorage
    console.log({ nilaiKriteria });
    setDtNilaiKriteria(nilaiKriteria);
    localStorage.setItem("nilaiKriteria", JSON.stringify(nilaiKriteria));
  };

  useEffect(() => {
    countColoum();
  }, [inputValues]);

  useEffect(() => {
    // mengambil dataMatriks dari localstorage
    const dtNilaiKriteria =
      JSON.parse(localStorage.getItem("nilaiKriteria")) || [];
    setDtNilaiKriteria(dtNilaiKriteria);

    return () => {};
  }, []);

  return (
    <div>
      <h4 className="text-xl font-bold">Nilai Kriteria</h4>
      <p>Tekan enter untuk menyimpan data nilai kriteria</p>
      {/* table Nilai*/}
      <div className="mt-4">
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
              let isInput = false;
              return (
                <tr data-row={rowIndex} key={row.id}>
                  <td className="font-bold">{row.nama}</td>
                  {dtKriteria.map((col, colIndex) => {
                    const isSameCode = row.id === col.id;
                    const newValue = isSameCode ? 1 : "";
                    let cell;
                    // jika kode sama
                    if (isSameCode) {
                      isInput = true;
                      cell = (
                        <td
                          key={col.id}
                          data-col={colIndex}
                          data-kriteria_id={`${row.id}-${col.id}`}
                        >
                          {newValue}
                        </td>
                      );
                      // jika input bernilai true
                    } else if (isInput) {
                      const nilaiKriteria = dtNilaiKriteria.find(
                        (m) =>
                          m.kriteria_id_a === row.id &&
                          m.kriteria_id_b === col.id
                      );
                      const nilai = nilaiKriteria ? nilaiKriteria.nilai : "";
                      cell = (
                        <td
                          key={col.id}
                          data-col={colIndex}
                          data-kriteria_id={`${row.id}-${col.id}`}
                        >
                          <input
                            type="number"
                            className="input input-bordered w-full max-w-xs"
                            defaultValue={nilai}
                            onChange={(event) =>
                              handleChange(rowIndex, colIndex, event)
                            }
                            onKeyDown={(event) => {
                              if (event.key === "Enter") {
                                handleSave();
                              }
                            }}
                          />
                        </td>
                      );
                    } else {
                      // hasil pembagian
                      const pembagian = inputValues.find(
                        (row) => row.colRow === `${rowIndex}-${colIndex}`
                      )?.pembagian;
                      const nilai = pembagian ? pembagian : "";
                      const nilaiKriteria = dtNilaiKriteria.find(
                        (m) =>
                          m.kriteria_id_a === row.id &&
                          m.kriteria_id_b === col.id
                      );
                      // mengambil nilai dari tabel matriks kriteria
                      const nilaiMatriks = nilaiKriteria
                        ? nilaiKriteria.nilai
                        : "";
                      cell = (
                        <td
                          key={col.id}
                          data-col={colIndex}
                          data-kriteria_id={`${row.id}-${col.id}`}
                        >
                          {nilai || nilaiMatriks}
                        </td>
                      );
                    }
                    return cell;
                  })}
                </tr>
              );
            })}
            <tr>
              <td>Jumlah</td>
              {dtKriteria.map((col, colIndex) => {
                return <td data-jumlah={colIndex} key={colIndex}></td>;
              })}
            </tr>
          </tbody>
        </table>
      </div>
      {/* Bobot */}
      <div className="mt-4">
        {dtNilaiKriteria.length > 0 && (
          <BobotKriteria
            dtNilaiKriteria={dtNilaiKriteria}
            dtKriteria={dtKriteria}
          />
        )}
      </div>
    </div>
  );
};

export default NilaiKriteria;
