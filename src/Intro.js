import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import logo from "./logo.svg"
import WideContainer from './WideContainer';


function Intro({ children, user }) {

  return (
    <WideContainer>
      <h1 className="text-6xl font-bold mb-4">Welcome to<br /> Restaurant Reviews!</h1>

      {user ?
        <div>
          Go and browse all <Link className="link" to="/restaurants">restaurants</Link>!
</div>
        :
        <div>
          To get started, please <Link className="link" to="/login">login</Link> or <Link className="link" to="/register">register</Link>.
        </div>
      }
    </WideContainer>
  );
}

export default Intro;
