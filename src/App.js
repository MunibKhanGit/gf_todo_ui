import logo from './logo.svg';
import './App.css';
import Home from "./Pages/Home";
import LoginPage from "./Pages/LoginPage"; 
import RegisterPage from "./Pages/RegisterPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Route, Routes } from 'react-router-dom';

function App() {
  return (
      <>
      <ToastContainer />
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
      </>
  );
}

export default App;