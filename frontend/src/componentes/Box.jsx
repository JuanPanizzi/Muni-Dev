import React from 'react'
import { useParams } from 'react-router-dom';
import '../styles/Box.css'
import io from 'socket.io-client'


const socket = io('https://municipalidad-rawson-server.onrender.com');

export const Box = () => {

  const { BoxId } = useParams(); 
// console.log('abajo numero de box')
  // console.log(BoxId)
  const nextUser = () =>{
  
    socket.emit('nextUser', {mensaje: 'next', box: BoxId })
  
  } 



  return (

    <>
    <div className='ctnBox'>
    <h1>Box {BoxId}</h1>
    {/* <h3>Proximo usuario:</h3> */}
    <button onClick={()=> nextUser()} className='btnBox'>Proximo Usuario</button>
    </div>

    </>
  )
}
