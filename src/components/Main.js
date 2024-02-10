import React, { useEffect, useState } from 'react'
import '../App.css';
import Rooms from '../components/Rooms';
import Categories from '../components/Categories';
import Observations from '../components/Observations';
import { initialRoomsState } from '../components/InitialObject';



function Main() {
  const [data, setData] = useState(() => {
    const storedData = localStorage.getItem('Testi');
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        if (parsedData && parsedData.rooms) {
          return parsedData;
        } 
      } catch (e) {
        console.log("Error parsing data from local storage: ", e);
      }
    }
    return initialRoomsState;
  });

  const [selectedRoomIndex, setSelectedRoomIndex] = useState(0)
  const [selectedCategoryIndex,setSelectedCategoryIndex] = useState(0)

  useEffect(() => {
    localStorage.setItem('Testi', JSON.stringify(data));
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
    console.log(data)
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

  const goThrough = () => {
    const room = data.rooms[selectedRoomIndex];
    if (room) {
      const category = room.categories[selectedCategoryIndex];
      if (category) {
        category.observations.forEach(observation => {
          if (observation.inOrder === 0 && observation.exceptions.length === 0) {
            console.log("testi");
          } else {
            console.log("toimii");
          }
        });
      }
    }
  };

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
