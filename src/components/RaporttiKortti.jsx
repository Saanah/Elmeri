import React from "react";
import "./RaporttiHistoria_RaporttiKortti.css";
import Dialogi from "./Dialogi";
import Button from "@mui/material/Button";
import { TbDownload } from "react-icons/tb";

//Yksittäisen raportin tiedot

export default function RaporttiKortti(props) {
  
  // Firebase timestampin formatointi
  const date = props.raportData.date_created.toDate();
  const day = date.getDate();
  const month = date.getMonth() + 1; // Kuukaudet on nollaindeksoituja, joten lisätään yksi
  const year = date.getFullYear();
  const formattedDate = `${String(day).padStart(2, "0")}.${String(
    month
  ).padStart(2, "0")}.${year}`;

  return (
    <div>
      <div className="Raporttitiedot">
        <div>{formattedDate}</div>
        <div>{props.raportData.room}</div>
        <div>{props.raportData.name}</div>
      </div>
      <div className="Raporttikortti">
        <Button
          variant="outlined"
          endIcon={<TbDownload />}
          onClick={() => {
            window.open(props.raportData.url, "_blank");
          }}
        >
          PDF
        </Button>
        <Dialogi name={props.raportData.name} id={props.raportData.id} />
      </div>
    </div>
  );
}
