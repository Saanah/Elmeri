// Tuodaan tarvittavat tyylit ja React-kirjaston toiminnot
import './Rooms.css';
import React, { useState, useEffect } from 'react';

// Luodaan ja exportataan Rooms-komponentti, joka mahdollistaa huoneiden näyttämisen ja hallinnan
export default function Rooms({rooms, selectedRoomIndex, setSelectedRoomIndex}) {
  // Tilamuuttuja nykyisen tilan nimen hallintaan
  const [tila, setTila] = useState('');

  // Funktio vaihtaa valittua huonetta
  const switchRoom = (index) => {
    setSelectedRoomIndex(index);
  };

  // Vaikutetaan tilamuuttujaan, kun 'selectedRoomIndex' muuttuu
  useEffect(() => {
    // Asetetaan tilamuuttujaan nykyisen huoneen nimi valitun huoneen indeksin perusteella
    switch (selectedRoomIndex) {
      case 0:
        setTila("5A101");
        break;
      case 1:
        setTila("5A102");
        break;
      case 2:
        setTila("5A103");
        break;
      case 3:
        setTila("5B103");
        break;
      case 4:
        setTila("5A105");
        break;
      case 5:
        setTila("LVI-tekniikka");
        break;
      default:
        setTila('');
    }
  }, [selectedRoomIndex]);

  // Palautetaan huoneet listana ja mahdollisuus valita huone
  return (
    <div>
      <ul className="room-list">
        {/* Karttataulukon huoneet */}
        {rooms.map((room, index) => (
          <li key={room.name}>
            <button
              // Merkitään valittu huone eri luokalla
              className={selectedRoomIndex === index ? "selected" : ""}
              id="button2"
              type="button"
              onClick={() => switchRoom(index)} // Kutsutaan switchRoom-funktiota huonetta klikattaessa
            >
              {room.name} {/* Näytetään huoneen nimi */}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
