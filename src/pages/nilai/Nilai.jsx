/** @format */

import React, { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import TableNilai from "../../components/table/TableNilai";
import useAlternatif from "../../store/alternatif";
import useKriteria from "../../store/kriteria";
import useNilai from "../../store/nilai";

const Nilai = () => {
  // store
  const { setNilai, dtNilai } = useNilai();
  const { setAlternatif, dtAlternatif } = useAlternatif();
  const { setKriteria, dtKriteria } = useKriteria();
  // get data
  useEffect(() => {
    setNilai({});
    setAlternatif({});
    setKriteria({});
    return () => {};
  }, []);

  return (
    <div>
      <Toaster />
      {/* The button to open modal */}
      <div className="flex justify-center">
        <article className="prose lg:prose-xl">
          <h3 className="text-center">
            Halaman nilai kriteria masing-masing alternatif
          </h3>
        </article>
      </div>
      <div className="mt-4">
        <TableNilai
          dtAlternatif={dtAlternatif}
          dtKriteria={dtKriteria}
          dtNilai={dtNilai}
        />
      </div>
    </div>
  );
};

export default Nilai;
