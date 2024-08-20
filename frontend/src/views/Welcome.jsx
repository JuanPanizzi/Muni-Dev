import React from 'react';
import logoMuni from '../assets/escudoMuni.webp';

export const Welcome = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-cv-celeste-oscuro">
      <div className="text-center bg-white w-2/3 rounded-lg p-12 shadow-xl">
        <img src={logoMuni} alt="logo-muni" className="w-24 lg:w-44 mx-auto" />
        <h1 className="text-2xl lg:text-3xl font-bold mb-4 text-red-600 ">BIENVENIDOS</h1>
        <button className='p-3 bg-cv-celeste-oscuro  rounded-lg text-white w-2/3 font-bold mt-5'>COMENZAR</button>
      </div>
    </div>
  );
};
