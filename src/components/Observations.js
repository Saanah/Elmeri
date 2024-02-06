import './Observations.css';
import Observation from './Observation';
import React from 'react'

export default function Observations({observations,saveInOrder,addException,saveException}) { 
  return (
    <>
      {
        observations.map((observation,ob_index) =>(
          <div className="observation" key={ob_index} value={ob_index}>
            <Observation
              observation={observation} 
              ob_index ={ob_index}
              saveInOrder={saveInOrder}
              saveException={saveException}
            /> 
            <button id="button" onClick={() => addException(ob_index)}>Lisää Poikkeama</button>
          </div>
        ))
      }
    </> 
  )
}
