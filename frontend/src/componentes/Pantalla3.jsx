import { useEffect, useRef, useState } from 'react'
// import '../styles/Pantalla.css'
import io from 'socket.io-client'
import { Navbar2 } from './Navbar2';

const socket = io('/');

export const Pantalla3 = () => {

  //turnoDni --> arryUsers = [{dni: '221', nroTurno: 3}, {dni: '211', nroTurno: 5}];
  //indiceDni
  //mesaDeEntradas --> box

  //Okey this is how it works. When the component mounts, the useeffect recieves the arryUsers [{dni:123, nroTurno:2}] and its setted to 'turnoDni' state.
  //Also this useEffect its connected to the 'changeNextUser' which is activated by the box components when you click "proximo usuario"
  //So, when a box component click 'proximo usuario' there's a updateIndiceAndMesa function which is activated. This function takes the data [{mensaje: 'next user please', box}] which come from the 'changeNextUser' event.
  //And what does this function do? --> set the 'indiceDni' and the 'mesaDeEntradas', wichare used to render the next user in the central screen.-

  const [turnoDni, setTurnoDni] = useState(() => {
    const storedUsers = localStorage.getItem('users');
    return storedUsers ? JSON.parse(storedUsers) : []
  })

  // const [mesaDeEntradas, setMesaDeEntradas] = useState(null)

  // const [indiceGlobal, setIndiceGlobal] = useState(-1);
  const [indiceGlobal, setIndiceGlobal] = useState(() => {
    const indiceStorage = localStorage.getItem('indiceGlobalStorage');
    // console.log(`indiceStorage es: ${indiceStorage}`)
    return indiceStorage ? parseInt(indiceStorage) : -1;
  });


  const [indiceBox1, setIndiceBox1] = useState({ indice: null, nroBox: 1 });
  const [indiceBox2, setIndiceBox2] = useState({ indice: null, nroBox: 2 });
  const [indiceBox3, setIndiceBox3] = useState({ indice: null, nroBox: 3 });
  const [indiceBox4, setIndiceBox4] = useState({ indice: null, nroBox: 4 });


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

  //Esta funcion setea indiceGlobal e indices de los boxes
  const handleIndices = (setIndiceBoxNumber) => {

    setIndiceGlobal((prevIndice) => {
      const newIndice = prevIndice + 1;
      prevIndiceGlobalRef.current = newIndice;
      localStorage.setItem('indiceGlobalStorage', newIndice);

      setIndiceBoxNumber((prevState) => ({
        ...prevState,
        indice: newIndice,
      }));

      return newIndice;
    })

  }

  //Esta funcion llama a handleIndices
  const updateIndicesAndBoxes = (data) => {

    const { box } = data;

    if (prevIndiceGlobalRef.current == turnoDniRef.current.length - 1) {
      console.log('BREAK')
      setShowWarn(true)
      return;
    }

    switch (box) {
      case '1': {

        handleIndices(setIndiceBox1)
        break;
      }
      case '2': {

        handleIndices(setIndiceBox2)
        break;
      }
      case '3': {

        handleIndices(setIndiceBox3)
        break;
      }
      case '4': {

        handleIndices(setIndiceBox4)
        break;
      }
      default: {

        alert('Error. Se debe conectar desde un dispositivo válido')

        break;
      }
    }

  }

  //USEREF --> Se mantienen actualizados por el useEffect mas abajo
  const prevIndiceGlobalRef = useRef(indiceGlobal);
  const turnoDniRef = useRef(turnoDni)


  useEffect(() => {

    socket.emit('joinPantallaRoom');

    socket.on('sendNewDni', (newUser, callback) => {
      // Recibe un dni nuevo que envia el HomeTeclado al gateway y lo acumula en el array de usuarios en el localstorage

      //newUser = {dni: '221', nroTurno: 3}
      //arryUsers = [{dni: '221', nroTurno: 3}, {dni: '211', nroTurno: 5}]
      // localStorage.setItem('turnoDniStorage', JSON.stringify(arryUsers));

      // Recuperar el array del localStorage, o inicializar un array vacío si no existe 
      const arrayUsers = JSON.parse(localStorage.getItem('users')) || [];
      arrayUsers.push(newUser);
      localStorage.setItem('users', JSON.stringify(arrayUsers));

      setTurnoDni(arrayUsers);
      // setTurnoDni(prevUsers => [...prevUsers, ...arryUsers])
      if (!showUsers) {
        setShowUsers(true);
      }
      
      console.log('PANTALLA RESPONDE OK')
      // { foo: 'bar' }

        callback({
          status: 'ok'
        })

        // socket.emit('dniConfirmed', { success: true, message: 'DNI almacenado exitosamente' });
      
    })


    // socket.on('changeNextUser', updateIndiceAndMesa)
    socket.on('changeNextUser', updateIndicesAndBoxes)

    // Retornar una función para limpiar la suscripción cuando el componente se desmonte
    return () => {
      socket.off('sendNewDni');
      socket.off('changeNextUser')
      // socket.emit('leavePantallaRoom');
    };
  }, []);

  // Actualiza la referencia de indiceDniRef cada vez que indiceDni cambie

  useEffect(() => {
    prevIndiceGlobalRef.current = indiceGlobal;
    turnoDniRef.current = turnoDni;
  }, [indiceGlobal, turnoDni]);



  //ARREGLAR
  const resetUsers = () => {
    //esto llega al qeueGateway, se resetea el array de usuarios, y de ahi se envia a Pantalla.jsx de nuevo (pa enviar la lista de usuarios vacía)
    socket.emit('resetUsers', 'reset-lista-de-espera')
    localStorage.setItem('numeroTurno', '1');
    setShowWarn(false)
  }

  const configuracion = {
    silent: true,
  };



  return (
    <>
      <Navbar2 />
      <>
        {/* turnoDni.length > 0 && mesaDeEntradas !== null && turnoDni[indiceDni].nroTurno && */}
        {
          turnoDni.length > 0 &&

          <>
            <div className=" w-2/3 m-auto mt-12 ">
              <table className="min-w-full bg-cv-celeste-oscuro text-sm  ">
                <thead className="ltr:text-left rtl:text-right text-3xl ">
                  <tr className='bg-cv-verde-oscuro '>
                    {/* <th className="whitespace-nowrap px-4 py-5 font-medium text-white rounded-l-lg">TURNO</th> */}
                    <th className="whitespace-nowrap px-4 py-5 font-medium text-white ">NOMBRE</th>
                    <th className="whitespace-nowrap px-20 py-5 font-medium text-white "> </th>
                    <th className="whitespace-nowrap px-4 py-5 font-medium text-white rounded-r-lg">BOX</th>
                  </tr>
                </thead>

                <tbody className="bg-cv-celeste-oscuro ">

                  {/*
                  
                  
                  <tr className='text-center text-4xl'>
                      <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">{turnoDni[indiceBox4.indice].nroTurno}</td>
                      <td className="whitespace-nowrap px-4 py-2 text-gray-700">{turnoDni[indiceBox4.indice].dni}</td>
                      <td className="whitespace-nowrap px-20 py-2 "></td>
                      <td className="whitespace-nowrap px-4 py-2 text-gray-700">{indiceBox4.nroBox}</td>
                    </tr>
                  } */}
                  {

                    indiceBox1.indice >= 0 && indiceBox1.indice != null &&
                    <>
                      {/* TABLA VACÍA */}
                      <tr className=' text-center text-4xl '>
                        <td className="whitespace-nowrap px-4 py-3 font-medium "></td>
                        <td className="whitespace-nowrap px-4 py-3 "></td>
                        <td className="whitespace-nowrap px-20 py-3 "></td>
                        <td className="whitespace-nowrap px-4 py-3 ">  </td>
                      </tr>
                      <tr className=' text-center text-4xl bg-cv-celeste-claro rounded-lg'>
                        {/* <td className="whitespace-nowrap px-4 py-4 font-medium text-gray-900 rounded-l-lg">{turnoDni[indiceBox1.indice].nroTurno}</td> */}
                        <td className="whitespace-nowrap px-4 py-4 ">{turnoDni[indiceBox1.indice].dni}</td>
                        <td className="whitespace-nowrap px-20 py-4 "></td>
                        <td className="whitespace-nowrap px-4 py-4  rounded-r-lg"> {indiceBox1.nroBox} </td>
                      </tr>
                    </>

                  }
                  {
                    indiceBox2.indice >= 0 && indiceBox2.indice != null &&
                    <>
                      {/* TABLA VACÍA */}
                      <tr className=' text-center text-4xl '>
                        <td className="whitespace-nowrap px-4 py-3 font-medium text-gray-900"></td>
                        <td className="whitespace-nowrap px-4 py-3 text-gray-700"></td>
                        <td className="whitespace-nowrap px-20 py-3 "></td>
                        <td className="whitespace-nowrap px-4 py-3 text-gray-700">  </td>
                      </tr>
                      <tr className=' text-center text-4xl bg-cv-celeste-claro rounded-lg'>
                        {/* <td className="whitespace-nowrap px-4 py-4 font-medium text-gray-900 rounded-l-lg"> {turnoDni[indiceBox2.indice].nroTurno}</td> */}
                        <td className="whitespace-nowrap px-4 py-4 ">{turnoDni[indiceBox2.indice].dni}</td>
                        <td className="whitespace-nowrap px-20 py-4 "></td>
                        <td className="whitespace-nowrap px-4 py-4  rounded-r-lg"> {indiceBox2.nroBox}</td>
                      </tr>
                    </>
                  }
                  {
                    indiceBox3.indice >= 0 && indiceBox3.indice != null &&
                    <>
                      {/* TABLA VACÍA */}
                      <tr className=' text-center text-4xl '>
                        <td className="whitespace-nowrap px-4 py-3 font-medium text-gray-900"></td>
                        <td className="whitespace-nowrap px-4 py-3 text-gray-700"></td>
                        <td className="whitespace-nowrap px-20 py-3 "></td>
                        <td className="whitespace-nowrap px-4 py-3 text-gray-700">  </td>
                      </tr>
                      <tr className=' text-center text-4xl bg-cv-celeste-claro rounded-lg'>
                        {/* <td className="whitespace-nowrap px-4 py-4 font-medium text-gray-900 rounded-l-lg">{turnoDni[indiceBox3.indice].nroTurno}</td> */}
                        <td className="whitespace-nowrap px-4 py-4 ">{turnoDni[indiceBox3.indice].dni}</td>
                        <td className="whitespace-nowrap px-20 py-4 "></td>
                        <td className="whitespace-nowrap px-4 py-4  rounded-r-lg"> {indiceBox3.nroBox} </td>
                      </tr>
                    </>
                  }
                  {
                    indiceBox4.indice >= 0 && indiceBox4.indice != null &&
                    <>
                      {/* TABLA VACÍA */}
                      <tr className=' text-center text-4xl '>
                        <td className="whitespace-nowrap px-4 py-3 font-medium text-gray-900"></td>
                        <td className="whitespace-nowrap px-4 py-3 text-gray-700"></td>
                        <td className="whitespace-nowrap px-20 py-3 "></td>
                        <td className="whitespace-nowrap px-4 py-3 text-gray-700">  </td>
                      </tr>

                      <tr className=' text-center text-4xl bg-cv-celeste-claro rounded-lg'>
                        {/* <td className="whitespace-nowrap px-4 py-4 font-medium text-gray-900 rounded-l-lg">{turnoDni[indiceBox4.indice].nroTurno}</td> */}
                        <td className="whitespace-nowrap px-4 py-4 ">{turnoDni[indiceBox4.indice].dni}</td>
                        <td className="whitespace-nowrap px-20 py-4 "></td>
                        <td className="whitespace-nowrap px-4 py-4  rounded-r-lg"> {indiceBox4.nroBox}</td>
                      </tr>
                    </>
                  }


                </tbody>
              </table>
            </div>
            {/* <div>
              {
                indiceBox1.indice >= 0 && indiceBox1.indice != null &&
                <p><b>BOX N°: {indiceBox1.nroBox} </b>TURNO: {turnoDni[indiceBox1.indice].nroTurno} - DNI: {turnoDni[indiceBox1.indice].dni} </p>
              }
              {
                indiceBox2.indice >= 0 && indiceBox2.indice != null &&
                <p><b>BOX N°: {indiceBox2.nroBox}</b> TURNO: {turnoDni[indiceBox2.indice].nroTurno} - DNI: {turnoDni[indiceBox2.indice].dni}  </p>
              }
              {
                indiceBox3.indice >= 0 && indiceBox3.indice != null &&
                <p><b>BOX N°: {indiceBox3.nroBox}</b> TURNO: {turnoDni[indiceBox3.indice].nroTurno} - DNI: {turnoDni[indiceBox3.indice].dni}  </p>

              }
              {
                indiceBox4.indice >= 0 && indiceBox4.indice != null &&
                <p><b>BOX N°: {indiceBox4.nroBox}</b> TURNO: {turnoDni[indiceBox4.indice].nroTurno} - DNI: {turnoDni[indiceBox4.indice].dni}  </p>

              }

            </div> */}
          </>


        }


      </>

      {/* LISTA DE ESPERA DE USUARIOS */}
      {/* <div className='listaEspera'>
        <h4>Lista de espera</h4>
        {
          turnoDni.map(({ dni, nroTurno }, index) => {

            if (dni || nroTurno) {
              return <h4 key={index}>Turno: {nroTurno} - DNI: {dni}</h4>
            }

          })
        }
      </div>
      <button className='btn-reset-users' onClick={() => resetUsers()}>Reiniciar lista de espera</button> */}

      {/*FIN LISTA DE ESPERA DE USUARIOS */}
      {/* {showWarn && <h1>NO HAY MAS USUARIOS</h1>} */}
      {/* 
      <ul>
        <li>IndiceGlobal: {indiceGlobal}</li>
        <li>IndiceGlobalStorage:{localStorage.getItem('indiceGlobalStorage')}</li>
        <li>IndiceGlobalRef.current: {prevIndiceGlobalRef.current}</li>
        <li>TurnoDni.current.length: {turnoDniRef.current.length}</li>
        <li>TurnoDni.current.length (- 1) : {turnoDniRef.current.length - 1}</li>
        <li>IndiceBox1: {indiceBox1.indice}</li>
        <li>IndiceBox2: {indiceBox2.indice}</li>
        <li>IndiceBox3: {indiceBox3.indice}</li>
        <li>IndiceBox4: {indiceBox4.indice}</li>
      </ul> */}

    </>
  )
}
