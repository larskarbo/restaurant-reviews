import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import logo from "./logo.svg"
import { request } from './utils/request';
import WideContainer from './WideContainer';
import StarRatings from "react-star-ratings"
import { Slider } from '@material-ui/core';

const marks = [
  {
    value: 0,
    label: '0',
  },
  {
    value: 1,
    label: '1',
  },
  {
    value: 2,
    label: '2',
  },
  {
    value: 3,
    label: '3',
  },
  {
    value: 4,
    label: '4',
  },
  {
    value: 5,
    label: '5',
  },
];

function valueLabelFormat(value) {
  return marks.findIndex((mark) => mark.value === value) + 1;
}

function Restaurants({ children, ownerView, user }) {
  const [restaurants, setRestaurants] = useState([])
  const [starFilter, setStarFilter] = useState([0, 5])

  useEffect(() => {
    request("GET", ownerView ? "/myRestaurants" : "/restaurants").then(r => {
      console.log("🚀 ~ r", r)
      setRestaurants(r)
    })
  }, [ownerView])

  return (
    <WideContainer>
      <h1 className="text-6xl font-bold mb-4">Restaurants</h1>

      <div className="w-40">
        Filter by rating
      <Slider
          value={starFilter}
          onChange={(e, newV) => setStarFilter(newV)}
          step={1}
          max={5}
          valueLabelDisplay="auto"
          marks={marks}
        />
      </div>

      <div className="bg-white shadow w-full overflow-hidden sm:rounded-md mt-8">

        <ul>
          {restaurants
            .filter(r => r.avgRating >= starFilter[0])
            .filter(r => r.avgRating <= starFilter[1])
            .sort((a, b) => b.avgRating - a.avgRating).map(r =>
              <Link key={r.id} to={"/restaurants/" + r.id}><li className=" w-full border-t border-gray-200 p-4
           hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition duration-150 ease-in-out m-0">
                <div className="flex flex-row">
                  <div className="mr-2">
                    <span className="inline-flex items-center justify-center h-12 w-12  bg-gray-200 mt-1">
                      <img src={"/" +r.img} />
                    </span>
                  </div>
                  <div className="flex flex-grow flex-col">
                    <div className="font-bold ">{r.name}
                    </div>
                    <div className="text-sm">{r.description}
                    </div>

                  </div>
                  <div>
                    {
                      (r.owner == user.username) &&
                      <span className={"px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 "}>
                       {r.reviewsNeedingComment} reviews needing comment!
                      </span>
                    }

                  </div>
                  <div>
                    <span className={"px-2 inline-flex text-xs leading-5 font-semibold rounded-full relative "}>
                      ⭐ {r.avgRating}/5 ({r.numReviews} reviews)
                  </span>

                  </div>
                </div>
              </li>
              </Link>
            )}

        </ul>
      </div>
    </WideContainer>
  );
}

export default Restaurants;
