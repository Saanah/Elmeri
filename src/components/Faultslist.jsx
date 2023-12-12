import React from 'react'
import { useState, useEffect } from 'react'
import Fault from './Fault'
import { deleteFaultAtIndex, getFaults, setFaultDataAtIndex } from './Handleinputs'

const Faultslist = ({oIndex, faults, deleteFault, editFaultList}) => {

  const[faultArray, setFaultArray] = useState(null)
  const[showList, setShowList] = useState(false)
  const[editFault, setEditFault] = useState([])
  let editArray = []
  let fIndex = 0
  
  // asetta propseista saaduista poikkeuksista listan tilaan
  useEffect(() => {
    faults.forEach(item => {
      editArray.push(false)
    })
    setEditFault(editArray)
    setFaultArray(faults)}, [faults])

  // muuttaa boolin, joka määrittää näkyykö lista
  const changeShow = () => {
    let newBool = !showList
    setShowList(newBool)
  }

  const editReady = () => {
    editFaultList({oIndex:oIndex})
  }

  const handleChange = (props) => {
    let stateCopy = editFault.slice()
    stateCopy[props.fIndex] = !stateCopy[props.fIndex]
    fIndex = props.fIndex
    setEditFault(stateCopy)
  }

  // poistaa indeksin mukaisen poikkeuksen listasta
  const handleDelete = ({fIndex}) => {
    deleteFault({index:oIndex, fIndex:fIndex})
    deleteFaultAtIndex({index:oIndex, fIndex:fIndex})
  }

  // asettaa poikkeuksien listasta näkymän
  const mapFaults = () => {
    if (faultArray) {
      return (
      faultArray.map((item, index) => (
        (!editFault[index]) ?
        <div className='flex flex-col space-between items-center border-b'>
          <p className='font-bold'>{index + 1}. Poikkeama</p>
          <div className='px-1 items-center my-2'>
            <p>Poikkeama: {item.exception}</p>
            <div className='flex flex-row gap-x-8 my-2'>
              <p>Vastuutaho: {item.responsible}</p>
              <p>Kiireellisyys: {item.urgency}</p>
            </div>
          </div>
          <div className='flex flex-row gap-x-10'>
            <button className='border-2 border-white bg-primary-blue text-white rounded-lg mx-2 my-4 px-4 py-1  hover:scale-110 transition ease-in-out duration-300 text-lg' onClick={() => handleChange({fIndex: index})}>Muokkaa</button>
            <button className='border-2 border-white bg-oamk-orange rounded-lg mx-2 my-4 px-4 py-1 hover:scale-110 transition ease-in-out duration-300 text-lg' onClick={() => handleDelete({fIndex: index})}>Poista</button>
          </div>
        </div> :
        <Fault fault={faultArray[index]} oIndex={oIndex} fIndex={index} faultEdited={editReady} number={index + 1} edit={true} show={handleChange} />
      )))
    }
  }

  // palauttaa näppäimen ja poikkeuslista näkymän
  return (
    <div className=''>
      {(faultArray) && (faultArray.length > 0) && <button onClick={changeShow} className='border-b-2 py-1 px-16 my-2 font-md'>Näytä poikkeukset</button>}
      {(showList) && mapFaults()}
    </div>
  )
}

export default Faultslist