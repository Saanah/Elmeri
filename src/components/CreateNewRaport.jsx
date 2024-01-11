import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import DropdownLabs from "./DropdownLabs";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { Link } from "react-router-dom";
import "../App.css";
import { AiOutlineHome } from "react-icons/ai";
import {
  firestoreDb,
  collection,
  addDoc,
  getDocs,
} from "../firebase";

export default function CreateNewRaport() {
  const [selectedObserver, setSelectedObserver] = useState("");
  const [savedObservers, setSavedObservers] = useState([]);
  const [observerInput, setObserverInput] = useState("");

  useEffect(() => {
    getObservers();
  }, []);

  const getObservers = async () => {
    try {
      const observerCollectionRef = collection(firestoreDb, "saved_observers");
      const observerSnapshot = await getDocs(observerCollectionRef);
      const observerData = observerSnapshot.docs.map(
        (observerDoc) => observerDoc.data().name
      );
      setSavedObservers(observerData);
    } catch (error) {}
  };

  const saveObserverToFirestore = async () => {
    //Jos tarkastajan nimi on tyhjä tai pienempi kuin kaksi merkkiä, älä suorita
    if (observerInput.length < 2 || observerInput.trim() == "") {
      return;
    }

    //Jos tarkastajan nimi on jo tallennettu, älä suorita
    if (savedObservers.includes(observerInput)) {
      return;
    }

    try {
      const observerCollectionRef = collection(firestoreDb, "saved_observers");
      await addDoc(observerCollectionRef, { name: observerInput });
      console.log("Observer added to Firestore:", observerInput);
      getObservers(); // Hae dropdowniin päivitetyt tarkastajat
      setObserverInput(""); //Puhdista input fieldi
    } catch (error) {
      console.error("Error adding observer to Firestore: ", error);
    }
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
        <div style={{marginTop: '2rem', marginBottom: '2rem', textAlign: 'center'}}>
        <p>Tarkastajat:</p>
        {selectedObserver}
        </div>
        <Button
          variant="contained"
          onClick={saveObserverToFirestore}
        >
          Lisää
        </Button>
        <p style={{marginTop: '2rem'}}>Valitse tila</p>
        <DropdownLabs/>
        <Link to="/tarkastuskohdat" style={{marginTop: '2rem'}}> {/* pitää vaihtaa*/}
          <Button
            variant="contained"
          >
            Jatka
          </Button>
          </Link>
      </div>
    </div>
  );
}
