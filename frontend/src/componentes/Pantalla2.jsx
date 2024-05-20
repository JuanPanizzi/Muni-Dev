import  { useEffect, useState } from 'react'
import '../styles/Pantalla.css'
import io from 'socket.io-client'
const socket = io('https://municipalidad-rawson-server.onrender.com');

export const Pantalla2 = () => {

  const [turnoDni, setTurnoDni] = useState([])
  const [indiceDni, setIndiceDni] = useState(0);
  const [mesaDeEntradas, setMesaDeEntradas] = useState(null)
  const [prueba, setPrueba] = useState(false)
  // const mostrarProximoUsuario = (box) => {
  //     // Incrementa el índice para obtener el próximo DNI
  // if(indiceDni == 0 || indiceDni < turnoDni.length && indiceDni !== turnoDni.length -1){
  // // console.log(`entro el setIndice, este es el indice: ${indiceDni}`)
  // // console.log(`indiceDni: ${indiceDni}`)
  // // console.log(`turnoDni.length: ${turnoDni.length}`)

  // setIndiceDni((prevIndice)=> prevIndice + 1);
  // setMesaDeEntradas(box)

  // }else{
  //   console.log(`se excedio el indice, este es el indice actual: ${indiceDni}`)
  //   console.log(`turnoDni.length: ${turnoDni.length}`)
  //   return
  // }

  //   };


  useEffect(() => {



    socket.emit('joinPantallaRoom');

    // Suscribirse al evento 'sendAllDnis' cuando el componente se monta
    socket.on('sendAllDnis', (data) => {
      //data = [{dni: '221', nroTurno: 3}, {dni: '211', nroTurno: 5}]
      console.log('abajo array turnoDnis que llegan desde el array actualizado')
      // console.log(data)
      // setTurnoDni(data)
      setTurnoDni(data)


    })

    //Acá se reciben los dnis desde el qeueGateway
    socket.on('changeNextUser', (data) => {
      //data = {mensaje: 'next user please', box} y viene de subscribe message 'nextUser' del queueGateway
      const { box } = data;
      console.log('se intenta cambiar un user')
      console.log(data) //'next user please'

      console.log(`dentro del use-effect indiceDni: ${indiceDni}`)
      console.log(`dentro del use-effect. Turnodni.lenght: ${turnoDni.length}`)

      setPrueba(!prueba)

      setIndiceDni(prevIndice => {

        if(indiceDni == turnoDni.length-1){
          console.log(indiceDni)
          // console.log(`dentro del use-effect indiceDni: ${indiceDni}`)
          // console.log(`dentro del use-effect. Turnodni.lenght: ${turnoDni.length}`)

          return prevIndice
        }else{
          console.log('se aumenta indice')
          console.log(`indiceDni abajo: ${indiceDni}`)
          setMesaDeEntradas(box)
          return prevIndice + 1;
        }
        // if (indiceDni == 0 || indiceDni < turnoDni.length && indiceDni !== turnoDni.length - 1) {
        //   console.log(`entro el setIndiceDni, este es el indice: ${indiceDni}`)
        //   console.log(`indiceDni: ${indiceDni}`)
        //   console.log(`turnoDni.length: ${turnoDni.length}`)
        //   // setIndiceDni((prevIndice) => prevIndice + 1);
        //   setMesaDeEntradas(box)
        //   return prevIndice + 1;
        // } else {
        //   console.log(`se excedio el indice, este es el indice actual: ${indiceDni}`)
        //   console.log(`turnoDni.length: ${turnoDni.length}`)
        //   return 

        // }
      })
    
    })

    // Retornar una función para limpiar la suscripción cuando el componente se desmonte
    return () => {
      socket.off('sendAllDnis');
      socket.off('changeNextUser')
      // socket.emit('leavePantallaRoom');

    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log(`fuera del use-effect indiceDni: ${indiceDni}`)
  console.log(`fuera del use-effect. Turnodni.lenght: ${turnoDni.length}`)

  const resetUsers = () => {
    //esto llega al qeueGateway, se resetea el array de usuarios, y de ahi se envia a Pantalla.jsx de nuevo (pa enviar la lista de usuarios vacía)
    socket.emit('resetUsers', 'reset-lista-de-espera')
    localStorage.setItem('numeroTurno', '1');
  }

  // console.log('abajo turnoDni')
  // console.log(turnoDni)
  // console.log(`indiceDni-fuera: ${indiceDni}`)
  // console.log(`turnoDni.length-fuera: ${turnoDni.length}`)


  return (
    <>
      <div className='ctnPantalla'>
        <h1>PANTALLA CENTRAL</h1>
        {
          turnoDni.length > 0 ?
            // <h3>TURNO: {turnoDni[indiceDni].nroTurno}  - DNI: {turnoDni[indiceDni].dni}</h3>

            <>
              <h2>IndiceDni: {indiceDni}</h2>
              <h2>TurnoDni.length: {turnoDni.length}</h2>
            </>
            :
            <h3>TURNO:  - DNI: </h3>
        }
        {
          mesaDeEntradas !== null && <h3>Pasar por la mesa de entradas numero: {mesaDeEntradas}</h3>
        }
      </div>
      <div className='listaEspera'>
        <h4>Lista de espera</h4>
        {
          turnoDni.map(({ dni, nroTurno }, index) => {

            // console.log('dni del mapeo')
            // console.log(dni)
            if (dni || nroTurno) {
              return <h4 key={index}>Turno: {nroTurno} - DNI: {dni}</h4>
            }

          })
        }

      </div>
      {/* <h4>Mensaje: </h4> */}
        {
          prueba ? <h1>PRUEBA TRUE</h1> : <h1>PRUEBA FALSE</h1>
        }
      <button className='btn-reset-users' onClick={() => resetUsers()}>Reiniciar lista de espera</button>

    </>
  )
}
