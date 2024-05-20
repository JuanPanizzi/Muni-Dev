import React, { useEffect, useState } from 'react'
import io from 'socket.io-client'
import { Tramites } from './Tramites';
import '../styles/Home.css'
import printJS from 'print-js';


const socket = io('/');


export const Home = () => {


  const [showTramites, setShowTramites] = useState(false)

  //preuba re-render
  // let valorRef = useRef(0)
  // valorRef.current++
  // console.log(`render numero: ${valorRef}`)

  const [dni, setDni] = useState(null)

  const [numeroTurno, setNumeroTurno] = useState(() => {
    // Intentar obtener el número de turno del Local Storage al inicializar el estado
    const storedNumeroTurno = localStorage.getItem('numeroTurno');
    return storedNumeroTurno ? parseInt(storedNumeroTurno) : 1;
  });

  const [turnoDniReceived, setTurnoDniReceived] = useState(null)



  const handleSubmit = (e) => {

    e.preventDefault();
    //cuando se hace un submit, en la funcion sendDni de abajo se envia el documento al websocket (con el numero de turno asociado) y se aumenta el state numeroTurno, y eso dispara el useEffect de abajo que lo que hace es guardar en el local storage el nuevo numero de turno
    sendDni(dni, numeroTurno)
    // console.log(`este es el dni que se le pasa a la funcion sendDni: ${dni}, y este es el nrode turno ${numeroTurno}`)
    setShowTramites(true)
  }

  const sendDni = (documento, nroTurno) => {

    documento == null ?
      alert('no se puede enviar un dni vacio') :

      socket.emit('sendDni', { dni: documento, nroTurno });

    //Aca se recibe lo que se manda para chequear que eso llegó
    socket.on('respuestaDni', (turnoDniResponse) => {

      console.log('LLEGO EL TURNO DNI')

      const { dni: dniRecibido, nroTurno: nroTurnoRecibido } = turnoDniResponse;

      setTurnoDniReceived(turnoDniResponse)
      // handlePrintTurnoDni()
    })

    setNumeroTurno((prevNumeroTurno) => prevNumeroTurno + 1); // Incrementar el número de turno para el siguiente usuario;

  }
  const handlePrintTurnoDni = () => {
    printJS({ printable: 'turnoDniToPrint', type: 'html', font_size: '90pt' });
  }

  const handleChange = (e) => {
    setDni(e.target.value)
  }

  // REVISAR REVISAR REVISAR REVISAR REVISAR REVISAR REVISAR REVISAR REVISAR REVISAR REVISAR REVISAR 
  // ¿PORQUE ESTOY SUSCRITO A ESTE sendAllDni?
  useEffect(() => {
    // Suscribirse al evento 'sendAllDnis' cuando el componente se monta
    socket.on('sendAllDnis', (data) => {
      // console.log('abajo llegan los documentos')
      // console.log(data)
    })

    // Retornar una función para limpiar la suscripción cuando el componente se desmonte
    return () => {
      socket.off('sendAllDnis');
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('numeroTurno', numeroTurno.toString());
    // console.log(`se actualizo el numeto de turno, y es este ahora: ${numeroTurno}`)

  }, [numeroTurno]);


  //   if(showTramites){
  //     return (<>
  //  <Tramites/>
  //     </>)
  //   }

  return (
    <>
{
  !showTramites ? 
      <div className='ctnSistema'>

        <h1 className='title'>SISTEMA DE TURNOS </h1>

        <form action="#" method="post" onSubmit={handleSubmit}>
          <label htmlFor="InputDni" style={{ display: "block", fontWeight: "bold", fontSize: "1.2rem", marginTop: "50px" }}>Ingrese su DNI:</label>
          <input type="number" id="InputDni" name="dni" style={{ display: "block" }} required onChange={(e) => handleChange(e)} />
          <button type="submit" className='btnHome' >Enviar</button>
        </form>
   {/* <button onClick={()=>setShowTramites(false)}>Reset show tramites</button> */}

      </div>
  :
  <>

  <Tramites handlePrintTurnoDni={handlePrintTurnoDni}/>
  {/* <button onClick={()=>setShowTramites(false)}>Reset show tramites</button> */}

</>
}

      {
        turnoDniReceived !== null && <h1 id='turnoDniToPrint' style={{ color: 'blue', textAlign: "center"}} >TURNO: {turnoDniReceived.nroTurno} - DNI: {turnoDniReceived.dni}</h1>
      }

      {/* <h4>Dni que se esta enviando: {dni}</h4> */}
      {/* <h3>Numero de turno que se le asignara a la proxima persona que ponga un dni: {numeroTurno}</h3> */}
   
      {/* <button onClick={()=>setShowTramites(false)}>Reset show tramites</button> */}
      {/* {
  nroTurno > 0 && dni !== null &&
      <h1 id='turnoDniToPrint'>TURNO: {nroTurno} - DNI: {dni}</h1>
 } */}
    </>
  )
}
