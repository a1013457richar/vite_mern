import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInStart, signInSuccess, signInFail } from "../redux/use/userSlice";
import { useDispatch, useSelector } from "react-redux";
import Oauth from "../components/Oauth";
const Signin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [userData, setuserData] = useState({});
  //這邊就是把redux的state拿出來用，然後是取名為user
  const { loading, error } = useSelector((state) => state.user);
  const handleChange = (e) => {
    setuserData({ ...userData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    //prevent default behavior of form
    e.preventDefault();
    try {
      dispatch(signInStart());
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
      const data = await response.json();
      console.log("🚀 ~ handleSubmit ~ data:", data)
      

      if (data.success === false) {
        dispatch(signInFail(data));
        return;
      }
      dispatch(signInSuccess(data));
      navigate('/');
    } catch (err) {
      dispatch(signInFail(err));
      
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign In</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          id="email"
          className="bg-slate-100 p-3 rounded-lg"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="Password"
          id="password"
          className="bg-slate-100 p-3 rounded-lg"
          onChange={handleChange}
        />
        <button
          disabled={loading}
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "Loading..." : "Sign in"}
        
        </button>
        <Oauth />
      </form>
      <div className="flex gap-2 mt-5">
        <p>Dont have an account? </p>
        <Link to="/sign-up">
          <span className="text-blue-500">Sign up</span>
        </Link>
      </div>
      <p className="text-red-700 mt-5">
        {error ? error.error||"Something went wrong.":""}
      </p>
    </div>
  );
};

export default Signin;
