import React from 'react';
import {AiOutlineHome} from "react-icons/ai";
import { Link } from 'react-router-dom';

export default function Ohjeet() {
  const elmeriGuideFilePath = process.env.PUBLIC_URL + '/ElmeriGuide.pdf';
  return (
    <div>
      <div className="Header">
        <p>Ohjeet</p>
        <Link to="/">
         <AiOutlineHome size={26} style={{marginTop: '30%'}}/>
        </Link>
      </div>
      <div className='Ohjeet'>
        <iframe
          title="Elmeri Guide"
          src={elmeriGuideFilePath}
          style={{ width: '100%', height: '100%' }}
        ></iframe>
      </div>
    </div>
  );
}
