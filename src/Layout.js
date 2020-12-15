import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import logo from "./logo.svg"


function Layout({ children, user }) {

  return (
    <div className="flex flex-col items-center bg-gradient-to-tr  from-gray-100 pt-0 to-yellow-50 flex-grow min-h-screen p-12"
    //  {...getRootProps()}
    >

      <div className=" py-4 w-full flex justify-between">
        <Link to="/">
          <img className="w-48" src={logo} />

        </Link>

        <div>
          {user &&
            <>
              {user.role == "admin" && <NavLink className="mr-8" exact activeClassName="font-bold" to="/admin">Admin Panel</NavLink>}
              {user.role == "owner" && <NavLink className="mr-8" exact activeClassName="font-bold" to="/my-restaurants">My restaurants</NavLink>}
              <NavLink className="mr-8" exact activeClassName="font-bold" to="/restaurants">All restaurants</NavLink>
              {user.username} (<Link className="link" to="/logout">log out</Link>)
          </>
          }
        </div>
      </div>

      {children}

    </div>
  );
}

export default Layout;
