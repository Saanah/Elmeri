import React, { useEffect, useState } from 'react';
import '../App.css';
import Rooms from '../components/Rooms';
import Categories from '../components/Categories';
import Observations from '../components/Observations';
import { initialRoomsState } from '../components/InitialObject';
import { database } from '../firebase';
import { push, ref, set } from "firebase/database"; // Import ref and set functions


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
  const saveException = (poikkeama, vastuu, urgency, ongelma, pictureData, imgSrc, ob_index, ex_index) => {
    const tempData = { ...data };
    const tempObservations = [...tempData.rooms[selectedRoomIndex].categories[selectedCategoryIndex].observations];
    tempObservations[ob_index].exceptions[ex_index].description = poikkeama;
    tempObservations[ob_index].exceptions[ex_index].vastuu = vastuu;
    tempObservations[ob_index].exceptions[ex_index].urgency = urgency;
    tempObservations[ob_index].exceptions[ex_index].ongelma = ongelma;


    if(poikkeama === undefined) {
      tempObservations[ob_index].exceptions[ex_index].description = null;
    }
    if(vastuu === undefined) {  
      tempObservations[ob_index].exceptions[ex_index].vastuu = null;
    }
    if(urgency === undefined) {
      tempObservations[ob_index].exceptions[ex_index].urgency = null;
    }
    if(ongelma === undefined) {
      tempObservations[ob_index].exceptions[ex_index].ongelma = null;
    }
    
    
    if (pictureData === undefined) {
      tempObservations[ob_index].exceptions[ex_index].pictureData = null;
    } else {
      tempObservations[ob_index].exceptions[ex_index].pictureData = pictureData;
    }
    if (poikkeama === undefined && vastuu === undefined && urgency === undefined && ongelma === undefined) {
      tempObservations[ob_index].exceptions.splice(ex_index, 1);
    }
  
    tempData.rooms[selectedRoomIndex].categories[selectedCategoryIndex].observations = tempObservations;
    console.log(tempData)

    setData(tempData);
  };

  // Tallennetaan järjestyksessä oleva havainto
  const saveInOrder = (inOrder, notInOrder, ob_index) => {
    const tempData = {...data}; 
    const tempObservations = [...tempData.rooms[selectedRoomIndex].categories[selectedCategoryIndex].observations];
    tempObservations[ob_index].inOrder = inOrder;
    tempObservations[ob_index].notInOrder = notInOrder;
    tempData.rooms[selectedRoomIndex].categories[selectedCategoryIndex].observations = tempObservations;
    setData(tempData);
  };

  console.log(data)

  function sendDataToFirebase(test) {
    const currentDate = new Date().toLocaleDateString('fi-FI').replace(/\./g, '-'); // Get DD-MM-YYYY format
    
    // Reference to the location where you want to store your data
    const dataRef = ref(database, currentDate);
  
    // Set the data at the specified location
    push(dataRef, test)
      .then(() => {
        alert("Data successfully sent to Firebase!")
        console.log("Data successfully sent to Firebase!");
        localStorage.clear();
      })
      .catch((error) => {
        alert("Error sending data to Firebase: ", error)
        console.error("Error sending data to Firebase: ", error);
      });
  }

  const getdata = (e) => {
    e.preventDefault();
    sendDataToFirebase(data);
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
      <button id="button" onClick={getdata}>Lähetä data</button>
    </div>
  );
}

export default Main;
