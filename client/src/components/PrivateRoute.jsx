import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet, Route } from "react-router-dom";

const PrivateRoute = () => {
  const { userData } = useSelector((state) => state.user);
  //如果有currentUser，就顯示Outlet，否則導向/sign-in
  return userData ? <Outlet /> : <Navigate to="/sign-in" replace />;
};

export default PrivateRoute;
