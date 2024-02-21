import React, { useEffect, useState } from 'react';
import '../App.css';
import Rooms from '../components/Rooms';
import Categories from '../components/Categories';
import Observations from '../components/Observations';
import { initialRoomsState } from '../components/InitialObject';

function Main() {
  // Tilamuuttuja datan hallintaan, alustetaan paikallisella varastolla tai oletusarvoilla 
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
      }
    }
    return initialRoomsState;
  });

  // Tilamuuttujat valitulle huoneelle ja kategorialle
  const [selectedRoomIndex, setSelectedRoomIndex] = useState(0);
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(0);

  // Tallennetaan data paikalliseen varastoon aina kun se muuttuu
  useEffect(() => {
    localStorage.setItem('saveData', JSON.stringify(data));
  }, [data]);
  
  // Lisätään poikkeama havaintoon
  const addException = (index) => {
    const tempData = {...data}; 
    const tempObservations = [...tempData.rooms[selectedRoomIndex].categories[selectedCategoryIndex].observations];
    tempObservations[index].exceptions.push({description: ""}); 
    tempData.rooms[selectedRoomIndex].categories[selectedCategoryIndex].observations = tempObservations;
    setData(tempData); 
  };

  // Tallennetaan poikkeama
  const saveException = (poikkeama, vastuu, urgency, ob_index, ex_index) => {
    const tempData = {...data}; 
    const tempObservations = [...tempData.rooms[selectedRoomIndex].categories[selectedCategoryIndex].observations];
    tempObservations[ob_index].exceptions[ex_index].description = poikkeama;
    tempObservations[ob_index].exceptions[ex_index].vastuu = vastuu;
    tempObservations[ob_index].exceptions[ex_index].urgency = urgency;
    if (poikkeama === undefined && vastuu === undefined && urgency === undefined) {
      tempObservations[ob_index].exceptions.splice(ex_index, 1);
    }
    tempData.rooms[selectedRoomIndex].categories[selectedCategoryIndex].observations = tempObservations;
    setData(tempData);
  };

  // Tallennetaan järjestyksessä oleva havainto
  const saveInOrder = (inOrder, ob_index) => {
    const tempData = {...data}; 
    const tempObservations = [...tempData.rooms[selectedRoomIndex].categories[selectedCategoryIndex].observations];
    tempObservations[ob_index].inOrder = inOrder;
    tempData.rooms[selectedRoomIndex].categories[selectedCategoryIndex].observations = tempObservations;
    setData(tempData);
  };



  return (
    <div className="container">
      {/* Näytetään huoneet */}
      <Rooms 
        rooms={data.rooms} 
        selectedRoomIndex={selectedRoomIndex} 
        setSelectedRoomIndex={setSelectedRoomIndex} 
      />
      {/* Näytetään kategoriat */}
      <Categories 
        categories={data.rooms[selectedRoomIndex].categories} 
        selectedCategoryIndex={selectedCategoryIndex} 
        setSelectedCategoryIndex={setSelectedCategoryIndex}
      />
      {/* Näytetään havainnot */}
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
