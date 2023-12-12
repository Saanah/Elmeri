/* global firestore */
import React, { useState, useRef, useEffect } from 'react';
import CompletedLabs from './CompletedLabs';
import Dropdown2 from './Dropdown2';
import ItemsList from './ItemsList';
import { addRoom, addTargets } from './Handleinputs';
import CompletedTargets from './CompletedTargets';
import 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore'; // Import Firestore functions
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Stack from '@mui/material/Stack';
import '../App.css';

const PlusMinus = () => {

  const [laborators, setLaborators] = useState([{ value: '5A102', label: '5A102' },
                {value: '5A101', label: '5A101' }, 
                {value: '5A103', label: '5A103' }, 
                {value: '5B103', label: '5B103' }, 
                {value: '5A105', label: '5A105' },
                {value: 'LVI-tekniikka', label: 'LVI-tekniikka' }  
  ])

  const obsObjects = [ {target: 'Työskentely', objs: [{obj: 'Riskinotto, Suojaimet, Vaatetus'}]},
                    {target: 'Ergonomia', objs: [{obj: 'Fyysinen kuormitus'}, {obj: 'Työpisteiden ja välineiden ergonomia'}]}, 
                    {target: 'Kone- ja laiteturvallisuus', objs: [{obj: 'Koneiden kunto ja suojalaitteet'}, {obj: 'Koneiden hallintalaitteet ja merkintä'}]}, 
                    {target: 'Liikkumisturvallisuus', objs: [{obj: 'Kulkuteiden ja lattian rakenne, putoamissuojaus'}, {obj: 'Poistumistiet'}]},
                    {target: 'Järjestys', objs: [{obj: 'Kulkuteiden ja lattioiden järjestys'}, {obj: 'Pöydät, päällyset, hyllyt'}, {obj: 'Jäteastiat'}]},
                    {target: 'Työympäristötekijät', objs: [{obj: 'Melu'}, {obj: 'Valaistus'}, {obj: 'Lämpöolosuhteet'}, {obj: 'Ilman puhtaus ja käsiteltävät aineet'}]}
  ]

  const [ready, setReady] = useState(false);
  const [completedLabs, setCompletedLabs] = useState([]);
  const [completedTargets, setCompletedTargets] = useState([]);
  const [lab, setLab] = useState(null);
  const [observers, setObservers] = useState([]);
  const [observer, setObserver] = useState("")
  const [targetCount, setTargetCount] = useState(0);
  const [targets, setTargets] = useState({target: null, obs:[]});
  const childStateRef = useRef();
  const inputRef = useRef();
  const [targetQuantity, setTargetQuantity] = useState(0);
  const [setOpenModal] = useState(false);

  // asettaa nykyisen päivämäärän raporttiin
  const setDate = () => {
    let newDate = new Date()
    let date = newDate.getDate();
    let month = newDate.getMonth() + 1;
    let year = newDate.getFullYear();
    let separator = '.'
    
    return `${date}${separator}${month<10?`0${month}`:`${month}`}${separator}${year}`
  }

  // kasvattaa kohteiden määrää
  const incrementTargetCount = () => {
    setTargetCount(targetCount + 1)
  }

  // seuraava painettu tilan ollessa valittuna
  // tarkistaa onko huoneessa kaikki kohdat käyty läpi
  const nextPressed = () => {
    if (targetCount === targetQuantity) {
      setLabCompleted(lab)
      setLab(null)
      setTargets(null)
      setTargetCount(0)
    }else {
      setTargetCompleted(targets.target)
      targetSelector()
    }
  } 

  // hakee alasvetovalikosta valitun huoneen
  const  getChildState = () => {
    let childState = childStateRef.current.getChildOption()
    setLab(childState.label)
    targetSelector()
    addRoom({name: childState.label})
  }

  // asettaa huoneen läpikäydyksi ja poistaa alasvetovalikon listasta huoneen
  const setLabCompleted = String => {
    setCompletedLabs([...completedLabs, String])
    let filtered = laborators.filter(item => {return item.label !== String})
    setLaborators(filtered)
  }

  // asettaa kohdan läpikäytyjen listaan
  const setTargetCompleted = String => {
    setCompletedTargets([...completedTargets, String])
  }

  
  const targetCounter = () => {
    let targetsCount = obsObjects.length
    setTargetQuantity(targetsCount)
  }

  // kasvattaa in
  const targetSelector = () => {
    targetCounter()
    setTargets({target: obsObjects[targetCount].target, obs: obsObjects[targetCount].objs})
    incrementTargetCount()
  }
  
  // kohteiden läpikäynnissä vaihtaa näppäimen tekstiä
  const NextButtonLabel = () => {
    if (targetCount === targetQuantity) return <p>Tila valmis</p>
    return <p>Seuraava</p>
  }

  const addObserver = () => {
    if (observers.some((existingObserver) => existingObserver.name === observer)) {
      alert('Nimi on jo lisätty!')
      return;
    }
  
    const newObserver = {
      id: Date.now(),
      name: observer,
    };
    setObservers([...observers, newObserver]);
    setObserver('');
    inputRef.current.focus();
  }

  const mapObservers = () => {
    return observers.map((observer) => (
      <div key={observer.id} style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ marginRight: '5px' }}>{observer.name}</div>
        <Stack direction="row" spacing={1}>
        <IconButton aria-label="delete" onClick={() => removeObserver(observer.id)}>
          <DeleteIcon />
        </IconButton>
        </Stack>
      </div>
    ))
  }

  const removeObserver = (id) => {
    const updatedObservers = observers.filter((observer) => observer.id !== id);
    setObservers(updatedObservers);
  }

  // asettaa huoneenvalinta-näppäimen tekstin
  const nextRoomText = () => {
    return ((completedLabs.length > 0) ? <p className='text-xl'>Valitse seuraava tila</p> : <p className='text-xl'>Valitse tila</p>)
  }

  const closeModal = () => {
    setOpenModal(false)
  }

  // vaihtaa tilan, kun kutsutaan raportin valmistuessa
  const reportReady = () => {
    setReady(true)
  }

  // näkymä kun huone ei ole valittu ja vaihtuu, kun huoneet on käyty läpi
  const ChooseLab = () => {
    return (
      <div className='flex flex-col justify-center items-center content-center space-y-4 mt-10'>
        {(!ready) ?
        <div className='flex flex-col justify-center items-center content-center'>
          {/*(showCompleted[0] && completedLabs.length > 0) ? <CompletedTargets completed={completedLabs} /> : null*/}
          {(completedLabs.length > 0) && <CompletedLabs completed={completedLabs} />}
          {(completedLabs.length < 6) ? <div className='flex flex-col justify-center items-center content-center'><div className='pt-10 px-10 mb-4'>
            {nextRoomText()}
            <Dropdown2 list = {laborators} ref={childStateRef} />
          </div>
          <p><Button variant="contained" onClick={() => getChildState()}>Valitse</Button></p></div> :
          <div className='pt-10'>
            <p className='mb-4 text-lg'>Kaikki tilat suoritettu</p>
            <Button variant="contained" disableElevation onClick={() => {reportReady()}}>Raportti valmis</Button>
          </div>}
        </div> :
        <CompletedTargets />}
      </div>
    )
  }

  // näkymä kun huone on valittu
  const LabChosen = () => {
    return (
      <div className='my-8 space-y-4 pb-8'>
        {console.log('raportin completedLabs: ', completedLabs)}
        <p><b>Valittu tila: <span className='font-bold font-lg'>{lab}</span></b></p>
        {/*<button onClick={() => setOpenModal(true)}>Modal</button>
        <GuideModal open={openModal} handleClose={closeModal} room={lab} /> */}
        <p><b>Tarkastelukohde: <span className='font-bold font-md'>{targets.target}</span></b></p>
        {addTargets({target: targets.target})}
        <ItemsList objects= {targets.obs} />
        <p><Button variant="contained" onClick={() => nextPressed()}>{NextButtonLabel()}</Button></p>
      </div>
    )
  }
 
  const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIRESTORE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    measurementId: process.env.REACT_APP_MEASUREMENT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  };

  const app = initializeApp(firebaseConfig);
  const firestore = getFirestore(app);

  const addDataToFirestore = async () => {
    try {
      const collectionRef = collection(firestore, 'reports');

      const data = {
        observer,
        laborators,
        targets,
        completedLabs,
        completedTargets,
        targetCount,
      };

      const docRef = await addDoc(collectionRef, data);
      console.log('Document written with ID: ', docRef.id);
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };

  useEffect(() => {
    if (reportReady) {
      addDataToFirestore();
    }
  }, [ready]);

  // raportin ylätekstit ja alemmat näkymät sen mukaan onko huone valittu
  return (
    <div className='mx-10 my-8'>
      <div>
        <div className='flex flex-row justify-around mt-8 text-xl'><p><h2><b>Turvallisuusraportti</b></h2></p><p>{setDate()}</p></div>
        <div className='flex flex-row justify-around mt-6 text-lg'>
          {(lab || completedLabs.length > 0) ?
            <p><b>Havainnoitsijat: {mapObservers()}</b></p> :
            <div>
           <Box
              component="form" sx={{ '& > :not(style)': { textAlign: 'center' }, }}
              noValidate
              autoComplete="off">
            <TextField
              id="outlined-basic"
              variant="outlined"
              value={observer}
              onChange={(event) => setObserver(event.target.value)}
              placeholder="Etunimi Sukunimi"
              autoFocus
              inputRef={inputRef}
            />
          </Box>
             <p><Button variant="outlined" size="small" onClick={() => addObserver()}>Lisää</Button></p>
          {(observers.length > 0) ? <p className='max-w-2/3'>Havainnoitsijat: {mapObservers()}</p> :
          <p className='max-w-2/3 invisible'>Havainnoitsijat: {mapObservers()}</p>}
          </div>}
        </div> 
        {(lab) ? LabChosen() : ChooseLab()}
      </div>    
    </div>
    
  )
}
export default PlusMinus