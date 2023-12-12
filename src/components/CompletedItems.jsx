import React, { useState, useEffect } from 'react'
import getTargetList from './Handleinputs'

const CompletedItems = ({room}) => {
  const [completedItems, setCompletedItems] = useState()
  const [filteredItems, setFilteredItems] = useState()
  let completedItemsList = []
  let filtered = []
  const [isOpen, setIsOpen] = useState(false)
  const [targetIndex, setTargetIndex] = useState(null)
  let newBool = false

  useEffect(() => {
    console.log('completedItems room: ', room)
    completedItemsList = getTargetList({room:room})
    console.log('completedItems lista: ', completedItemsList)
    filtered = completedItemsList.filter(target => {return target.room.name === room})
    filterArray()
    setCompletedItems(completedItemsList)}, [room])

  const handleOpen = (index) => {
    newBool = true
    if (index === targetIndex) {
      newBool = !isOpen}
    setTargetIndex(index)
    console.log('targetIndex on: ', index)
    setIsOpen(newBool)
  }

  const filterArray = () => {
    setFilteredItems(filtered)
    console.log('filtteroitu lista', filtered)
  }

  const obsList = () => {
    return (
      (filteredItems) && 
        <div className='flex flex-col my-6 justify-left'>
          {filteredItems[0].targets[targetIndex].obs.map((item) => (
            <div className='my-4'>
              {console.log('map obs targetIndex: ', targetIndex)}
              {console.log('map obs filteredItems: ', filteredItems[0])}
              {console.log('map obs item: ', item)}
              {console.log('map obs notOkCount: ', item.notOkCount)}
              <p>
                {item.name}
              </p>
              <p>Kunnossa {item.okCount}</p>
              <p>Ei kunnossa {item.notOkCount}</p> 
            </div>
          ))}
        </div>
      )
  }

  return (
    <div>
      <div className='flex flex-row justify-left my-4'>
        {(completedItems) && completedItems[0].targets.map((item, index) => (
          <div className='border-b-2 px-8 hover:bg-primary-blue hover:scale-110 hover:pt-5 hover:text-white'>
            {console.log('map item: ', item)}
            <button onClick={() => handleOpen(index)}>
              <p>{item.name}</p>
            </button>
          </div>
        ))}
      </div>
      {(isOpen) && obsList()}
    </div>
  )
}

export default CompletedItems