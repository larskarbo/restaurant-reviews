import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import logo from "./logo.svg";
import { request } from "./utils/request";
import WideContainer from "./WideContainer";
import StarRatings from "react-star-ratings";
import moment from "moment";

function Restaurant({ children }) {
  const [restaurant, setRestaurant] = useState(null);
  const [updateCount, setUpdateCount] = useState(0);
  const { restaurantId } = useParams();
  const formRef = useRef();

  useEffect(() => {
    request("GET", "/restaurants/" + restaurantId).then((r) => {
      console.log("🚀 ~ r", r);
      setRestaurant(r);
    });
  }, [updateCount]);

  const addReview = (e) => {
    e.preventDefault();
    const rating = formRef.current.rating.value;
    const text = formRef.current.text.value;
    const dateOfVisit = formRef.current.dateOfVisit.value;

    request("POST", "/reviews/add", {
      rating,
      text,
      dateOfVisit,
      restaurant: restaurantId,
    })
      .then((res) => {
        setUpdateCount(updateCount + 1);
        formRef.current.reset();
      })
      .catch((error) => {
        // if (error.message == "Unauthorized") {
        //   setMsg("Wrong username or password, please try again.")
        // } else {
        //   setMsg(error.message)
        // }
      });
  };
  let reviews = restaurant?.reviews
  let highestRated
  let lowestRated
  if (restaurant?.reviews?.length > 2) {
    highestRated = restaurant?.reviews?.reduce((highest, review) => review.rating > highest.rating ? review : highest, { rating: 0 })
    lowestRated = restaurant?.reviews?.reduce((lowest, review) => review.rating < lowest.rating ? review : lowest, { rating: 6 })
    reviews = reviews
      .filter(r => r.id != lowestRated.id)
      .filter(r => r.id != highestRated.id)
  }

  return (
    <WideContainer>
      {restaurant ? (
        <>
          <h1 className="text-6xl font-bold mb-4">{restaurant.name}</h1>

          <div>Average rating: {restaurant.avgRating}/5 ⭐</div>
          <div>{restaurant.description}</div>
          <span className="inline-flex items-center justify-center w-96 h-96">
            <img src={"/" + restaurant.img} className="" />
          </span>

          {highestRated &&
            <>
              <div className="font-medium mt-6 text-xl">Highest rated review</div>

              <div className="bg-white shadow w-full overflow-hidden sm:rounded-md my-3">
                <ul><ReviewLI
                  restaurant={restaurant}
                  r={highestRated}
                  setUpdateCount={setUpdateCount} /></ul>
              </div>
            </>
          }

          {lowestRated &&
            <>
              <div className="font-medium mt-6 text-xl">Lowest rated review</div>

              <div className="bg-white shadow w-full overflow-hidden sm:rounded-md my-3">
                <ul><ReviewLI restaurant={restaurant}
                  r={lowestRated}
                  setUpdateCount={setUpdateCount} /></ul>
              </div>
            </>
          }


          <div className="font-medium mt-6 text-xl">Latest reviews</div>
          <div className="bg-white shadow w-full overflow-hidden sm:rounded-md my-3">
            <ul>
              {reviews
                .map((r) => (
                  <ReviewLI key={r.id} restaurant={restaurant} r={r} setUpdateCount={setUpdateCount} />
                ))}
            </ul>
          </div>

          <div className="mt-4">
            <hr className="my-6" />
            <div className="font-bold">Add review:</div>
            <form ref={formRef} onSubmit={addReview}>
              <div className="flex flex-row">
                <div className="p-2">
                  Stars:
                  <select
                    required
                    name="rating"
                    className="border-gray-300 border rounded-sm"
                  >
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
              <div className="form-group mb-4">
                <label htmlFor="text">Review</label>
                <textarea
                  required
                  name="text"
                  placeholder="How was your stay?"
                  className=""
                ></textarea>
              </div>
              <input
                type="submit"
                value="Add review"
                className="block w-full px-3 py-2 placeholder-gray-400 transition duration-150 ease-in-out border border-gray-300 rounded-md appearance-none focus:outline-none focus:shadow-outline-blue focus:border-blue-300 sm:text-sm sm:leading-5"
              />
            </form>
          </div>
        </>
      ) : (
          "loading"
        )}
    </WideContainer>
  );
}

export default Restaurant;


const ReviewLI = ({ r, restaurant, setUpdateCount }) => {
  const [open, setOpen] = useState(false)
  const [comment, setComment] = useState(r.commentFromOwner)
  const formRef = useRef()

  const addComment = (e) => {
    e.preventDefault();
    const commentFromOwner = formRef.current.commentFromOwner.value;

    request("POST", `/restaurants/${restaurant.id}/${r.id}/addComment`, {
      commentFromOwner
    })
      .then((res) => {
        setUpdateCount(Math.random());
        setOpen(false)
        formRef.current.reset();
      })
      .catch((error) => {
        // if (error.message == "Unauthorized") {
        //   setMsg("Wrong username or password, please try again.")
        // } else {
        //   setMsg(error.message)
        // }
      });
  };

  return (
    <li
      key={r.id}
      className="w-full border-t border-gray-200 p-4
           hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition duration-150 ease-in-out m-0"
    >
      <div className="text-gray-500 flex flex-row mb-4">
        <div className="mr-4">
          {r.rating == 1 && "⭐"}
          {r.rating == 2 && "⭐⭐"}
          {r.rating == 3 && "⭐⭐⭐"}
          {r.rating == 4 && "⭐⭐⭐⭐"}
          {r.rating == 5 && "⭐⭐⭐⭐⭐"}
        </div>
        <div className="mr-4">
          Date of visit:{" "}
          {moment(r.dateOfVisit, "YYYY-MM-DD").format("MMM Do")}
        </div>
        <div>
          Written by {r.user}
        </div>
      </div>
      <div>{r.text}</div>
      {r.commentFromOwner &&
        <div className="p-5">
          <div className="font-bold">Comment from owner:</div>
          {r.commentFromOwner}
        </div>
      }

      {!open &&
        <button onClick={() => { setOpen(true); }} className="cursor-pointer mt-3 py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-700 cursor-default focus:outline-none focus:border-gray-700 focus:shadow-outline-indigo active:bg-gray-700 transition duration-150 ease-in-out">
          {r.commentFromOwner ? "Edit" : "Add"} comment
          </button>
      }
      <form ref={formRef} onSubmit={addComment}>

        {open &&
          <div className="flex flex-col max-w-md">
            <div className="form-group">
              <label htmlFor="commentFromOwner">Review</label>
              <textarea value={comment} onChange={e => setComment(e.target.value)} name="commentFromOwner" placeholder="Your response..." className="border border-gray-400 "></textarea>
            </div>
            <span className="block w-full rounded-md shadow-sm">
              <button
                type="submit"
                className="lars-button"
              >
                Save comment
              </button>
            </span>
          </div>
        }
      </form>
    </li>
  )
}