import { useEffect, useRef, useState } from 'react'
import '../styles/Pantalla.css'
import io from 'socket.io-client'
import { ToPrint } from './ToPrint';
import print from 'print-js'  
import printJS from 'print-js';

const socket = io('/');

export const Pantalla = () => {

  const [turnoDni, setTurnoDni] = useState([])
  const [indiceDni, setIndiceDni] = useState(0);
  const [mesaDeEntradas, setMesaDeEntradas] = useState(null)
  const [showWarn, setShowWarn] = useState(false)
  const [showUsers, setShowUsers] = useState(false)
  const indiceDniRef = useRef(indiceDni)
  const turnoDniRef = useRef(turnoDni)


  const updateIndiceAndMesa = (data) => {
    //data = {mensaje: 'next user please', box} y viene de subscribe message 'nextUser' del queueGateway
    //update indiceDni && mesaDeEntradas
    const { box } = data;

    if (indiceDniRef.current == turnoDniRef.current.length - 1) {
      console.log(`se retorna antes, este es el indiceDniRef: ${indiceDniRef.current} y este turnodniref.lenght: ${turnoDniRef.current.length}`)
      setShowWarn(true)
      return
    }

    if (indiceDniRef.current == 0) {
      console.log('entro en indicedniref.current = 0')
      setMesaDeEntradas(box)
      indiceDniRef.current++
    } else {
      console.log(`entro en updateIndiceMesa, este es el indiceDni: ${indiceDniRef.current}`)
      setIndiceDni((prevIndice) => prevIndice + 1)
      if (indiceDniRef.current !== 1) {
        indiceDniRef.current++
      }
      setMesaDeEntradas(box)
      if (showWarn) {
        setShowWarn(false)
      }
    }

  }






  useEffect(() => {

    socket.emit('joinPantallaRoom');

    // Suscribirse al evento 'sendAllDnis' cuando el componente se monta
    socket.on('sendAllDnis', (arryUsers) => {
      //arryUsers = [{dni: '221', nroTurno: 3}, {dni: '211', nroTurno: 5}]
      setTurnoDni(arryUsers)
      if (!showUsers) {
        setShowUsers(true)
      }
      console.log(`en sendAllDnis turnoDni: ${turnoDni}`)
      console.log(turnoDni)
    })

    socket.on('changeNextUser', updateIndiceAndMesa)
    //data = {mensaje: 'next user please', box} y viene de subscribe message 'nextUser' del queueGateway

    // setIndiceDni(prevIndice => {

    //   if(indiceDni == turnoDni.length-1){
    //     return prevIndice
    //   }else{
    //     setMesaDeEntradas(box)
    //     return prevIndice + 1;
    //   }

    // })



    // Retornar una función para limpiar la suscripción cuando el componente se desmonte
    return () => {
      socket.off('sendAllDnis');
      socket.off('changeNextUser')
      // socket.emit('leavePantallaRoom');

    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // Actualiza la referencia de indiceDniRef cada vez que indiceDni cambie
  useEffect(() => {
    indiceDniRef.current = indiceDni;
    turnoDniRef.current = turnoDni
  }, [indiceDni, turnoDni]);


  const resetUsers = () => {
    //esto llega al qeueGateway, se resetea el array de usuarios, y de ahi se envia a Pantalla.jsx de nuevo (pa enviar la lista de usuarios vacía)
    socket.emit('resetUsers', 'reset-lista-de-espera')
    localStorage.setItem('numeroTurno', '1');
    setShowWarn(false)
  }

  const configuracion = {
    silent: true,
  };
  
  // const handleImprimir = () => {
  //   printJS({printable:'miComponenteId', type:'html', configuracion });
  // };

  return (
    <>
      <div className='ctnPantalla'>
        <h1>PANTALLA CENTRAL</h1>

        {
          turnoDni.length > 0 && mesaDeEntradas !== null && turnoDni[indiceDni].nroTurno &&
          <>
            <h1 id='turnoDnitoPrint'>TURNO: {turnoDni[indiceDni].nroTurno}  - DNI: {turnoDni[indiceDni].dni}</h1>
            <h2>Pasar por la mesa de entradas numero: {mesaDeEntradas}</h2>
          </>
        }
        {/* INICIO REFERENCIAS */}
        {/* {
          turnoDni.length > 0 ?
            <> */}
        {/* <h1>TURNO: {turnoDni[indiceDni].nroTurno}  - DNI: {turnoDni[indiceDni].dni}</h1> */}
        {/* 
              <h3>IndiceDni: {indiceDni}</h3>
              <h3>indiceDniRef: {indiceDniRef.current}</h3>
              <h3>TurnoDni.length: {turnoDni.length}</h3>
              <h3>TurnoDniRef.length: {turnoDniRef.current.length}</h3>

            </> */}
        {/* :
            <h3>TURNO:  - DNI: </h3>
        } */}
        {/* FIN REFERENCIAS */}

      </div>
      <div className='listaEspera'>
        <h4>Lista de espera</h4>
        {
          turnoDni.map(({ dni, nroTurno }, index) => {

            if (dni || nroTurno) {
              return <h4 key={index}>Turno: {nroTurno} - DNI: {dni}</h4>
            }

          })
        }

      </div>
      {/* <h4>Mensaje: </h4> */}
      <button className='btn-reset-users' onClick={() => resetUsers()}>Reiniciar lista de espera</button>

      {showWarn && <h1>NO HAY MAS USUARIOS</h1>}

      {/* <div> */}
        {/* <ToPrint /> */}
        {/* <button onClick={handleImprimir}>Imprimir</button> */}
      {/* </div> */}
    </>
  )
}
