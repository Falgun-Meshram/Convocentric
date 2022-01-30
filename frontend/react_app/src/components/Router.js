import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import App from './App';
import Signin from './Signin';
import SignUp from './Signup';
import NotFound from './NotFound';

const Router = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/chat" element={<App />} />
      <Route path="/" element={<Signin />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/signin" element={<Signin />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);
export default Router;

