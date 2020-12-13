import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import logo from "./logo.svg"
import { request } from './utils/request';
import WideContainer from './WideContainer';
import StarRatings from "react-star-ratings"
import moment from 'moment';


function Restaurant({ children }) {
  const [restaurant, setRestaurant] = useState(null)
  const [updateCount, setUpdateCount] = useState(0)
  const { restaurantId } = useParams()
  const formRef = useRef();

  useEffect(() => {
    request("GET", "/restaurants/" + restaurantId).then(r => {
      console.log("🚀 ~ r", r)
      setRestaurant(r)
    })
  }, [updateCount])

  const addReview = (e) => {
    e.preventDefault()
    const rating = formRef.current.rating.value;
    const text = formRef.current.text.value;
    const dateOfVisit = formRef.current.dateOfVisit.value;


    
    request("POST", "/reviews/add", {
      rating,
      text,
      dateOfVisit,
      restaurant: restaurantId
    }).then(res => {
      setUpdateCount(updateCount + 1)
      formRef.current.reset()
    }).catch(error => {
      // if (error.message == "Unauthorized") {
      //   setMsg("Wrong username or password, please try again.")
      // } else {
      //   setMsg(error.message)
      // }
    })
  }

  return (
    <WideContainer>
      {restaurant ?
        <>
          <h1 className="text-6xl font-bold mb-4">{restaurant.name}</h1>

          <div>Average rating: {restaurant.avgRating}/5 ⭐</div>
          <div>{restaurant.description}</div>

          <input type="sli" />
          <div className="bg-white shadow w-full overflow-hidden sm:rounded-md mt-8">
            <ul>
              {restaurant.reviews.map(r => (
                <li key={r.id} className="w-full border-t border-gray-200 p-4
           hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition duration-150 ease-in-out m-0">

                  <div>

                    {r.rating == 1 && "⭐"}
                    {r.rating == 2 && "⭐⭐"}
                    {r.rating == 3 && "⭐⭐⭐"}
                    {r.rating == 4 && "⭐⭐⭐⭐"}
                    {r.rating == 5 && "⭐⭐⭐⭐⭐"}

             Date of visit: {moment(r.dateOfVisit, "YYYY-MM-DD").format('MMM Do')}

             Written by {r.user}
                  </div>
                  <div>

                    {r.text}
                  </div>

                </li>

              ))
              }

            </ul>

          </div>

          <div className="mt-4">
            <hr className="my-6" />
            <div className="font-bold">Add review:</div>
            <form ref={formRef} onSubmit={addReview}>
              <div className="flex flex-row">
              <div className="p-2">Stars:
              <select required name="rating" className="border-gray-300 border rounded-sm">
                <option value={1}>⭐</option>
                <option value={2}>⭐⭐</option>
                <option value={3}>⭐⭐⭐</option>
                <option value={4}>⭐⭐⭐⭐</option>
                <option value={5}>⭐⭐⭐⭐⭐</option>
              </select>
              </div>
              <div className="p-2">
              <input required type="date" name="dateOfVisit" />
              </div>

              </div>
              <textarea required name="text" placeholder="How was your stay?" className="mb-4 block w-full px-3 py-2 placeholder-gray-400 transition duration-150 ease-in-out border border-gray-300 rounded-md appearance-none focus:outline-none focus:shadow-outline-blue focus:border-blue-300 sm:text-sm sm:leading-5"></textarea>
              <input type="submit" value="Add review" className="block w-full px-3 py-2 placeholder-gray-400 transition duration-150 ease-in-out border border-gray-300 rounded-md appearance-none focus:outline-none focus:shadow-outline-blue focus:border-blue-300 sm:text-sm sm:leading-5" />
            </form>
          </div>

        </> :
        "loading"
      }
    </WideContainer>
  );
}

export default Restaurant;
