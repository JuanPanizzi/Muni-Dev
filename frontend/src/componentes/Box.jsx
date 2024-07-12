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
  const [serverConnectionError, setServerConnectionError] = useState(false)
  const [statusChangedUser, setStatusChangedUser] = useState('')
  const [incomingUser, setIncomingUser] = useState(null)
  const [noMoreUsers, setnoMoreUsers] = useState(true)
  const [operationReloadPantalla, setOperationReloadPantalla] = useState('')

  const nextUser = () => {

    //MECANISMO DE VERIFICACION DE RECEPCION DE MENSAJES: 
    //Funciona igual que la verificacion que se hace desde hometeclado a pantalla. Aca lo que se hace es primero esperar 10s que el servidor responda. Sino responde en 10s se emite error. Si responde, se espera la respuesta en el evento 'responseChangedUser' de mas abajo.
    socket.timeout(10000).emit('nextUser', { mensaje: 'next', box: BoxId }, (err, res) => {
      if (err) {
        console.log('Entro en error')
        setServerConnectionError(true)
      } else {
        if (serverConnectionError) {
          setServerConnectionError(false)
          console.log(res)
          // --> {serverMessage: "Servidor respondiendo a tiempo"}
        }
      }

    });
   
    //Aca el Box escucha el evento 'responseChangedUser' que emite el servidor con el status del proceso de llamar a un nuevo usuario.
    socket.once('responseChangedUser', status => {

      const {changedUserStatus, nextUser} = status;
      //resFromServer es la respuesta del servidor sobre el status del proceso de llamar a un nuevo usuario;
      switch (changedUserStatus) {
        case 'se cambio-llamo el usuario correctamente':

          if(noMoreUsers){
            setnoMoreUsers(false)
          }
          setStatusChangedUser('se cambio-llamo el usuario correctamente');
          setIncomingUser(nextUser)
          // setIncomingUser(proximoUser)
          // console.log('ESTE ES EL USUARIO QUE ESTA LLAMANDO ESTE BOX. VER SI COINCIDE CON EL QUE APARECE EN PANTALLA')
          // console.log(proximoUser)
          break;
        case 'No hay mas usuarios para llamar':

          // setStatusChangedUser('No hay mas usuarios para llamar')
          setnoMoreUsers(true)
          break;
        case 'Error al llamar usuario. Compruebe la url de su dispositivo o su conexión a internet e intente nuevamente':

          setStatusChangedUser('Error al llamar usuario. Compruebe la url de su dispositivo o su conexión a internet e intente nuevamente')
          break;

        default:
          break;
      }
    })


  }

  const reloadPanalla = () => {

    socket.timeout(10000).emit('reloadPantalla', "reloadPantallaMessage", (err, res)=>{

      if(err){
        console.log('La pantalla no respondió al evento reloadPantalla')
        setServerConnectionError(true)
      }else{
        console.log('la pantalla respondio al evento reload')
        setOperationReloadPantalla(true)
      }

    })

    socket.once('statusPantallaReloaded', statusReload =>{

      // const {statusPantallaRelaoaded} = statusReload
      console.log("statusReload")
      console.log(statusReload)

      if(statusPantallaRelaoaded == "Pantalla recargada correctamente") setOperationReloadPantalla('Pantalla recargada correctamente')
      
        if(statusPantallaRelaoaded == "Pantalla no se recargó") setOperationReloadPantalla("Pantalla no se recargó")

    } )


  }
  const handleClick = () => {

    if (serverConnectionError) {
      setServerConnectionError(false)
    }

    if (statusChangedUser) {
      setStatusChangedUser('')
    }

    const now = Date.now();

    if (now - lastClick < 10000) {
      console.log(`Now: ${now} - LastClick: ${lastClick} = ${now - lastClick}`)
      setShowWarning(true)
    } else {
      console.log('Se ejecuto el next user');
      setLastClick(now);
      nextUser();
    }
  }


  const handleAccept = () => {
    if (serverConnectionError) {
      setServerConnectionError(false)
    }
    if (statusChangedUser) {
      setStatusChangedUser('')
    }
    setShowWarning(false);
    setLastClick(Date.now());
    nextUser();
  };

  const handleCancel = () => {
    setShowWarning(false);
  };



  return (

    <>
      <Navbar2 />
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
      <div className=' bg-cv-celeste-claro  rounded-xl p-3 w-2/3 m-auto mt-5'>

      {
        serverConnectionError && <h1 className=' text-4xl bg- text-center mt-2'>NO SE PUDO CONECTAR CON EL SERVIDOR <br /> INTENTE NUEVAMENTE</h1>
      }
      {
        statusChangedUser && <h1  className=' text-4xl bg- text-center mt-2'>{statusChangedUser}</h1>
      }
        {
          noMoreUsers && <h1 className=' text-4xl bg- text-center mt-2'>No hay más usuarios para llamar</h1>
        }
      {
        incomingUser && !noMoreUsers && <h1  className=' text-4xl bg- text-center mt-2'>Usuario entrante: {incomingUser}</h1>
      }
      {operationReloadPantalla && (
  <>
  <div>
    <h1 className="text-4xl bg-gray-200 text-center mt-2">{operationReloadPantalla}</h1>
    <div>
    <button onClick={()=>setOperationReloadPantalla(false)}>OK</button>
    </div>

  </div>
  </>
)}
      </div>
  <button onClick={reloadPanalla} className='bg-red-300 rounded p-3'>RECARGAR PANTALLA</button>
    </>
  )
}
