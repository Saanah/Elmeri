// Tuodaan tarvittavat React-kirjaston toiminnot ja komponentit
import React, { useState, useEffect } from 'react';
import ExceptionForm from './ExceptionForm'; // Tuodaan ExceptionForm-komponentti
import './Observation.css'; // Tuodaan tyylit Observation-komponentille

// Luodaan ja exportataan Observation-komponentti, joka mahdollistaa havaintojen näyttämisen ja hallinnan
export default function Observation({ observation, ob_index, saveInOrder, saveException, getException }) {
  // Tilamuuttuja havainnon järjestyksen hallintaan
  const [number, setNumber] = useState(observation.inOrder);

  // Vaikutetaan tilamuuttujaan, kun 'observation' muuttuu
  useEffect(() => {
    // Asetetaan tilamuuttujaan havainnon järjestysnumero
    setNumber(observation.inOrder);
  }, [observation]);

  // Funktio kasvattaa havainnon järjestysnumeroa
  const increment = () => {
    const updatedNumber = number + 1;
    setNumber(updatedNumber);
    saveInOrder(updatedNumber, ob_index);
  };

  // Funktio pienentää havainnon järjestysnumeroa
  const decrement = () => {
    const updatedNumber = number - 1;
    setNumber(updatedNumber);
    saveInOrder(updatedNumber, ob_index);
  };

  // Palautetaan havainto ja siihen liittyvät poikkeamat
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
