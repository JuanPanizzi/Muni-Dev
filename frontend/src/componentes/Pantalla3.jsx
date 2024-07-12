import { useEffect, useRef, useState } from 'react'
// import '../styles/Pantalla.css'
import io from 'socket.io-client'
import { Navbar2 } from './Navbar2';

// const socket = io('/', {
//   query: {
//     deviceType: 'pantalla',  // Identificador del tipo de dispositivo
//     deviceId: '25',  // Identificador único del dispositivo
//   }
// }
// );
const socket = io('https://municipalidad-rawson-server.onrender.com', {
    query: {
      deviceType: 'pantalla',  // Identificador del tipo de dispositivo
      deviceId: '25',  // Identificador único del dispositivo
    }
  }
);

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
  const [noMoreUsers, setNoMoreUsers] = useState(false);

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
  const handleIndices = async (setIndiceBoxNumber) => {

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
  const updateIndicesAndBoxes = async (data) => {

    
    if (prevIndiceGlobalRef.current == turnoDniRef.current.length - 1) {
      console.log('NO HAY MAS USUARIOS EN UPDATE')
      setShowWarn(true)
      setNoMoreUsers(true)
      
      return { statusChangedUser: "No hay mas usuarios" }
    }

    // const indiceGlobalA = JSON.parse(localStorage.getItem('indiceGlobalStorage'));
    const { box } = data;
    console.log('ENTRA EN UPDATE INDCES AND BOX')
    const usersA = JSON.parse(localStorage.getItem('users'))
    const nextUser = usersA[prevIndiceGlobalRef.current +1].dni
    console.log('abajo prevIndiceGlobalRef.current +1')
    console.log(prevIndiceGlobalRef.current +1)
    // console.log(nextUser)

    switch (box) {

      case '1': {

        await handleIndices(setIndiceBox1)

        // console.log('IndiceGlobal')
        // console.log(indiceGlobalA)
        // console.log('abajo usersA')
        // console.log(usersA)

        // console.log('¿PROXIMO USUARIO? usersA[indiceGlobalA]')


        // console.log(turnoDni[indiceBox1.indice].dni)

        //Este return termina siendo la response en queue.gateway en el @SuscribeMessage('nextUser')
        // return { statusChangedUser: "se cambio-llamo el usuario correctamente", proximoUser: turnoDni[indiceBox1.indice].dni }

        return { statusChangedUser: "se cambio-llamo el usuario correctamente", nextUser }

        // break;
      }
      case '2': {

        await handleIndices(setIndiceBox2)

        // return { statusChangedUser: "se cambio-llamo el usuario correctamente", proximoUser: turnoDni[indiceBox2.indice].dni }

        return { statusChangedUser: "se cambio-llamo el usuario correctamente", nextUser }

        // break;
      }
      case '3': {

        await handleIndices(setIndiceBox3)

        return { statusChangedUser: "se cambio-llamo el usuario correctamente", nextUser }
        // break;
      }
      case '4': {

        await handleIndices(setIndiceBox4)
        return { statusChangedUser: "se cambio-llamo el usuario correctamente", nextUser }
        // break;
      }
      default: {

        // alert('Error. Se debe conectar desde un dispositivo válido')
        return { statusChangedUser: "Error al llamar usuario. Compruebe la url de su dispositivo" }
        // break;
      }
    }

  }


  //USEREF --> Se mantienen actualizados por el useEffect mas abajo
  const prevIndiceGlobalRef = useRef(indiceGlobal);
  const turnoDniRef = useRef(turnoDni)


  useEffect(() => {

    socket.emit('joinPantallaRoom');

    socket.on('sendNewDni', (arg1, arg2, callback) => {
      // Recibe un dni nuevo que envia el HomeTeclado al gateway y lo acumula en el array de usuarios en el localstorage
      console.log('new user que llega')
      const newUser = arg1.turnoDni
      console.log(newUser)
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

      callback({
        status: 'ok'
      })

      // socket.emit('dniConfirmed', { success: true, message: 'DNI almacenado exitosamente' });
      setNoMoreUsers(false)
    })

    socket.on('reloadPantallaNow', (arg1, arg2, callback)=>{
      const statusReload = 'OK'
      callback({
        status: statusReload
      })
      location.reload()
    })

    // socket.on('changeNextUser', updateIndiceAndMesa)
    socket.on('changeNextUser', async (arg1, arg2, callback) => {
      //arg1 es la data: {mensaje, box}
      const statusChangedUser = await updateIndicesAndBoxes(arg1); //{statusChangedUser: "..."}

      callback({
        status: statusChangedUser
      })

    })

    // Retornar una función para limpiar la suscripción cuando el componente se desmonte
    return () => {
      socket.off('sendNewDni');
      socket.off('changeNextUser')
      socket.off('reloadPantallaNow')
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
          turnoDni.length >= 0 &&

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
            {
              noMoreUsers && <h1 className='text-4xl text-center mt-20'>THERE IS NO MORE USERS TO SHOW </h1>
            }
          </>


        }


      </>



    </>
  )
}
