import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { Link, useNavigate } from "react-router-dom";
import "./CreateNewRaport.css";
import { AiOutlineHome } from "react-icons/ai";
import { MdDelete } from "react-icons/md";
import { getDatabase, ref, get, child,set } from 'firebase/database';




export default function CreateNewRaport() {
  const [selectedObserver, setSelectedObserver] = useState("");
  const [savedObservers, setSavedObservers] = useState([]);
  const [observerInput, setObserverInput] = useState("");
  const [selectedObservers, setSelectedObservers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getObserversFromLocalStorage();  //observer statejen vaihtuminen aktivoi rerenderöinnin, joten ei tarvita erillistä dependencyä []
  }, []);

  //Hakee tallennetut tarkastajat local storagesta, muuten palauttaa tyhjän jonon
  const getObserversFromLocalStorage = () => {
    const observersFromLocalStorage = JSON.parse(localStorage.getItem("savedObservers")) || [];
    setSavedObservers(observersFromLocalStorage);
  };

  //Tallentaa lisätyt tarkastajat local storageen
  const saveObserverToLocalStorage = () => {
    if (observerInput.length < 2 || observerInput.trim() === "") {
      window.alert("Tarkastajan nimi on liian lyhyt!");
      return;
    }

    //Tarkistaa, jos tarkastaja on jo valittuna, eli löytyykö se selectedObservers-jonoon
    if (selectedObservers.includes(observerInput)) {
      window.alert("Tarkastaja on jo lisätty!");
      setObserverInput(""); //tyhjentää tarkastajan lisäys input fieldin
    }
    else {

      //Jos tarkastajaa ei ole vielä lisätty, lisää se valittuihin tarkastajiin
      const updatedSelectedObservers = [...selectedObservers, observerInput];
      setSelectedObservers(updatedSelectedObservers);

      //Jos tallennetuissa tarkastajissa ei ole vielä kyseistä tarkastajaa, lisää tarkastaja savedObserves-jonoon
      if (!savedObservers.includes(observerInput)) {
        const updatedSavedObservers = [...savedObservers, observerInput];
        setSavedObservers(updatedSavedObservers);
        localStorage.setItem("savedObservers", JSON.stringify(updatedSavedObservers)); //Päivitä local storage uudella arvolla
      }

      setObserverInput("");

    }
  };


  const saveObserversToDatabase = async () => {
    try {
      const currentDate = new Date().toISOString().slice(0, 10);
      const database = getDatabase(); // Get a reference to the database
      const inspectorRef = ref(database, `Inspectors/${currentDate}`); // Get a reference to the path
      await set(inspectorRef, selectedObservers); // Set the data
      console.log("Observers saved to database successfully");
      navigate("/tarkastuskohdat");
    } catch (error) {
      console.error("Error saving observers to database:", error);
    }
  };

  //Poistaa tarkastajan valituista tarkastajista ja päivättää valitut tarkastajat
  const handleDeleteObserver = (observerToDelete) => {

    const updatedSelectedObservers = selectedObservers.filter(
      (observer) => observer !== observerToDelete
    );

    setSelectedObservers(updatedSelectedObservers);
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
        <Button
          variant="contained"
          onClick={saveObserverToLocalStorage}
          style={{
            backgroundColor: "#3498db",
          }}
        >
          Lisää
        </Button>
        <div className="Observer-container">
          <hr />
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
        <Button
          variant="contained"
          onClick={() => {
            if (selectedObservers.length !== 0) {
              saveObserversToDatabase(); // Save observers to the database
              navigate("/tarkastuskohdat"); // Navigate to the next page
            }
          }}
          sx={{
            backgroundColor:
              selectedObservers.length === 0 ? "#eaeaea" : "#3498db",
            "&:disabled": {
              backgroundColor: "#eaeaea",
            },
          }}
          disabled={selectedObservers.length === 0}
        >
          Jatka
        </Button>
      </div>
    </div>
  );
}
