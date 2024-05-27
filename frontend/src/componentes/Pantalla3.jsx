import { useEffect, useRef, useState } from 'react'
import '../styles/Pantalla.css'
import io from 'socket.io-client'
import { ToPrint } from './ToPrint';
import print from 'print-js'
import printJS from 'print-js';

const socket = io('/');

export const Pantalla3 = () => {

  //turnoDni --> arryUsers = [{dni: '221', nroTurno: 3}, {dni: '211', nroTurno: 5}];
  //indiceDni
  //mesaDeEntradas --> box

  //Okey this is how it works. When the component mounts, the useeffect recieves the arryUsers [{dni:123, nroTurno:2}] and its setted to 'turnoDni' state.
  //Also this useEffect its connected to the 'changeNextUser' which is activated by the box components when you click "proximo usuario"
  //So, when a box component click 'proximo usuario' there's a updateIndiceAndMesa function which is activated. This function takes the data [{mensaje: 'next user please', box}] which come from the 'changeNextUser' event.
  //And what does this function do? --> set the 'indiceDni' and the 'mesaDeEntradas', wichare used to render the next user in the central screen.-

  const [turnoDni, setTurnoDni] = useState([])
  const [mesaDeEntradas, setMesaDeEntradas] = useState(null)

  const [indiceGlobal, setIndiceGlobal] = useState(-1);

  const [indiceBox1, setIndiceBox1] = useState({ indice: null, nroBox: 1 });
  const [indiceBox2, setIndiceBox2] = useState({ indice: null, nroBox: 2 });
  const [indiceBox3, setIndiceBox3] = useState({ indice: null, nroBox: 3 });
  const [indiceBox4, setIndiceBox4] = useState({ indice: null, nroBox: 4 });

  const [primerUser, setPrimerUser] = useState(false)

  const [showWarn, setShowWarn] = useState(false);
  const [showUsers, setShowUsers] = useState(false);


  const updateIndiceAndMesa = (data) => {
    //data = {mensaje: 'next user please', box} y viene de subscribe message 'nextUser' del queueGateway
    //update indiceDni && mesaDeEntradas
    const { box } = data;

    //Si en el array de usuarios no hay un usuario siguiente --> showWarn(true) --> Renderiza 'no hay mas usuarios'
    if (indiceDniRef.current == turnoDniRef.current.length - 1) {
      setShowWarn(true)
      return
    }

    if (indiceDniRef.current == 0) {
      // console.log('entro en indicedniref.current = 0')
      // console.log(`1. Cuando entro en 0 el indiceDniRef.current = ${indiceDniRef.current} `)
      setMesaDeEntradas(box)
      indiceDniRef.current++
      // console.log(`2. Luego se aumenta un ++ y vale = ${indiceDniRef.current} `)

    } else {

      // console.log(`3. Aca entra cuando es > 0 y vale: ${indiceDniRef.current}`)
      //Acá se aumenta en uno el indiceDni (el global)
      setIndiceDni((prevIndice) => prevIndice + 1)

      if (indiceDniRef.current !== 1) {

        // console.log(`5. Si el indiceDni.current no vale 1 se le suma uno. Antes de sumarlo vale: ${indiceDniRef.current}`)
        indiceDniRef.current++
        // console.log(`6. Y despues de sumarlo vale: ${indiceDniRef.current}`)

      }
      setMesaDeEntradas(box)
      if (showWarn) {
        setShowWarn(false)
      }
    }

  }

  //USEREF --> Se mantienen actualizados por el useEffect mas abajo
  const prevIndiceGlobalRef = useRef(indiceGlobal);
  const turnoDniRef = useRef(turnoDni)


  const updateIndicesAndBoxes = (data) => {

    const { box } = data;

    if(prevIndiceGlobalRef.current == turnoDniRef.current.length-1){
      console.log('BREAK')
      setShowWarn(true)
      return;
    }
    
    switch (box) {
      case '1': {
        

        setIndiceBox1((prevState) => ({
          ...prevState,
          indice: prevIndiceGlobalRef.current,
        }));

        setIndiceGlobal((prevIndice) => {
          console.log('se aumentó el indice global')
          const newIndice = prevIndice + 1;
          prevIndiceGlobalRef.current = newIndice;
          return newIndice;
        });

        break;
      }
      case '2': {

        setIndiceBox2((prevState) => ({
          ...prevState,
          indice: prevIndiceGlobalRef.current,
        }));

        setIndiceGlobal((prevIndice) => {
          const newIndice = prevIndice + 1;
          prevIndiceGlobalRef.current = newIndice;
          return newIndice;
        });

        break;
      }
      case '3': {

        setIndiceBox3((prevState) => ({
          ...prevState,
          indice: prevIndiceGlobalRef.current,
        }));

        setIndiceGlobal((prevIndice) => {
          const newIndice = prevIndice + 1;
          prevIndiceGlobalRef.current = newIndice;
          return newIndice;
        });
        break;
      }
      case '4': {

        setIndiceBox4((prevState) => ({
          ...prevState,
          indice: prevIndiceGlobalRef.current,
        }));
        setIndiceGlobal((prevIndice) => {
          const newIndice = prevIndice + 1;
          prevIndiceGlobalRef.current = newIndice;
          return newIndice;
        });
        break;
      }
      default: {

        alert('Error. Se debe conectar desde un dispositivo válido')

        break;
      }
    }

  }




  useEffect(() => {

    socket.emit('joinPantallaRoom');

    // Suscribirse al evento 'sendAllDnis' cuando el componente se monta
    socket.on('sendAllDnis', (arryUsers) => {
      //arryUsers = [{dni: '221', nroTurno: 3}, {dni: '211', nroTurno: 5}]
      setTurnoDni(arryUsers);
      // setTurnoDni(prevUsers => [...prevUsers, ...arryUsers])
      if (!showUsers) {
        setShowUsers(true);
      }

    })


    // socket.on('changeNextUser', updateIndiceAndMesa)
    socket.on('changeNextUser', updateIndicesAndBoxes)

    //data = {mensaje: 'next user please', box} y viene de subscribe message 'nextUser' del queueGateway


    // Retornar una función para limpiar la suscripción cuando el componente se desmonte
    return () => {
      socket.off('sendAllDnis');
      socket.off('changeNextUser')
      // socket.emit('leavePantallaRoom');
    };
  }, []);

  // Actualiza la referencia de indiceDniRef cada vez que indiceDni cambie

  useEffect(() => {
    prevIndiceGlobalRef.current = indiceGlobal;
    turnoDniRef.current = turnoDni;
  }, [indiceGlobal, turnoDni]);


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
        {/* turnoDni.length > 0 && mesaDeEntradas !== null && turnoDni[indiceDni].nroTurno && */}

        {
          turnoDni.length > 0 &&

          <>
            <div>
              {/* <h1 id='turnoDnitoPrint'>TURNO: {turnoDni[indiceBox1.indice].nroTurno}  - DNI: {turnoDni[indiceBox1.indice].dni}</h1> */}
              {/* <h1 >TURNO: {turnoDni[indiceBox1.indice].nroTurno}  - DNI: </h1> */}
              {/* <h2>Pasar por la mesa de entradas numero: {indiceBox1.nroBox}</h2> */}

              {/* <ul>
                <li>IndiceGlobal: {indiceGlobal}</li>
                <li>IndiceBox1: {indiceBox1.indice}</li>
                <li>IndiceBox2: {indiceBox2.indice}</li>
                <li>IndiceBox3: {indiceBox3.indice}</li>
                <li>IndiceBox3: {indiceBox4.indice}</li>

              </ul> */}

            </div>
            <div>
              {
                indiceBox1.indice >= 0 && indiceBox1.indice != null &&
                <p><b>BOX1: </b>TURNO: {turnoDni[indiceBox1.indice].nroTurno} - DNI: {turnoDni[indiceBox1.indice].dni} </p>
              }
              {
                indiceBox2.indice >= 0 && indiceBox2.indice != null &&
                <p><b>BOX2:</b> TURNO: {turnoDni[indiceBox2.indice].nroTurno} - DNI: {turnoDni[indiceBox2.indice].dni}  </p>
              }
              {
                indiceBox3.indice >= 0 && indiceBox3.indice != null &&
                <p><b>BOX3:</b> TURNO: {turnoDni[indiceBox3.indice].nroTurno} - DNI: {turnoDni[indiceBox3.indice].dni}  </p>

              }
              {
                indiceBox4.indice >= 0 && indiceBox4.indice != null &&
                <p><b>BOX4:</b> TURNO: {turnoDni[indiceBox4.indice].nroTurno} - DNI: {turnoDni[indiceBox4.indice].dni}  </p>

              }

            </div>

            {/* <p>Indice Global:{indiceGlobal}</p> */}
            {/* <p>turnoDni.length - 1: {turnoDni.length - 1}</p> */}

          </>
        }
        {/* {
            indiceBox2 && 
          <div>
            <h1 >TURNO: {turnoDni[indiceBox2].nroTurno}  - DNI: {turnoDni[indiceBox2].dni}</h1>
            <h2>BOX numero: {mesaDeEntradas}</h2>
          </div>
          }
          {
            indiceBox3 && 
          <div>
            <h1 >TURNO: {turnoDni[indiceBox3].nroTurno}  - DNI: {turnoDni[indiceBox3].dni}</h1>
            <h2>BOX numero: {mesaDeEntradas}</h2>
          </div>
          } */}


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
      {/* {
        indiceGlobal && turnoDni.length >= 0 && <ul> <li>Indice Global: {indiceGlobal}</li>
          <li>Turno dni.length -1: {turnoDni.length - 1}</li> </ul>
      } */}

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
      <button className='btn-reset-users' onClick={() => resetUsers()}>Reiniciar lista de espera</button>

      {showWarn && <h1>NO HAY MAS USUARIOS</h1>}


    </>
  )
}
