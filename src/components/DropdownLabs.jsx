import React, { useState, useEffect } from "react";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";

export default function DropdownLabs({onSelectedLab}) {
  const [selectedLab, setSelectedLab] = useState("");

  const handleChange = (event) => {
    setSelectedLab(event.target.value); //useless?
    onSelectedLab(event.target.value);
  };

  return (
    <FormControl className="FormControl">
      <InputLabel id="dropdown-label" className="InputLabel">
        Tila
      </InputLabel>
      <Select
        className="FormControl"
        labelId="dropdown-label"
        id="dropdown"
        value={selectedLab}
        onChange={handleChange}
      >
        <MenuItem value="">
          <em>Ei mitään</em>
        </MenuItem>
        <MenuItem value="5A101">5A101</MenuItem>
        <MenuItem value="5A102">5A102</MenuItem>
        <MenuItem value="5A103">5A103</MenuItem>
        <MenuItem value="5A105">5A105</MenuItem>
        <MenuItem value="5B103">5B103</MenuItem>
        <MenuItem value="LVI-tekniikka">LVI-tekniikka</MenuItem>
      </Select>
    </FormControl>
  );
}
