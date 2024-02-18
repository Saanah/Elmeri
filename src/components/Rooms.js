import './Rooms.css';
import React, { useState, useEffect } from 'react';

export default function Rooms({rooms,selectedRoomIndex,setSelectedRoomIndex}) {

  const [tila, setTila] = useState('');
  const switchRoom = (index) => {
    setSelectedRoomIndex(index)
  }


  useEffect(() => {
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

  return (
    <div>
      
      <ul className="room-list">
        {rooms.map((room, index) => (
          <li key={room.name}>
            <button
              className={selectedRoomIndex === index ? "selected" : ""}
              id="button2"
              type="button"
              onClick={() => switchRoom(index)}
            >
              {room.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
