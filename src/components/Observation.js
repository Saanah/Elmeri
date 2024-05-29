// Tuodaan tarvittavat React-kirjaston toiminnot ja komponentit
import React, { useState, useEffect } from 'react';
import ExceptionForm from './ExceptionForm'; // Tuodaan ExceptionForm-komponentti
import './Observation.css'; // Tuodaan tyylit Observation-komponentille

// Luodaan ja exportataan Observation-komponentti, joka mahdollistaa havaintojen näyttämisen ja hallinnan
export default function Observation({ observation, ob_index, saveInOrder, notInOrder, saveException, getException }) {
  // Tilamuuttuja havainnon järjestyksen hallintaan
  const [number, setNumber] = useState(observation.inOrder);
  const [count, setCount] = useState(observation.notInOrder);
  

  // Vaikutetaan tilamuuttujaan, kun 'observation' muuttuu
  useEffect(() => {
    // Asetetaan tilamuuttujaan havainnon järjestysnumero
    setNumber(observation.inOrder);
    setCount(observation.notInOrder);
  }, [observation]);

// Funktio kasvattaa havainnon järjestysnumeroa
const increment = (e) => {
  const updatedNumber = number + 1;
  setNumber(updatedNumber);
  saveInOrder(updatedNumber, count, ob_index); // Pass count as the second argument
};

// Funktio pienentää havainnon järjestysnumeroa
const decrement = () => {
  const updatedNumber = number - 1;
  setNumber(updatedNumber);
  saveInOrder(updatedNumber, count, ob_index); // Pass count as the second argument
};

const handlePositive = () => {
  const updatedNumber = count + 1;
  setCount(updatedNumber);
  saveInOrder(number, updatedNumber, ob_index); // Pass number as the first argument
};

const handleNegative = () => {
  const updatedNumber = count - 1;
  setCount(updatedNumber);
  saveInOrder(number, updatedNumber, ob_index); // Pass number as the first argument
};
 

  return (
    <>
      {/* Havainnon nimi */}
      <p>{observation.name}</p>
      <div>
        {/* Havainnon kunnon hallinta */}
        <label>Kunnossa</label>
        <div>
          <button id="buttons" onClick={decrement}>-</button>
          <span>{number}</span>
          <button id="buttons" onClick={increment}>+</button>
        </div>
        <p>Poikkeusluku: {count}</p>
      <div>
          <button id="buttons" onClick={handleNegative}>-</button>
          <button id="buttons" onClick={handlePositive}>+</button>
      </div>
      </div>
      {/* Havainnon poikkeamat */}
      <p>Poikkeamat</p>
      {/* Näytetään viesti, jos havainnolla ei ole poikkeamia */}
      {observation.exceptions === undefined && <p>Ei poikkeamia</p>}
      {/* Jos havainnolla on poikkeamia, näytetään ExceptionForm-komponentti niille */}
      {observation.exceptions !== undefined &&
        observation.exceptions.map((exception, ex_index) => (
          <ExceptionForm
            key={ex_index}
            exception={exception}
            saveException={saveException}
            ob_index={ob_index}
            ex_index={ex_index}
          />
        ))}
    </>
  );
}
