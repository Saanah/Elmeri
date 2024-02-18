import React, { useState, useEffect } from 'react';
import ExceptionForm from './ExceptionForm';
import './Observation.css'
import DeviceCamera from './DeviceCamera';

export default function Observation({ observation, ob_index, saveInOrder, saveException, getException }) {
  const [number, setNumber] = useState(observation.inOrder);

  useEffect(() => {
    setNumber(observation.inOrder);
  }, [observation]);

  const increment = () => {
    const updatedNumber = number + 1;
    setNumber(updatedNumber);
    saveInOrder(updatedNumber, ob_index);
  };

  const decrement = () => {
    const updatedNumber = number - 1;
    setNumber(updatedNumber);
    saveInOrder(updatedNumber, ob_index);
  };

  return (
    <>
      <p>{observation.name}</p>
      <div>
        <label>Kunnossa</label>
        <div>
          <button id="buttons" onClick={decrement}>-</button>
          <span>{number}</span>
          <button id="buttons" onClick={increment}>+</button>
        </div>
      </div>
      <p>Poikkeamat</p>
      {observation.exceptions === undefined && <p>Ei poikkeamia</p>}
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
