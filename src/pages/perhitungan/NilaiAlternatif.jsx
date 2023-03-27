/** @format */

import React, { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import BobotAlternatif from "../../../../ahp-sub/src/pages/perhitungan/alternatif/BobotAlternatif";
import useNilaiAlternatif from "../../store/nilaiAlternatif";

const NilaiAlternatif = ({ dtKriteria, dtAlternatif }) => {
  // store
  const { setNilaiAlternatif, dtNilaiAlternatif, addData } =
    useNilaiAlternatif();

  const [inputValues, setInputValues] = useState([]);
  const tableRef = useRef();

  // pembagian
  const handleChange = (rowIndex, colIndex, kriteria_id, event) => {
    const { value } = event.target;
    const pembagian = (1 / value).toFixed(2);
    const inputIndex = inputValues.findIndex(
      (input) => input.colRow === `${colIndex}-${rowIndex}-${kriteria_id}`
    );
    if (inputIndex === -1) {
      // input with current colRow does not exist yet, create a new input object
      setInputValues([
        { colRow: `${colIndex}-${rowIndex}-${kriteria_id}`, pembagian },
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
    jumlahElements.forEach((jumlah) => {
      jumlah.innerText = jumlahValues[jumlah.dataset.jumlah].toFixed(2);
    });
  };

  // simpan data matriks
  const handleSave = () => {
    // ambil semua data-alternatif_id
    // ambil semua data-alternatif_id
    const dataAlatenatifIds = tableRef.current.querySelectorAll(
      "[data-alternatif_id]"
    );

    const nilaiAlternatif = [];

    // loop melalui setiap elemen sel dengan data-alternatif_id
    dataAlatenatifIds.forEach((cell) => {
      const alternatif_id = cell.dataset.alternatif_id;
      let nilai = Number(cell.innerText);

      // tambahkan nilai dari elemen input ke dalam nilai sel yang terkait
      const input = cell.querySelector('input[type="number"]');
      if (input) {
        const inputValue = Number(input.value);
        if (!isNaN(inputValue)) {
          nilai = inputValue;
        }
      }

      // memisahkan nilai alternatif_id berdasarkan -
      const splitAlternatifId = alternatif_id.split("#");
      const alternatif_id_a = splitAlternatifId[0];
      const alternatif_id_b = splitAlternatifId[1];
      const kriteria_id = splitAlternatifId[2];

      // tambahkan nilai alternatif_id_a, alternatif_id_b, dan nilai ke dalam array
      nilaiAlternatif.push({
        // id: uuidv4(),
        alternatif_id_a,
        alternatif_id_b,
        kriteria_id,
        nilai,
      });
    });
    // simpan matriks kriteria ke localStorage
    addData(nilaiAlternatif);
  };

  useEffect(() => {
    countColoum();
  }, [inputValues, dtNilaiAlternatif]);

  useEffect(() => {
    setNilaiAlternatif();

    return () => {};
  }, [inputValues]);

  return (
    <div>
      <h3 className="text-xl font-bold">Nilai Alternatif</h3>
      <p>Tekan enter untuk menyimpan data nilai alternatif</p>
      {/* table Nilai*/}
      <div ref={tableRef}>
        {dtKriteria &&
          dtKriteria.map((kriteria, indexKri) => (
            <div className="mt-2" key={indexKri}>
              <h4 className="text-lg font-semibold">
                Nilai alternatif dari kriteria {kriteria.nama}
              </h4>
              <table className="table table-zebra w-full">
                <tbody>
                  <tr>
                    <td>Alternatif</td>
                    {dtAlternatif.map((desc, idex) => (
                      <td className="font-bold" key={idex}>
                        {desc.nama}
                      </td>
                    ))}
                  </tr>
                  {dtAlternatif.map((row, rowIndex) => {
                    let isInput = false;
                    return (
                      <tr data-row={rowIndex} key={row.id}>
                        <td className="font-bold">{row.nama}</td>
                        {dtAlternatif.map((col, colIndex) => {
                          const isSameCode = row.id === col.id;
                          const newValue = isSameCode ? 1 : "";
                          let cell;
                          // jika kode sama
                          if (isSameCode) {
                            isInput = true;
                            cell = (
                              <td
                                key={col.id}
                                data-col={`${colIndex}-${kriteria.id}`}
                                data-alternatif_id={`${row.id}#${col.id}#${kriteria.id}`}
                                data-kriteria_id={kriteria.id}
                              >
                                {newValue}
                              </td>
                            );
                            // jika input bernilai true
                          } else if (isInput) {
                            const nilaiAlternatif = dtNilaiAlternatif.find(
                              (m) =>
                                m.alternatif_id_a === row.id &&
                                m.alternatif_id_b === col.id &&
                                m.kriteria_id === kriteria.id
                            );
                            const nilai = nilaiAlternatif
                              ? nilaiAlternatif.nilai
                              : "";
                            cell = (
                              <td
                                key={col.id}
                                data-col={`${colIndex}-${kriteria.id}`}
                                data-alternatif_id={`${row.id}#${col.id}#${kriteria.id}`}
                                data-kriteria_id={kriteria.id}
                              >
                                <input
                                  type="number"
                                  className="input input-bordered w-full max-w-xs"
                                  defaultValue={nilai}
                                  onChange={(event) =>
                                    handleChange(
                                      rowIndex,
                                      colIndex,
                                      kriteria.id,
                                      event
                                    )
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
                              (row) =>
                                row.colRow ===
                                `${rowIndex}-${colIndex}-${kriteria.id}`
                            )?.pembagian;
                            const nilai = pembagian ? pembagian : "";
                            const nilaiAlternatif = dtNilaiAlternatif.find(
                              (m) =>
                                m.alternatif_id_a === row.id &&
                                m.alternatif_id_b === col.id &&
                                m.kriteria_id === kriteria.id
                            );
                            // mengambil nilai dari tabel matriks kriteria
                            const nilaiMatriks = nilaiAlternatif
                              ? nilaiAlternatif.nilai
                              : "";
                            cell = (
                              <td
                                key={col.id}
                                data-col={`${colIndex}-${kriteria.id}`}
                                data-alternatif_id={`${row.id}#${col.id}#${kriteria.id}`}
                                data-kriteria_id={kriteria.id}
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
                    {dtAlternatif.map((col, colIndex) => {
                      return (
                        <td
                          data-jumlah={`${colIndex}-${kriteria.id}`}
                          key={colIndex}
                        ></td>
                      );
                    })}
                  </tr>
                </tbody>
              </table>
              {/* Bobot */}
              <div>
                {dtNilaiAlternatif.length > 0 && (
                  <BobotAlternatif
                    dtNilaiAlternatif={dtNilaiAlternatif}
                    dtAlternatif={dtAlternatif}
                    dtKriteria={dtKriteria}
                    kriteria={kriteria}
                  />
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default NilaiAlternatif;
