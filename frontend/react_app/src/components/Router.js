import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import App from './App';
import Signin from './Signin';
import SignUp from './Signup';
import NotFound from './NotFound';
import ProfilePage from './Profile';
import Home from './Home';
import ProtectedRoutes from "./ProtectedRoutes";

export default function Router() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Signin />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<Signin />} />
        <Route element={<ProtectedRoutes />}>
          <Route path="/home" element={<Home />} />
          <Route path="/chat" element={<App />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )

}

