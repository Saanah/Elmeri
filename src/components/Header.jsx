// Header.js
import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <div className="Header">
      <p><Link to="/">Elmeri</Link></p>
    </div>
  );
};

export default Header;