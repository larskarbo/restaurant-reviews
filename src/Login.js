import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import logo from "./logo.svg";
import { request } from "./utils/request";


function Login({ register, onUser }) {

  let history = useHistory();
  let location = useLocation();
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
      console.log("🚀 ~ res", res)
      onUser(res)

        if(res.role == "user"){
          history.push("/restaurants")
        } else if (res.role == "owner"){
          history.push("/my-restaurants")
        } else if (res.role == "admin"){
          history.push("/admin-view")
        } else {
          alert("no role")
        }

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
      onUser(res)
      history.push("/restaurants")
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
        <span className="my-2 text-sm opacity-50">Already got an account? <Link  className="link" to="/login">Login</Link></span>
        :
        <span className="my-2 text-sm opacity-50">No account yet? <Link  className="link" to="/register">Register</Link></span>
      }
    </>
  );
}


const FormElement = ({ label, name, ...inputProps }) => (
  <div className="form-group">
    <label
      htmlFor={name}
      className=""
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
        className=""
      />
    </div>
  </div>
)

export default Login;
