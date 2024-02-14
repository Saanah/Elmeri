import React, { useState } from 'react';

function Raportinluonti() {
  const [input1, setInput1] = useState('');
  const [input2, setInput2] = useState('');
  const [select1, setSelect1] = useState('Option 1');
  const [select2, setSelect2] = useState('Option A');

  const handleInputChange1 = (e) => {
    setInput1(e.target.value);
  };

  const handleInputChange2 = (e) => {
    setInput2(e.target.value);
  };

  const handleSelectChange1 = (e) => {
    setSelect1(e.target.value);
  };

  const handleSelectChange2 = (e) => {
    setSelect2(e.target.value);
  };

  const handleAddClick = () => {
    // lisää napin logic
  };

  const handleSelectClick = () => {
   
  };

  return (
    <div className="container">
      <h1>Raportin Luonti</h1>
      <div className="input-with-dropdown">
        <div>
          <input
            type="text"
            id="textbox1"
            value={input1}
            onChange={handleInputChange1}
            placeholder="Etunimi AAAAAAA Sukunimi"
          />
          <button onClick={handleAddClick}>Lisää</button>
        </div>
        <select id="dropdown1" value={select1} onChange={handleSelectChange1}>
          <option value="Option 1"> 1</option>
          <option value="Option 2"> 2</option>
          <option value="Option 3"> 3</option>
        </select>
      </div>
      <div className="input-with-dropdown">
        <div>
          <input
            type="text"
            id="textbox2"
            value={input2}
            onChange={handleInputChange2}
            placeholder="Valitse Tila"
          />
          <button onClick={handleSelectClick}>Valitse</button>
        </div>
        <select id="dropdown2" value={select2} onChange={handleSelectChange2}>
          <option value="Option A"> A</option>
          <option value="Option B"> B</option>
          <option value="Option C"> C</option>
        </select>
      </div>
    </div>
  );
}

export default Raportinluonti;