// Tuodaan tarvittavat tyylit ja React-kirjaston toiminnot
import './ExceptionForm.css';
import React, { useEffect, useState } from 'react';
import DeviceCamera from './DeviceCamera'; // Tuodaan laitteen kamera

// Luodaan ja exportataan ExceptionForm-komponentti, joka mahdollistaa poikkeaman lisäämisen tai poistamisen
export default function ExceptionForm({ saveException, exception, ob_index, ex_index }) {
  // Tilamuuttujat poikkeaman kuvaamiseen ja hallintaan
  const [poikkeama, setPoikkeama] = useState(exception.description);
  const [vastuutaho, setVastuutaho] = useState(exception.description);
  const [selectedUrgency, setSelectedUrgency] = useState('');
  const urgencyOptions = [
    { value: 'matala', label: 'matala' },
    { value: 'normaali', label: 'normaali' },
    { value: 'kiireellinen', label: 'kiireellinen' },
  ];

  // Tilamuuttujat piilottamaan ja näyttämään tallenna- ja poista-painikkeet
  const [hideButton, sethideButton] = useState(false);
  const [showButton, setshowButton] = useState(true);
  const [showForm, setShowForm] = useState(false);

  // Vaikutetaan tilamuuttujiin, kun 'exception' muuttuu
  useEffect(() => {
    // Asetetaan tilamuuttujiin poikkeaman tiedot, jos ne ovat saatavilla
    setPoikkeama(exception.description);
    setVastuutaho(exception.vastuu);
    setSelectedUrgency(exception.urgency);

    // Tarkistetaan paikallisesta varastosta, onko tallennettuja tietoja, ja näytetään/piilotetaan painikkeet tarvittaessa
    const storedData = localStorage.getItem('saveData');
    if (storedData && exception.description && exception.vastuu && exception.urgency) {
      setshowButton(false); 
      sethideButton(true); 
    }
  }, [exception]);

  // Funktio tallentaa poikkeaman tiedot
  const save = (e) => {
    e.preventDefault();
    sethideButton(true);
    setshowButton(false);
    saveException(poikkeama, vastuutaho, selectedUrgency, ob_index, ex_index);
  };

  // Funktio poistaa tallennetut tiedot
  const deleteData = (e) => {
    e.preventDefault();
    sethideButton(false);
    setshowButton(true);
    setPoikkeama('');
    setVastuutaho('');
    setSelectedUrgency('');
    saveException(undefined, undefined, undefined, ob_index, ex_index);
  };

  // Palautetaan lomake, jolla käyttäjä voi lisätä tai poistaa poikkeaman tiedot
  return (
    <form className='exception-form'>
      <div>
        {/* Kenttä poikkeaman/toimenpiteen kuvaamiseen */}
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
        {/* Kenttä vastuutahon kuvaamiseen */}
        <input
          type="text"
          value={vastuutaho}
          onChange={e => setVastuutaho(e.target.value)}
          placeholder="Vastuutaho"
        />
      </div>
      
      <div>
        <br />
        {/* Valintalista poikkeaman kiireellisyyden valitsemiseen */}
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
        {/* Komponentti kameran käyttöä varten */}
        <DeviceCamera />
      </div>
      <br />
      {/* Tallennus- ja poistopainikkeet */}
      {!hideButton && <button id="button" onClick={save}>Tallenna</button>}
      {!showButton && <button id="button" onClick={deleteData}>Poista</button>}
    </form>
  );
}
