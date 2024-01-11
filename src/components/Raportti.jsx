import React, { useState, useRef, useEffect } from 'react';
import '../App.css';
import Camera from 'react-camera';
import { PDFViewer, Document, Page, Text } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { jsPDF } from 'jspdf';


const Raportti = () => {

  // asettaa nykyisen päivämäärän raporttiin
  const setDate = () => {
    let newDate = new Date()
    let date = newDate.getDate();
    let month = newDate.getMonth() + 1;
    let year = newDate.getFullYear();
    let separator = '.'

    return `${date}${separator}${month < 10 ? `0${month}` : `${month}`}${separator}${year}`
  }


  const [name, setName] = useState('');
  const [names, setNames] = useState([]);
  const [selectedLaborator, setSelectedLaborator] = useState('');
  const [showInputs, setShowInputs] = useState(false);
  const [showSavedData, setShowSavedData] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [showCameraButton, setShowCameraButton] = useState(true);
  const [showCamera, setShowCamera] = useState(false);


  const [formData, setFormData] = useState({
    poikkeama: [],
    vastuutaho: [],
    kiireellisyys: [],
  });


  const [inputPoikkeama, setInputPoikkeama] = useState('');
  const [inputVastuutaho, setInputVastuutaho] = useState('');
  const [inputKiireellisyys, setInputKiireellisyys] = useState('');


  const handleInputChangePoikkeama = (event) => {
    setInputPoikkeama(event.target.value);
  };
  const handleInputVastuu = (event) => {
    setInputVastuutaho(event.target.value);
  };
  const handleInputKiireellisyys = (event) => {
    setInputKiireellisyys(event.target.value);
  };


  const [urgency, setUrgency] = useState([{ value: 'matala', label: 'matala' },
  { value: 'normaali', label: 'normaali' },
  { value: 'kiireellinen', label: 'kiireellinen' },
  ])

  const [laborators, setLaborators] = useState([{ value: '5A101', label: '5A101' },
  { value: '5A102', label: '5A102' },
  { value: '5A103', label: '5A103' },
  { value: '5B103', label: '5B103' },
  { value: '5A105', label: '5A105' },
  { value: 'LVI-tekniikka', label: 'LVI-tekniikka' }
  ])

  const obsObjects = [{ target: 'Työskentely', objs: [{ obj: 'Riskinotto, Suojaimet, Vaatetus' }] },
  { target: 'Ergonomia', objs: [{ obj: 'Fyysinen kuormitus' }, { obj: 'Työpisteiden ja välineiden ergonomia' }] },
  { target: 'Kone- ja laiteturvallisuus', objs: [{ obj: 'Koneiden kunto ja suojalaitteet' }, { obj: 'Koneiden hallintalaitteet ja merkintä' }] },
  { target: 'Liikkumisturvallisuus', objs: [{ obj: 'Kulkuteiden ja lattian rakenne, putoamissuojaus' }, { obj: 'Poistumistiet' }] },
  { target: 'Järjestys', objs: [{ obj: 'Kulkuteiden ja lattioiden järjestys' }, { obj: 'Pöydät, päällyset, hyllyt' }, { obj: 'Jäteastiat' }] },
  { target: 'Työympäristötekijät', objs: [{ obj: 'Melu' }, { obj: 'Valaistus' }, { obj: 'Lämpöolosuhteet' }, { obj: 'Ilman puhtaus ja käsiteltävät aineet' }] }
  ]

  
  let currentTarget, currentObjectives;
  const [currentIndex, setIndex] = useState(0);

  for (let i = 0; i < obsObjects.length; i++) {
    currentTarget = obsObjects[currentIndex].target;
    currentObjectives = obsObjects[currentIndex].objs.map(obj => obj.obj);
  }

  //Menee Seuraavaan kohtaa
  const incrementIndex = () => {
    const nextIndex = (currentIndex + 1 + laborators.length) % laborators.length;
    setIndex(nextIndex);
  };
  //Palaa edelliseen kohtaan
  const decrementIndex = () => {
    const nextIndex = (currentIndex - 1 + laborators.length) % laborators.length;
    setIndex(nextIndex);
  };


  console.log(currentObjectives)


  const addName = () => {
    
    if (name.trim() !== '') {
      setNames([...names, name]);
      setName('');
    }
  };

  const deleteName = (index) => {
    const updatedNames = [...names];
    updatedNames.splice(index, 1);
    setNames(updatedNames);

  };

  const handleChange = (e) => {
    setSelectedLaborator(e.target.value);
  };


  const [counters, setCounters] = useState({
    currentObjectives: 0,
  });

  const incrementCounter = (objective) => {
    setCounters((prevCounters) => ({
      ...prevCounters,
      [objective]: (prevCounters[objective] || 0) + 1,
    }));
  };

  const decrementCounter = (objective) => {
    setCounters((prevCounters) => ({
      ...prevCounters,
      [objective]: (prevCounters[objective] || 0) - 1,
    }));
  };

  const handleButtonClick = () => {
    setShowInputs(true);
  };

  const handleSaveButtonClick = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      poikkeama: [...prevFormData.poikkeama, inputPoikkeama],
      vastuutaho: [...prevFormData.vastuutaho, inputVastuutaho],
      kiireellisyys: [...prevFormData.kiireellisyys, inputKiireellisyys],
    }));

    setInputPoikkeama('');
    setInputKiireellisyys('');
    setInputVastuutaho('');

    setShowInputs(false);
    setShowButton(true);
  };

  const showException = () => {
    setShowSavedData(!showSavedData);

  };

  const handleClearButtonClick = (index) => {
    setFormData((prevFormData) => {
      const newPoikkeama = [...prevFormData.poikkeama];
      const newVastuutaho = [...prevFormData.vastuutaho];
      const newKiireellisyys = [...prevFormData.kiireellisyys];

      newPoikkeama.splice(index, 1);
      newVastuutaho.splice(index, 1);
      newKiireellisyys.splice(index, 1);

      return {
        ...prevFormData,
        poikkeama: newPoikkeama,
        vastuutaho: newVastuutaho,
        kiireellisyys: newKiireellisyys,
      };
    });

  };


  const [imageData, setImageData] = useState(null);
  const [camera, setCamera] = useState(null);

  const takePhoto = () => {
    const photo = camera.capture();
    setImageData(photo);
  };

  const savePhoto = () => {
    // Implement logic to save imageData (base64) to your backend or storage
    console.log('Photo saved:', imageData);
  };

  const deletePhoto = () => {
    setImageData(null);
  };

  const showCameraImage = () => {
    setShowCameraButton(false)
    setShowCamera(true)
  }

  
  const currentIndexnext = laborators.findIndex((lab) => lab.value === selectedLaborator);  

  const goToNext = () => {
    const nextIndex = 0; 
    handleChange({ target: { value: laborators[nextIndex].value } });
  };
  const goToNext1 = () => {
    const nextIndex = 1;
    handleChange({ target: { value: laborators[nextIndex].value } });
  };
  const goToNext2 = () => {
    const nextIndex = 2;
    handleChange({ target: { value: laborators[nextIndex].value } });
  };
  const goToNext3 = () => {
    const nextIndex = 3;
    handleChange({ target: { value: laborators[nextIndex].value } });
  };
  const goToNext4 = () => {
    const nextIndex = 4;
    handleChange({ target: { value: laborators[nextIndex].value } });
  };
  const goToNext5 = () => {
    const nextIndex = 5;
    handleChange({ target: { value: laborators[nextIndex].value } });
  };

  
  const filteredObsObjects = selectedLaborator
    ? obsObjects.filter((item) => item.target === selectedLaborator)
    : [];

  return (
    <div>
      <h1>Turvallisuusraportti</h1>
      <p>{setDate()}</p>

      <input
        id = "inputtext"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Lisää Nimi"
      />
      <button  id = "button"onClick={addName}>Lisää</button>

      <p>Havainnoitsijat:</p>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {names.map((name, index) => (
          <li key={index} style={{ marginBottom: '10px' }}>
            <span style={{ marginRight: '10px' }}>{name}</span>
            <button id = "backfront" onClick={() => deleteName(index)}>Delete</button>
          </li>
        ))}
      </ul>

      <p>Valitse Tila</p>
      <div>
      <button id = "tila"  onClick={goToNext}>
        5A101
      </button>
      <button id = "tila"  onClick={goToNext1}>
        5A102
      </button>
      <button id = "tila"  onClick={goToNext2}>
        5A103
      </button>
      <button id = "tila"  onClick={goToNext3}>
        5B103
      </button>
      <button id = "tila"  onClick={goToNext4}>
        5A105
      </button>
      <button id = "tila2"  onClick={goToNext5}>
        LVI-tekniikka
      </button>
    </div>

      {selectedLaborator && (
        <div>
          <h3>You selected: {selectedLaborator}</h3>
          <h3>Tarkastelukohde:{currentTarget}</h3>
          <button id ="tila" onClick={decrementIndex}>Palaa</button>
          <button id= "tila" onClick={incrementIndex}>Seuraava</button>
          <div className='objectives-container'>
            {currentObjectives.map((objective, index) => (
              <div key={index} className='objective-box'>
                <p>{objective}</p>
                <p>Kunnossa</p>
                <button id="buttons" onClick={() => incrementCounter(objective)}>+</button>
                <span>{counters[objective] || 0}</span>
                <button id="buttons" onClick={() => decrementCounter(objective)}>-</button> <br /><br />
                <button id="button" onClick={handleButtonClick}> Lisää Poikkeama</button>
                {showInputs && (
                  <div>
                    <input
                      type="text"
                      name="poikkeama"
                      placeholder="Poikkeama/toimenpide"
                      value={inputPoikkeama}
                      onChange={handleInputChangePoikkeama}
                    />
                    <input
                      type="text"
                      name="vastuutaho"
                      placeholder="Vastuutaho"
                      value={inputVastuutaho}
                      onChange={handleInputVastuu}
                    />
                    <p>Kiirellisyys:</p>
                    <select
                      id="laboratorOptions"
                      value={inputKiireellisyys}
                      name="kiireellisyys"
                      onChange={handleInputKiireellisyys}
                    >
                      <option value="" >Tila</option>
                      {urgency.map((urgency) => (
                        <option key={urgency.value} value={urgency.value}>
                          {urgency.label}
                        </option>
                      ))}
                    </select>
                    <button onClick={handleSaveButtonClick}>Save</button>
                    <br />
                    <br />
                    {showCameraButton && (
                    <button onClick={showCameraImage}>Open Camera</button>
                    )}
                    
                    {showCamera && (
                    <div>
                          <Camera
                            ref={(cam) => setCamera(cam)}
                            width="100%"
                            height="auto"
                          />
                          <button onClick={takePhoto}>Take Photo</button>
                          {imageData && (
                            <>
                              <img src={`data:image/jpeg;base64,${imageData}`} alt="Captured" />
                              <button onClick={savePhoto}>Save Photo</button>
                              <button onClick={deletePhoto}>Delete Photo</button>
                            </>
                          )}
                    </div>
                    )}
                  </div>
                )}
                <br /><br />
                {showButton && (
                  <button id="button" onClick={showException}>Näytä Poikkeukset</button>
                )}
                {showSavedData && (
                  <div>
                    {formData.poikkeama.map((text, index) => (
                      <div key={index}>
                        <p>
                          Poikkeama: {formData.poikkeama[index]} <br />
                          Vastuutaho: {formData.vastuutaho[index]} <br />
                          Kiireellisyys: {formData.kiireellisyys[index]}
                        </p>
                        <button id="button1" onClick={() => handleClearButtonClick(index)}>
                          Poista
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <br /><br />
                 
              </div>
            ))}

          </div>
          
        </div>
      )}
    </div>
  )

}
export default Raportti;