import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import logo from "./logo.svg";
import { request } from "./utils/request";


function Login({ register }) {

  const [msg, setMsg] = useState(null)
  useEffect(() => {
    setMsg(null)
  }, [register]);

  const formRef = useRef();

  const login = (e) => {
    e.preventDefault()
    const username = formRef.current.username.value;
    const password = formRef.current.password.value;
    
    request("POST", "/login", {
      username,
      password
    }).then(res => {

    }).catch(error => {
      if (error.message == "Unauthorized") {
        setMsg("Wrong username or password, please try again.")
      } else {
        setMsg(error.message)
      }
    })
  };


  const signup = (e) => {
    e.preventDefault()
    const username = formRef.current.username.value;
    const password = formRef.current.password.value;

    request("POST", "/register", {
      username,
      password
    }).then(res => {

    }).catch(error => {
      if (error.message == "Conflict") {
        setMsg("Username " + username + " already in use.")
      } else {
        setMsg(error.message)
      }
    })
  };

  console.log(msg)
  return (
    <>
      <div className="flex margin-auto self-center w-80 bg-white flex-col p-4 border border-gray-500 rounded max-w-md shadow ">
        <h1 className="text-xl font-bold mb-4">{register ? "Register" : "Log in"}</h1>
        <form ref={formRef} onSubmit={register ? signup : login}>
          <FormElement label="Username" name="username" />
          <FormElement label="Password" name="password" type="password" />
          {msg &&
            <div className="text-sm mt-2 text-red-500 font-medium">
              {msg}
            </div>
          }
          <div className="mt-3">
            <span className="block w-full rounded-md shadow-sm">
              <button
                type="submit"
                className="w-full flex justify-center cursor-pointer py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-700 cursor-default focus:outline-none focus:border-gray-700 focus:shadow-outline-indigo active:bg-gray-700 transition duration-150 ease-in-out"
              >
                {register ? "Register" : "Log in"}
              </button>
            </span>
          </div>
        </form>
      </div>
      {register ?
        <span className="my-2 text-sm opacity-50">Already got an account? <Link to="/login">Login</Link></span>
        :
        <span className="my-2 text-sm opacity-50">No account yet? <Link to="/register">Register</Link></span>
      }
    </>
  );
}


const FormElement = ({ label, name, ...inputProps }) => (
  <>
    <label
      htmlFor={name}
      className="block text-sm font-medium leading-5 text-gray-700 mt-3"
    >
      {label}
    </label>
    <div className="mt-1 rounded-md shadow-sm">
      <input
        id={name}
        type="text"
        tabIndex="1"
        name={name}
        // placeholder=""
        required=""
        {...inputProps}
        className="block w-full px-3 py-2 placeholder-gray-400 transition duration-150 ease-in-out border border-gray-300 rounded-md appearance-none focus:outline-none focus:shadow-outline-blue focus:border-blue-300 sm:text-sm sm:leading-5"
      />
    </div>
  </>
)

export default Login;
