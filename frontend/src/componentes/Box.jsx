import React, { useState } from 'react'
import { useParams } from 'react-router-dom';
import '../styles/Box.css'
import io from 'socket.io-client'


const socket = io('/');

export const Box = () => {


  const { BoxId } = useParams();

  const [lastClick, setLastClick] = useState(0);
  const [showWarning, setShowWarning] = useState(false);

  const nextUser = () => {
    socket.emit('nextUser', { mensaje: 'next', box: BoxId });
  }

  const handleClick = () => {

    const now = Date.now();
    console.log(now)

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
      <div className='ctnBox'>
        <h1>Box {BoxId}</h1>
        {/* <h3>Proximo usuario:</h3> */}
        {/* <button onClick={()=> nextUser()} className='btnBox'>Proximo Usuario</button> */}
        <button onClick={handleClick} className='btnBox'>Proximo Usuario</button>
        {showWarning && (
        <div className="warning">
          <p>Has llamado un usuario recientemente ¿Desea llamar al próximo?</p>
          <button onClick={handleAccept}>Aceptar</button>
          <button onClick={handleCancel}>Cancelar</button>
        </div>
      )}

      </div>

    </>
  )
}
