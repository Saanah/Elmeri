import React, { useEffect, useState } from 'react'
import '../App.css';
import Rooms from '../components/Rooms';
import Categories from '../components/Categories';
import Observations from '../components/Observations';
import { initialRoomsState } from '../components/InitialObject';



function Main() {
  const [data, setData] = useState(() => {
    const storedData = localStorage.getItem('saveData');
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        if (parsedData && parsedData.rooms) {
          return parsedData;
        } 
      } catch (e) {
        console.log("Error parsing data from local storage: ", e);
        alert("Error parsing data from local storage: ", e)
      }
    }
    return initialRoomsState;
  });

  const [selectedRoomIndex, setSelectedRoomIndex] = useState(0)
  const [selectedCategoryIndex,setSelectedCategoryIndex] = useState(0)

  useEffect(() => {
    localStorage.setItem('saveData', JSON.stringify(data));
  }, [data]);
  
  const addException = (index) => {
    const tempData = {...data} 
    const tempObservations = [...tempData.rooms[selectedRoomIndex].categories[selectedCategoryIndex].observations]
    tempObservations[index].exceptions.push({description: ""}) 
    tempData.rooms[selectedRoomIndex].categories[selectedCategoryIndex].observations = tempObservations
    setData(tempData) 
  }

  const saveException = (poikkeama,vastuu,urgency,ob_index,ex_index) => {
    const tempData = {...data} 
    const tempObservations = [...tempData.rooms[selectedRoomIndex].categories[selectedCategoryIndex].observations]
    tempObservations[ob_index].exceptions[ex_index].description = poikkeama;
    tempObservations[ob_index].exceptions[ex_index].vastuu = vastuu;
    tempObservations[ob_index].exceptions[ex_index].urgency = urgency;

    if (poikkeama === undefined && vastuu === undefined && urgency === undefined) {
      tempObservations[ob_index].exceptions = [];
    }
    
    tempData.rooms[selectedRoomIndex].categories[selectedCategoryIndex].observations = tempObservations
    
    setData(tempData)
  }


  const saveInOrder = (inOrder, ob_index) => {
    const tempData = {...data} 
    const tempObservations = [...tempData.rooms[selectedRoomIndex].categories[selectedCategoryIndex].observations]
    tempObservations[ob_index].inOrder = inOrder
    ///console.log(tempObservations[ob_index].inOrder)
    tempData.rooms[selectedRoomIndex].categories[selectedCategoryIndex].observations = tempObservations
    setData(tempData)
  }

  return (
    <div className="container">
      <Rooms 
        rooms={data.rooms} 
        selectedRoomIndex={selectedRoomIndex} 
        setSelectedRoomIndex={setSelectedRoomIndex} 
      />
      <Categories 
        categories={data.rooms[selectedRoomIndex].categories} 
        selectedCategoryIndex={selectedCategoryIndex} 
        setSelectedCategoryIndex={setSelectedCategoryIndex}
      />
      <Observations 
        observations={data.rooms[selectedRoomIndex].categories[selectedCategoryIndex].observations}
        saveInOrder={saveInOrder}
        addException={addException}
        saveException={saveException}
      />
    </div>
  );
}

export default Main;
