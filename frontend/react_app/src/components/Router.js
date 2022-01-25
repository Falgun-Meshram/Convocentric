import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import App from './App';
import Login from './Login';
import SignUp from './Signup';
import NotFound from './NotFound';

const Router = () => (
  <BrowserRouter>
    <Routes>
        <Route path="/chat" element={<App/>} />
        <Route path="/" element={<Login/>} />
        <Route path="/signup" element={<SignUp/>} />
        <Route path="*" element={<NotFound/>} />
    </Routes>
  </BrowserRouter>
);
export default Router;

