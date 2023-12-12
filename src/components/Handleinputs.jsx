// lista johon tallennetaan käyttäjän syöttämä data
let contentArray = []
let rIndex = 0
let tIndex = 0

// lisää huoneen listaan
const addRoom = (room) => {
  contentArray.push({room: room, targets:[]})
  setRoomIndex()
  console.log('room lisatty', contentArray)
}

// lisää kohteet huoneelle
const addTargets = (target) => {
  contentArray[rIndex].targets.push({name:target.target, obs:[]})
  console.log('target lisatty ',contentArray)
  setTargetIndex()
}

// lisää kohteille sisällön
const addItems = (props) => {
  let itemsList = props.objectList
  for (let i = 0; i < itemsList.length; i++) {
    contentArray[rIndex].targets[tIndex].obs.push({name:itemsList[i].name, okCount:itemsList[i].okCount, notOkCount:itemsList[i].notOkCount, faults:[]})
  }
  console.log('addItems lista on: ', contentArray)
}

// lisää poikkeuksen
const addFault = ({fault, index}) => {
  console.log('addFault indeksi: ', index)
  console.log('handleInputs addFault fault: ', fault)
 // const faultItem = {exception:fault.exception, responsible:fault.responsible, urgency:fault.urgency}
  contentArray[rIndex].targets[tIndex].obs[index].faults.push(fault)
  const countFaults = contentArray[rIndex].targets[tIndex].obs[index].faults.length
  contentArray[rIndex].targets[tIndex].obs[index].notOkCount = countFaults
}

// poistaa viimeisimmän poikkeuksen
const deleteFault = ({index}) => {
  contentArray[rIndex].targets[tIndex].obs[index].faults.pop()
  const countFaults = contentArray[rIndex].targets[tIndex].obs[index].faults.length
  contentArray[rIndex].targets[tIndex].obs[index].notOkCount = countFaults
}

// poistaa poikkeuksen tietystä indeksistä
const deleteFaultAtIndex = ({index, fIndex}) => {
  contentArray[rIndex].targets[tIndex].obs[index].faults.splice(fIndex, 1)
  const countFaults = contentArray[rIndex].targets[tIndex].obs[index].faults.length
  contentArray[rIndex].targets[tIndex].obs[index].notOkCount = countFaults
  console.log('fault poistettu: ', contentArray[rIndex].targets[tIndex].obs[index].faults)
}

const setFaultDataAtIndex = ({fault, oIndex, fIndex}) => {
  console.log('setFaultDataAtIndex propsit: ', fIndex)
  contentArray[rIndex].targets[tIndex].obs[oIndex].faults.splice(fIndex, 1, fault)
  console.log('fault muokattu: ', contentArray[rIndex].targets[tIndex].obs[oIndex].faults)
}

// asettaa kunnossa määrän
const setOkCount = ({count, index}) => {
  contentArray[rIndex].targets[tIndex].obs[index].okCount = count
}

// lisää indeksiä listan pituuden mukaan
const setRoomIndex = () => {
  rIndex = contentArray.length - 1
}

// lisää kohteiden indeksiä kohteiden määrän mukaan 
const setTargetIndex = () => {
  tIndex = contentArray[rIndex].targets.length - 1
}

// palauttaa indeksin kohdasta poikkeukset 
const getFaults = ({index}) => {
  console.log('getFaults indeksi: ', index)
  console.log('palautettu faults: ', contentArray[rIndex].targets[tIndex].obs[index].faults)
  return contentArray[rIndex].targets[tIndex].obs[index].faults
}

// palauttaa tietyn tilan datan
const getTargetList = (room) => {
  console.log('handleInputs room: ', room)
  let targetRoomList = contentArray.filter(target => {return target.room.name === room})
  console.log('getTargetList: ', targetRoomList)
  return targetRoomList
}

// palauttaa listan
const Handleinputs = () => {
  console.log('HandleInputs kutsuttu')
  return contentArray
}

export default Handleinputs

export { addRoom, addTargets, addItems, addFault, deleteFault, setOkCount, getFaults, getTargetList, deleteFaultAtIndex, setFaultDataAtIndex }
