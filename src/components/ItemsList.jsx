import React, { useState, useEffect } from 'react'
import Fault from './Fault';
import Faultslist from './Faultslist';
import { addItems, deleteFault, setOkCount, getFaults } from './Handleinputs';
import Button from '@mui/material/Button';


const ItemsList = ({objects}) => {

  const [obsArray, setObsArray] = useState([]);

  let objectList = []

  // propsina tuoduille kohteille täyttää objektilistan tietojen tallennukseen
  useEffect(() => {
    objects.forEach((item) => {
      objectList.push({name: item.obj, showFault: false, okCount: 0, notOkCount: 0, faults: []})
    })  
    setObsArray(objectList)
    addItems({objectList})
  }, [objects])

  // kasvattaa kunnossa/ei kunnossa lukumääriä
  // päivittää tilan ja lisää myös datan Handleinputs listaan
  const incrementCount = ({name, index}) => {
    let stateCopy = obsArray.slice()
    if (name === 'ok') {
      if (stateCopy[index].okCount < 15) {
        stateCopy[index].okCount += 1
        setObsArray(stateCopy)
        setOkCount({count:stateCopy[index].okCount, index:index})
      }
    }
    if (name === 'notOk' && !stateCopy[index].showFault) {
      if (stateCopy[index].notOkCount < 15) {
        stateCopy[index].notOkCount += 1
        stateCopy[index].showFault = !stateCopy[index].showFault
        setObsArray(stateCopy)
      }
    }
  }

  // pienentää kunnossa/ei kunnossa lukuja
  // poistaa viimeisimmän ei kunnossa kohdan, jos ei kunnossa määrä vähenee
  const decrementCount = ({name, index}) => {
    let stateCopy = obsArray.slice()
    if (name === 'ok') {
      stateCopy[index].okCount -= 1
      setObsArray(stateCopy)
      setOkCount({count:stateCopy[index].okCount, index:index})
    }
    if (name === 'notOk' && !stateCopy[index].showFault) {
      stateCopy[index].notOkCount -= 1
      stateCopy[index].faults.pop()
      deleteFault({index:index})
      setObsArray(stateCopy)
    }
  }

  // poikkeuksen täytön peruutus
  const handleCancel = ({index}) => {
    let stateCopy = obsArray.slice()
    stateCopy[index].notOkCount -= 1
    stateCopy[index].showFault = !stateCopy[index].showFault
    setObsArray(stateCopy)
  }

  // 
  const addFaultAtIndex = ({fault, index}) => {
    let stateCopy = obsArray.slice()
    stateCopy[index].faults = getFaults({index:index})
    stateCopy[index].showFault = !stateCopy[index].showFault
    setObsArray(stateCopy)
  }


  // poistaa poikkeuksien listasta poikkeuksen indeksin mukaan
  const deleteFaultFromArray = ({index, fIndex}) => {
    let stateCopy = obsArray.slice()
    stateCopy[index].faults.splice(fIndex, 1)
    stateCopy[index].notOkCount -= 1
    setObsArray(stateCopy)
  }

  const faultListEdited = (props) => {
    let stateCopy = obsArray.slice()
    stateCopy[props.oIndex].faults = getFaults({index:props.oIndex})
    setObsArray(stateCopy)
  }

  // laskuri kunnossa/ei kunnossa kohdille
  const Counter = ({ value, incrementCount, decrementCount }) => {
    return (
      <div className='mx-4 space-x-2'>
        {(value > 0) ? 
          <Button variant="outlined" onClick={decrementCount}>
            -
          </Button> :
          <Button variant="outlined" size="small">-</Button>}
        <span>{value}</span>
        <Button variant="outlined" size="small" onClick={incrementCount}>
          +
        </Button>
      </div>
    )
  }
 
  // tilan ollessa valittuna näyttää jokaiselle kohteelle 
  return (
    <div>{
      obsArray.map((item, index) => (
        <div className='my-5' key={item.name}>
        {console.log('mapped item', item)}
          <p className='flex justify-left mx-6'>Kohta {index + 1}:<span className='font-bold pl-2'> {item.name}</span></p>
            <hr className='bg-gray-500 m-b-1'/>
            <div className='flex flex-row justify-center m-t-1 space-x-16 mb-2'>
              <div>
                <p>Kunnossa</p>
                <div>
                  {Counter({
                    value: obsArray[index].okCount,
                    incrementCount: () => incrementCount({name: 'ok', index: index}),
                    decrementCount: () => decrementCount({name: 'ok', index: index})
                  })}
                </div>
              </div>
              <div>
                <p>Ei kunnossa</p>
                <div>
                  {Counter({
                    value: obsArray[index].notOkCount,
                    incrementCount: () => incrementCount({name: 'notOk', index: index}),
                    decrementCount: () => decrementCount({name: 'notOk', index: index})
                  })}
                </div>
              </div>
            </div>
            {(obsArray[index].showFault) && <Fault index={index} cancel={() => handleCancel({index: index})} number={obsArray[index].notOkCount} addFault={addFaultAtIndex} edit={false} />}
            {(obsArray[index].faults.length > 0) && <Faultslist oIndex={index} faults={obsArray[index].faults} deleteFault={deleteFaultFromArray} editFaultList={faultListEdited} />}
        </div>
  ))
  }</div>)
}

export default ItemsList