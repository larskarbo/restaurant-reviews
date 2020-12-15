import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { request } from "./utils/request";
import WideContainer from "./WideContainer";
import { Slider } from "@material-ui/core";
import {
  FaCheck,
  FaCopy,
  FaDownload,
  FaEdit,
  FaLink,
  FaLock,
  FaTrash,
  FaUpload,
} from "react-icons/fa";

function Restaurants({ children, ownerView, user }) {
  const [users, setUsers] = useState([]);
  const [update, setUpdate] = useState(0);

  useEffect(() => {
    console.log("Hi")
    request("GET", "/users/all").then(({ users }) => {
      setUsers(users);
    });
  }, [ownerView, update]);

  return (
    <WideContainer>
      <h1 className="text-6xl font-bold mb-4">User management</h1>

      <div className="bg-white shadow w-full overflow-hidden sm:rounded-md mt-8">
        <ul>
          <li
            className=" w-full border-t border-gray-200 p-4
           hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition duration-150 ease-in-out m-0"
          >
            <div className="flex font-bold  flex-row">
              <div className="w-24">
                <span className={""}>Role</span>
              </div>
              <div className="w-28">Username</div>
              <div className="w-28">Restaurants</div>
              <div className="w-28">Reviews</div>
              <div className="">Actions</div>
              <div></div>
              <div></div>
            </div>
          </li>
          {users
            .sort((a, b) => {
              if (a.role < b.role) {
                return -1;
              }
              if (a.role > b.role) {
                return 1;
              }
              return 0;
            })
            .map((u) => (
              <li
                key={u.username}
                className=" w-full border-t border-gray-200 p-4
           hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition duration-150 ease-in-out m-0"
              >
                <div className="flex flex-row">
                  <div className="w-24">
                    <span
                      className={
                        "px-2 inline-flex text-xs leading-5 font-semibold rounded-full " +
                        (u.role == "user" && " bg-blue-100 text-blue-800 ") +
                        (u.role == "owner" &&
                          " bg-yellow-100 text-yellow-800 ") +
                        (u.role == "admin" &&
                          " bg-green-100 text-bg-green-800 ")
                      }
                    >
                      {u.role}
                    </span>
                  </div>
                  <div className="w-28">{u.username}</div>
                  <div className="w-28">{u.restaurants}</div>
                  <div className="w-28">{u.reviews}</div>
                  <div className="flex flex-row">
                    {u.role != "admin" && (
                      <button
                        onClick={() => {
                          const sure = window.confirm("Are you sure?");
                          if (sure) {
                            request("POST", "/users/deleteUser", {
                              username: u.username,
                            }).then(() => {
                              setUpdate(Math.random())

                            })
                          }
                        }}
                        className="mb-4 mr-4 focus:outline-none rounded-3xl flex flex-row items-center justify-center text-xs py-1 px-4 bg-blue-50 hover:bg-gray-200 transition duration-150"
                      >
                        <FaTrash size={10} className="text-gray-500 mr-1" />{" "}
                        Delete user
                      </button>
                    )}
                    <button
                      onClick={() => {
                        const newPassword = prompt("New password");
                        request("POST", "/users/changePassword", {
                          username: u.username,
                          password: newPassword,
                        })
                      }}
                      className="mb-4 mr-4 focus:outline-none rounded-3xl flex flex-row items-center justify-center text-xs py-1 px-4 bg-blue-50 hover:bg-gray-200 transition duration-150"
                    >
                      <FaEdit size={10} className="text-gray-500 mr-1" /> Change
                      password
                    </button>
                  </div>
                </div>
              </li>
            ))}
        </ul>
      </div>
    </WideContainer>
  );
}

export default Restaurants;
