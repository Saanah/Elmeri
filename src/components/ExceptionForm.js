import './ExceptionForm.css';
import React, { useEffect, useState } from 'react';
import DeviceCamera from './DeviceCamera';

export default function ExceptionForm({ saveException, exception, ob_index, ex_index }) {
  const [poikkeama, setPoikkeama] = useState(exception.description);
  const [vastuutaho, setVastuutaho] = useState(exception.description);
  const [ongelma, setOngelma] = useState(exception.description);
  const [selectedUrgency, setSelectedUrgency] = useState('');
  const [pictureData, setPictureData] = useState(null); // State to store picture data
  const [imgSrc, setImgSrc] = useState(null); // Define imgSrc state
  const urgencyOptions = [
    { value: 'matala', label: 'matala' },
    { value: 'normaali', label: 'normaali' },
    { value: 'kiireellinen', label: 'kiireellinen' },
  ];
  const [hideButton, sethideButton] = useState(false);
  const [showButton, setshowButton] = useState(true);


  useEffect(() => {
    setPoikkeama(exception.description);
    setVastuutaho(exception.vastuu);
    setSelectedUrgency(exception.urgency);
    setPictureData(exception.pictureData);
    setOngelma(exception.ongelma);

    const storedData = localStorage.getItem('saveData');
    if (storedData && exception.description && exception.vastuu && exception.urgency && exception.ongelma) {
      setshowButton(false);
      sethideButton(true);
    }
  }, [exception]);

  const save = (e) => {
    e.preventDefault();
    sethideButton(true);
    setshowButton(false);
    saveException(poikkeama, vastuutaho, selectedUrgency, ongelma, pictureData, imgSrc, ob_index, ex_index);
  };

  const deleteData = (e) => {
    e.preventDefault();
    sethideButton(false);
    setshowButton(true);
    setPoikkeama('');
    setVastuutaho('');
    setSelectedUrgency('');
    setOngelma('');
    setPictureData(null);
    saveException(undefined, undefined, undefined, undefined, undefined, undefined, ob_index, ex_index);
  };


  return (
    <form className='exception-form'>
      <div>
        <input
          style={{ marginTop: "2rem" }}
          type="text"
          value={poikkeama}
          onChange={e => setPoikkeama(e.target.value)}
          placeholder="Poikkeama/toimenpide"
        />
      </div>
      <br />
      <div>
        <input
          type="text"
          value={vastuutaho}
          onChange={e => setVastuutaho(e.target.value)}
          placeholder="Vastuutaho"
        />
      </div>

      <div>
        <br />
        <select
          value={selectedUrgency}
          onChange={e => setSelectedUrgency(e.target.value)}
          style={{ width: "200px", padding: "8px", borderRadius: "5px", fontSize: "20px", marginBottom: "1rem" }}
        >
          <option value="">Valitse Tila</option>
          {urgencyOptions.map(urgency => (
            <option key={urgency.value} value={urgency.value}>
              {urgency.label}
            </option>
          ))}
        </select>
        <label htmlFor="textInput">Ilmoita havaittu ongelma:</label>
        <textarea
          id="textInput"
          rows="5"
          cols="25"
          value={ongelma} // Bind the value to state
          onChange={e => setOngelma(e.target.value)} // Update state when the textarea changes
        />
        <DeviceCamera onPictureCapture={setPictureData} /> {/* Pass a callback to receive captured picture data */}
      </div>
      <br />
      {!hideButton && <button id="button" onClick={save}>Tallenna</button>}
      {!showButton && <button id="button" onClick={deleteData}>Poista</button>}
    </form>
  );
}
