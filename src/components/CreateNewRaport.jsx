import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import DropdownLabs from "./DropdownLabs";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { Link } from "react-router-dom";
import "../App.css";
import { AiOutlineHome } from "react-icons/ai";
import { firestoreDb, collection, addDoc, getDocs } from "../firebase";
import { MdDelete } from "react-icons/md";

export default function CreateNewRaport() {
  const [selectedObserver, setSelectedObserver] = useState("");
  const [savedObservers, setSavedObservers] = useState([]);
  const [observerInput, setObserverInput] = useState("");
  const [selectedObservers, setSelectedObservers] = useState([]);
  const [selectedLab, setSelectedLab] = useState("");

  useEffect(() => {
    getObservers();
  }, []);

  //Hae tallennetut tarkastajat Firestoresta, jotta ne voidaan näyttää dropdownissa
  const getObservers = async () => {
    try {
      const observerCollectionRef = collection(firestoreDb, "saved_observers");
      const observerSnapshot = await getDocs(observerCollectionRef);
      const observerData = observerSnapshot.docs.map(
        (observerDoc) => observerDoc.data().name
      );
      setSavedObservers(observerData);
    } catch (error) {
      console.error("Error getting observers from Firestore: ", error);
    }
  };

  //Talenna lisätty tarkastaja Firestoreen, jos se täyttää kriteerit
  const saveObserverToFirestore = async () => {

    // Jos tarkastajan nimi on tyhjä tai pienempi kuin kaksi merkkiä, älä suorita
    if (observerInput.length < 2 || observerInput.trim() === "") {
      window.alert("Tarkastajan nimi on liian lyhyt!");
      return;
    }

    // Jos tarkastaja on jo valittu, älä lisää duplikaattia
    if (selectedObservers.includes(observerInput)) {
      window.alert("Tarkastaja on jo lisätty!");
      setObserverInput("");
    }
    //Jos tarkastaja on jo tallennettu Firestoreen, älä tallenna duplikaattia, mutta lisää tarkastajaksi listaan
    else if (savedObservers.includes(observerInput)) {
      setSelectedObservers([...selectedObservers, observerInput]);
      setObserverInput("");
    }
    else {
      //Tallenna uusi tarkastaja Firestoreen
      try {
        const observerCollectionRef = collection(
          firestoreDb,
          "saved_observers"
        );
        await addDoc(observerCollectionRef, { name: observerInput });
        console.log("Observer added to Firestore:", observerInput);
        getObservers(); // Hae dropdowniin päivitetyt tarkastajat
        setObserverInput(""); // Puhdista input fieldi
        setSelectedObservers([...selectedObservers, observerInput]); // Lisää valittu tarkastaja
      }
      catch (error) {
        console.error("Error adding observer to Firestore: ", error);
      }
    }
  };

  //Poista valittu tarkastaja
  const handleDeleteObserver = (observerToDelete) => {
    const updatedObservers = selectedObservers.filter(
      (observer) => observer !== observerToDelete
    );
    setSelectedObservers(updatedObservers);
  };

  return (
    <div>
      <div className="Header">
        <p>Luo uusi raportti</p>
        <Link to="/">
          <AiOutlineHome size={28} style={{ marginTop: "30%" }} />
        </Link>
      </div>
      <div className="CreateNewRaport-container">
        <Autocomplete
          className="CreateNewRaport-items"
          value={selectedObserver}
          inputValue={observerInput}
          onChange={(event, newObserverValue) =>
            setSelectedObserver(newObserverValue)
          }
          onInputChange={(event, newObserverInput) =>
            setObserverInput(newObserverInput)
          }
          options={savedObservers}
          freeSolo
          renderInput={(params) => (
            <TextField
              {...params}
              label="Lisää tarkastaja"
              variant="outlined"
            />
          )}
        />
        <Button variant="contained" onClick={saveObserverToFirestore}>
          Lisää
        </Button>
        <div className="Observer-container">
        <hr/>
    <p className="bold-text">Tarkastajat</p>
    {selectedObservers.length === 0 ? (
      <p>Ei valittua tarkastajaa</p>
    ) : (
      selectedObservers.map((observer, index) => (
        <div className="Observers" key={index}>
          <span>{observer}</span>
          <MdDelete
            size={24}
            onClick={() => handleDeleteObserver(observer)}
            style={{ verticalAlign: "text-bottom" }}
          />
        </div>
      ))
    )}
  </div>
  <hr/>
  <p  className="bold-text">Valitse tila</p>
  <DropdownLabs onSelectedLab={setSelectedLab} />
  <Link to="/tarkastuskohdat">
    <Button variant="contained"
    disabled={selectedObservers.length === 0}>
      Jatka
    </Button>
  </Link>
</div>
</div>
);
}

