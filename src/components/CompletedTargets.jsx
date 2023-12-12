import React, { useState, useEffect } from 'react'
import Handleinputs from './Handleinputs'

const CompletedTargets = ({completed}) => {

  const[targetArray, setTargetArray] = useState()
  const[percentIndex, setPercentIndex] = useState(0)
  let room = []
  let completedTargetsList = []
  let editedTargetsList = []
  let mappedFaults = []
  let okAmount = 0
  let notOkAmount = 0

  useEffect(() => {
    completedTargetsList = Handleinputs()
    setTargetArray(editArray())
  }, [])

  const editArray = () => {
    completedTargetsList.map((item, index) => {
      room.push(item.room.name)
      item.targets.map((target, tIndex) => {
        let found = editedTargetsList.find(item => item.target === target.name)
        if (!found) editedTargetsList.push({target: target.name, obs: []})
        target.obs.map((item, oIndex) => {
          okAmount += parseInt(item.okCount)
          notOkAmount += parseInt(item.notOkCount)
          let foundO = editedTargetsList[tIndex].obs.find(listItem => listItem.name === item.name)
          if (!foundO) {
            if (item.notOkCount > 0) { editedTargetsList[tIndex].obs.push({name: item.name, okCount: item.okCount, notOkCount: item.notOkCount, showFaults: false, faults:[{room: room[index], roomFaults: [...item.faults]}]})
            } else { editedTargetsList[tIndex].obs.push({name: item.name, okCount: item.okCount, notOkCount: item.notOkCount, showFaults: false, faults:[]})}
          }
          else {
            editedTargetsList[tIndex].obs[oIndex].okCount += item.okCount
            editedTargetsList[tIndex].obs[oIndex].notOkCount += item.notOkCount
            if (item.notOkCount > 0) {editedTargetsList[tIndex].obs[oIndex].faults.push({room: room[index], roomFaults: [...item.faults]})}
          }
        })
      })
    })
    calculateIndex()
    console.log('editedTargetsList: ', editedTargetsList)
    return editedTargetsList
  }

  const handleShowFaults = (props) => {
    let stateCopy = targetArray.slice()
    stateCopy[props.tIndex].obs[props.oIndex].showFaults = !stateCopy[props.tIndex].obs[props.oIndex].showFaults
    setTargetArray(stateCopy)
  }

  const mapObs = ({tIndex}) => {
    return (targetArray[tIndex].obs.map((obj, oIndex) => (
      <div className='mb-2 mx-20'>
        <p className='border-b-2'>{obj.name}</p>
        <p>Kunnossa: {obj.okCount}</p>
        <p>Ei kunnossa: {obj.notOkCount}</p>
        {(obj.faults.length > 0) && 
        <>
        <button onClick={() => handleShowFaults({tIndex, oIndex})} className='border-b-2 bg-light-blue py-1 px-16 my-2 font-md'>Näytä poikkeukset</button>
        {obj.faults.map((fault, index) => {
          <p>Tila: {fault.room}</p>
        })}
        {(obj.showFaults) && mapFaults({tIndex, oIndex})}
        </>}
        </div>
    )))
  }

  const mapFaults = (props) => {
    targetArray[props.tIndex].obs[props.oIndex].faults.map((fault, index) => {
      if (fault.roomFaults.length > 0) {
        mappedFaults.push(
        <div>
          <div className='flex flex-row gap-4'>
            <p className='font-semibold'>Tila: {fault.room}</p>
            {(fault.roomFaults.length > 1) ? <p>{fault.roomFaults.length} poikkeusta</p> :
            <p>{fault.roomFaults.length} poikkeus</p>}
          </div>
          <div className='border rounded-md gap-4'>
            {/*mapRoomFaults({faultsList:fault.roomFaults, index:index})*/}
            {fault.roomFaults.map(roomFault => {
              return(<div className='flex flex-col items-center my-4 px-2'>
                <p><span className='font-semibold'>Poikkeama/toimenpide: </span>{roomFault.exception}</p>
                <div className='flex flex-row gap-2'>
                  <p><span className='font-semibold'>Vastuutaho: </span>{roomFault.responsible}</p>
                  <p><span className='font-semibold'>Kiireellisyys: </span>{roomFault.urgency}</p>
                </div>
              </div>)
            })}
          </div>
        </div>)
      }}
    )
    return mappedFaults
  }

  const mapRoomFaults = ({faultsList, index}) => {
    let fault = null
    console.log('mapRoomFaults faultList', faultsList)
    fault = faultsList.map((item) => {
      <div>
        <p>{item.exception}</p>
        <p>{item.responsible}</p>
        <p>{item.urgency}</p>
      </div>
    })
    return fault
  }

  const mapTargetList = () => {
      return(
      targetArray.map((item, index) => (
        <div className='flex flex-col justify-items-start' key={item}>
          <p className='border-b-2 mx-20 px-10 mb-2 font-bold text-lg'>{item.target}</p>
          <div>
            {mapObs({tIndex:index})}
          </div>
        </div>
      )))
  }

  const calculateIndex = () => {
    let result = Number(okAmount/(okAmount+notOkAmount))
    result = result * 100
    result = result.toFixed(2)
    setPercentIndex(result)
  }

  return (
    <div className='flex flex-row'>
      {(targetArray) ? <div className='flex flex-col gap-4 mb-40'>{mapTargetList()}</div> : null}
      <div className='float-right object-right-top fixed bottom-10 left-10 py-2 px-2 border-2 rounded-md bg-white opacity-100'>
        <p className='font-bold'>Indeksi: </p>
        <div className='flex flex-row'><div><p>Kunnossa</p><p className='border-t-2'>(Kunnossa+Ei kunnossa)</p></div><p className='my-3 ml-1'>x100</p></div>
        <p className='font-semibold'>= {percentIndex}</p>
      </div>
    </div>
  )
}

export default CompletedTargets