import './ExceptionForm.css';
import React, { useEffect, useState } from 'react'

export default function ExceptionForm({ saveException, exception, ob_index, ex_index}) {
  const [poikkeama, setPoikkeama] = useState(exception.description)
  const [vastuutaho, setVastuutaho] = useState(exception.description)
  const [selectedUrgency, setSelectedUrgency] = useState('');
  const urgencyOptions = [
    { value: 'matala', label: 'matala' },
    { value: 'normaali', label: 'normaali' },
    { value: 'kiireellinen', label: 'kiireellinen' },
  ];

  const [hideButton, sethideButton] = useState(false); 
  const [showButton, setshowButton] = useState(true); 
  useEffect(() => {
    setPoikkeama(exception.description)
    setVastuutaho(exception.vastuu)
    setSelectedUrgency(exception.urgency)
  }, [exception])


  const save = (e) => {
    e.preventDefault()
    sethideButton(true)
    setshowButton(false)
    saveException(poikkeama,vastuutaho,selectedUrgency, ob_index, ex_index);
  };

  const deleteData = (e) => {
    e.preventDefault()
    sethideButton(false)
    setshowButton(true)

    setPoikkeama('')
    setVastuutaho(''); 
    setSelectedUrgency(''); 
  };

  
  return (
    <form className='exception-form'>
      <div>
        <input
          type="text"
          value={poikkeama}
          onChange={e => setPoikkeama(e.target.value)}
          placeholder="Poikkeama/toimenpide" /><br
        />
      </div>
      <div>
        <input
          type="text"
          value={vastuutaho}
          onChange={e => setVastuutaho(e.target.value)}
          placeholder="Vastuutaho"/><br
        />
      </div>
      <div>
        <select value={selectedUrgency} onChange={e => setSelectedUrgency(e.target.value)}>
          <option value="">Tila</option>
          {urgencyOptions.map(urgency => (
            <option key={urgency.value} value={urgency.value}>
              {urgency.label}
            </option>
          ))}
        </select>
      </div>
      <br></br>
      {!hideButton && <button id="button" onClick={save}>Tallenna</button>}
      {!showButton && <button id="button" onClick={deleteData}>Poista</button>}
      
    </form>
  )
}
