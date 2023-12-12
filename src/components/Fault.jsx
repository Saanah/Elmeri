import React, { useState, useRef, useEffect } from 'react'
import { addFault, setFaultDataAtIndex } from './Handleinputs';
import Dropdown2 from './Dropdown2';
import Kamera from './CameraCaptureComponent';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';

const Fault = (props) => {
  const [exception, setException] = useState("");
  const [responsible, setResponsible] = useState("");
  let urgency = "" 
  const childStateRef = useRef();
  const urgencyArray = [{ value: 'matala', label: 'matala' },
                {value: 'normaali', label: 'normaali' }, 
                {value: 'kiireellinen', label: 'kiireellinen'}]
  const [camIsOpen, setCamIsOpen] = useState(false)

  useEffect(() => {
    if (props.edit === true) {
     // console.log('haettu fault data:', getFaultdataAtIndex({index:props.oIndex, fIndex:props.fIndex}))
      console.log(props)
      setException(props.fault.exception)
      setResponsible(props.fault.responsible)
      urgency = props.fault.urgency
      console.log('edit true')
    }
  }, [])

  // poikkeuksen lisääminen
  const handleSubmit = () => {
    let childState = childStateRef.current.getChildOption()
    urgency = childState.label
    if (props.edit === true) {
      setFaultDataAtIndex({fault:{exception, responsible, urgency}, oIndex:props.oIndex, fIndex:props.fIndex})
      props.faultEdited()
      props.show({fIndex: props.fIndex})
    }
    else {
      addFault({fault:{exception, responsible, urgency}, index:props.index})
      props.addFault({fault:{exception: exception, responsible: responsible, urgency: urgency}, index: props.index})
      setException("")
      setResponsible("")
    }
  }

  // poikkeuksen peruutus
  const handleCancel = () => {
    if (props.edit === true) props.show({fIndex: props.fIndex})
    else {
      props.cancel()
      setException("")
      setResponsible("")
    }
  }

  const openCamera = () => {
    setCamIsOpen(true)
  }

  // poikkeuksen täyttönäkymä
  return (
    <div className='border-2 border-primary-blue rounded-lg my-4 space-y-2 mx-10 py-2 flex flex-col items-start px-16 transition duration-500 gap-y-2'>
      <p className='font-bold'>{props.number}. Poikkeama/Huomio</p>
      <input
        type="textarea"
        className="px-1 py-2 border border-black rounded-lg w-5/6"
        placeholder="Poikkeama/Toimenpide"
        defaultValue={exception}
        onChange={(e) => setException(e.target.value)}
      />
      <div className='flex align-start justify-between w-5/6'>
        <input
          type="textarea"
          className="px-1 border border-black rounded-lg w-1/2"
          placeholder="Vastuutaho"
          defaultValue={responsible}
          onChange={(e) => setResponsible(e.target.value)}
        />
        <div className='flex flex-row justify-start w-1/3'>
          <p className='mt-2 mr-2'>Kiireellisyys:</p>
          <Dropdown2 list={urgencyArray} selected={urgency} ref={childStateRef} />
        </div>
      </div>
      <p><Button variant="outlined" size="small"  onClick={() => {openCamera()}}>Avaa kamera</Button>
      {(camIsOpen) && <Kamera />}</p>
      <div className='flex self-center gap-x-10 my-4'>
      <Button variant="outlined" color="error" onClick={handleCancel}>Peruuta</Button>
      <Button variant="outlined" endIcon={<SendIcon />} onClick={handleSubmit}>Tallenna</Button>
      </div>
    </div>
  )
}

export default Fault