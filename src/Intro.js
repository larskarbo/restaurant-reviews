import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import logo from "./logo.svg"


function Intro({ children }) {

  return (
    <div className="flex flex-grow p-12 rounded bg-white  border border-gray-300 shadow-lg ">
      <div>
        <h1 className="text-6xl font-bold mb-4">Welcome to<br /> Restaurant Reviews!</h1>

          To get started, please <Link to="/login">login</Link> or <Link to="/register">register</Link>.
        </div>
    </div>
  );
}

export default Intro;
