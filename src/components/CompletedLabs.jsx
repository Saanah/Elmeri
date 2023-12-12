import React, { useState, useEffect } from 'react'
import CompletedItems from './CompletedItems'
import Button from '@mui/material/Button';

const CompletedLabs = ({completed}) => {

 // const [isOpen, setIsOpen] = useState(false)
  const [completedLabs, setCompletedLabs] = useState()
  let completedList = []
  const [selectedRoom, setSelectedRoom] = useState('')

  useEffect(() => {
    setCompletedLabs(completed)}, [completed])
  
  const handleClick = (index) => {
    let newRoom = completedLabs[index]
    if (newRoom !== selectedRoom) {
      setSelectedRoom(newRoom)
      console.log('Valittu tila:', selectedRoom)
    } else {setSelectedRoom('')}
  }

  const setCompletedList = () => {
    completedLabs.forEach((item, index) => {completedList.push( 
      <Button variant="outlined"> {() => {handleClick(index)}}
        <p>{item}</p>
      </Button>
    )})
    return completedList
  }

  return (
    <div>
      {(completedLabs) ? 
      <div className='flex flex-col'>
        <p className='text-lg mx-10'>Suoritetut tilat</p>
        <div className='flex flex-row justify-center mx-10'>
          {setCompletedList()}
        </div>
      </div> : null}
      {(selectedRoom) && <CompletedItems room={selectedRoom} />}
    </div>
  )
}

export default CompletedLabs