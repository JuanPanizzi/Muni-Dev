import React, { useState } from 'react'
import { useParams } from 'react-router-dom';
import '../styles/Box.css'
import io from 'socket.io-client'
import { Navbar2 } from './Navbar2';


const socket = io('https://municipalidad-rawson-server.onrender.com');
// const socket = io('/');


export const Box = () => {


  const { BoxId } = useParams();

  const [lastClick, setLastClick] = useState(0);
  const [showWarning, setShowWarning] = useState(false);

  const nextUser = () => {
    socket.emit('nextUser', { mensaje: 'next', box: BoxId });
  }

  const handleClick = () => {

    const now = Date.now();

    if (now - lastClick < 10000) {
      console.log(`Now: ${now} - LastClick: ${lastClick} = ${now - lastClick}`)
      setShowWarning(true)
    }else{
      console.log('Se ejecuto el next user');
      setLastClick(now);
      nextUser();
    }
  }


  const handleAccept = () => {
    setShowWarning(false);
    setLastClick(Date.now());
    nextUser();
  };

  const handleCancel = () => {
    setShowWarning(false);
  };



  return (

    <>
      <Navbar2/>
      <div className='bg-cv-verde-oscuro w-2/3 m-auto rounded-xl mt-16 p-5 text-center'>
        <h1 className='text-5xl bg-cv-celeste-claro  rounded-xl p-3 w-2/3 m-auto '>BOX {BoxId}</h1>
        {/* <h3>Proximo usuario:</h3> */}
        {/* <button onClick={()=> nextUser()} className='btnBox'>Proximo Usuario</button> */}
        <button onClick={handleClick} className='mt-10 p-5 bg-green-600 text-white rounded-xl hover:bg-green-500 '>PROXIMO USUARIO</button>
        {showWarning && (
        <div className="mt-7">
          <p className='text-white text-xl mb-5'>Ya has llamado a un usuario recientemente ¿Deseas llamar al próximo?</p>
          <button onClick={handleCancel} className='bg-red-600 hover:bg-red-500 px-5 py-2 rounded-xl  mr-2 '>Cancelar</button>
          <button onClick={handleAccept} className='bg-green-600 hover:bg-green-500 px-5 py-2 rounded-xl '>Aceptar</button>
        </div>
      )}

      </div>

    </>
  )
}
