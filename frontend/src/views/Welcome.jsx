import React from 'react';
import logoMuni from '../assets/escudoMuni.webp';
import { useNavigate } from 'react-router-dom';

export const Welcome = () => {

  const navigate = useNavigate()

  return (
    <div className="flex items-center justify-center min-h-screen bg-cv-celeste-oscuro">
      <div className="text-center w-1/3 rounded-lg py-10 px-5">
        <img src={logoMuni} alt="logo-muni" className="w-24 lg:w-44 mx-auto" />
        <h1 className="text-xl lg:text-5xl  mb-4 text-white mt-4 ">¡BIENVENIDOS!</h1>
        <button onClick={()=>navigate('/home')} className='p-3 bg-white lg:text-2xl rounded-lg text-cv-verde-oscuro w-full font-bold mt-5 '>COMENZAR</button>
      </div>
    </div>
  );
};
