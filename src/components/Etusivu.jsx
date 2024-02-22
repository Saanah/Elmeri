// Etusivu.jsx
import React from "react";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import { IoCreate } from "react-icons/io5";
import { TbReportAnalytics } from "react-icons/tb";
import "./Etusivu.css"; // Make sure to import your CSS file

export default function Etusivu() {
  return (
    <div className="EtusivuContainer">
      <div className="Header">
        <p>Elmeri</p>
      </div>
      <div className="Content">
        <div className="ButtonsContainer">
          <Link to="luo_uusi_raportti">
            <Button
              variant="outlined"
              startIcon={<IoCreate />}
            >
              Luo uusi
            </Button>
          </Link>
          <Link to="raportit">
            <Button
              variant="outlined"
              startIcon={<TbReportAnalytics />}
            >
              Raportit
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
