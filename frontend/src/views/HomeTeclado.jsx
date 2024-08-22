import React, { useEffect, useState } from 'react'
import io from 'socket.io-client'
import Teclado from '../componentes/Teclado';
import { Navbar2 } from '../componentes/Navbar2';
import { Warning } from '../componentes/Warning';

// const socket = io('/');
//https://muni-dev.onrender.com
//https://municipalidad-rawson-server.onrender.com
// const socket = io('https://muni-dev.onrender.com', {
//     reconnection: true,
//     reconnectionAttempts: Infinity, // Número de intentos de reconexión
//     reconnectionDelay: 1000, // Tiempo de espera antes del primer intento de reconexión
//     reconnectionDelayMax: 5000,
//     auth: {
//         serverOffset: 0
//     }
// });
const socket = io('/', {
    reconnection: true,
    reconnectionAttempts: Infinity, // Número de intentos de reconexión
    reconnectionDelay: 1000, // Tiempo de espera antes del primer intento de reconexión
    reconnectionDelayMax: 5000,
    auth: {
        serverOffset: 0
    }
});


export const HomeTeclado = () => {

    //USE STATES
    const [dni, setDni] = useState(null);
    const [internetConnection, setInternetConnection] = useState(true)
    const [serverConnection, setServerConnection] = useState(true)
    const [showTramites, setShowTramites] = useState(false);
    const [nameInputValue, setNameInputValue] = useState('');
    const [Loading, setLoading] = useState(false)


    // Intentar obtener el número de turno del Local Storage al inicializar el estado
    const [numeroTurno, setNumeroTurno] = useState(() => {
        const storedNumeroTurno = localStorage.getItem('proximoTurno');
        return storedNumeroTurno && storedNumeroTurno < 100 ? parseInt(storedNumeroTurno) : 1;
    });


    //FIN USESTATES

    const handleShowTramites = (boolean) => setShowTramites(boolean);
    const handleSubmit = (e) => {

        e.preventDefault();
        //cuando se hace un submit, en la funcion sendDni de abajo se envia el documento al websocket (con el numero de turno asociado) y se aumenta el state numeroTurno, y eso dispara el useEffect de abajo que lo que hace es guardar en el local storage el nuevo numero de turno

        if (!navigator.onLine) {
            setInternetConnection(false);
            // handleShowTramites(false)
            return;
        }
        if (!nameInputValue) return alert('no se puede enviar un dni vacío');

        sendDni(nameInputValue, numeroTurno)
        // console.log(`este es el dni que se le pasa a la funcion sendDni: ${dni}, y este es el nrode turno ${numeroTurno}`)
        setNameInputValue('')
        handleShowTramites(true)
    }


    const sendDni = (documento, nroTurno) => {
        // Esta funcion envía el turnoDni al server, el server se lo envia a pantalla y espera que le responda en cierto tiempo. Sino responde pantalla en un timeout el server responde con un message: error
        console.log('se ejecuta function dni')

        setLoading(true)

        const actualUserTurnoDni = { dni: documento, nroTurno };


        // socket.timeout(10000).emit('sendDni', actualUserTurnoDni, (err, res)=>{

        //     if(err){
        //         console.log('el servidor no ha respondido a tiempo en timeout(4000)')
        //         setServerConnection(false)
        //     }else{
        //         console.log('EL SERVIDOR RESPONDIO CORRECTAMENTE ABAJO ESTA LA RESPUESTA')
        //         console.log(res.serverMessage)
        //         setTimeout(() => {

        //             setLoading(false)
        //         }, 2000);
        //     }
        // })

        socket.timeout(10000).emit('sendDni', actualUserTurnoDni, (err, res) => {
            //La autenticación funciona así: se envia usuario (actualUserTudnoDni) al servidor. Y se necesita hacer 2 comprobaciones, la primera para ver si el servidor responde, si esta conectado. Si en 10s no responde, entra en el err. Se tiene que hacer porque la segunda validacion se basa en ver si  la pantalla recibio el usuario correctamente, y esto se verifica escuchando el evento que esta mas abajo 'responseDniStatus'. Se escucha el evento 'responseDniStatus' y nos avisa si la pantalla respondio o no respondio. ¿pero si el servidor no puede responder porque no esta conectado? Bueno para eso esta primera validacion. Y bueno una vez que pasa esta primera validacion, se espera la respuesta del servidor para ver si pantalla respondio o no.

            if (err) {
                console.log('No se puedo establecer la conexión con el servidor')
                setServerConnection(false)
            } else {
                console.log(res)
                console.log('el queue gateway respondio correctamente')
            }
        })

        socket.once('responseDniStatus', status => {


            if (status.dniStatus === 'pantalla no recibio el mensaje') {
                console.log('pantalla no respondio')
                setServerConnection(false)
            } else if (status.dniStatus === 'pantalla recibio el mensaje') {
                // console.log(`pantalla respondio: ${status.dniStatus}`)
                // setLoading(true)
                setTimeout(() => {
                    setLoading(false)
                }, 2000);

                setNumeroTurno((prevNumeroTurno) => {
                    return prevNumeroTurno > 98 ? 1 : prevNumeroTurno + 1;
                }); // Incrementar el número de turno para el siguiente usuario;

            } else {
                console.log('ESTE ES EL MENSAJE QUE LLEGA EN responseDniStatus')
                console.log(status)
            }
        })

        socket.once('reenvio', status => {

            console.log('SE HA RECIBIDO UN MENSAJE REENVIADO')
            console.log(status)

        })
    }


    const handleKeyPress = (key) => {
        //Esta funcion, llena el nameInputValue con cada numero que agrega el usuario, y ademas llena el "value del formulario, por lo que se ira mostrando en el input los numerso que se vayan cliqueando. (Lo que se hacia antes era con el handlechange del input se llenaba el state "dni" y ese state luego se enviaba al servidor. Ahora enviaremos el state "nameInputValue")

        if (key === '←') {
            setNameInputValue(nameInputValue.slice(0, -1));
        } else if (key === '✓') {
            return;
        } else {
            setNameInputValue(nameInputValue + key);
        }
    };

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
        localStorage.setItem('proximoTurno', numeroTurno.toString());
        // console.log(`se actualizo el numeto de turno, y es este ahora: ${numeroTurno}`)

    }, [numeroTurno]);


    if (!internetConnection && !Loading) {
        return (
            <>


                <Warning warn={"NO HAY CONEXION"} />
                {/* <button className='rounded-full mx-auto px-3 py-2 bg-cv-celeste-claro' onClick={() => setInternetConnection(true)}>Intente Nuevamente</button> */}
                {/* <a href="/" className='text-2xl px-8 rounded-full mx-auto py-3 bg-cv-celeste-claro'>Volver</a> */}
                <button className='text-2xl px-8 rounded-full mx-auto py-3 bg-sky-200' onClick={() => {
                    setInternetConnection(true);
                    setLoading(true);
                }}>Volver</button>

            </>
        )
    }
    if (!serverConnection) {
        return (
            <>
            <div className='h-screen  flex justify-center items-center'>
           
            <div className='bg-white w-2/3 p-14 rounded-lg flex flex-col justify-center shadow-xl'>

                        <Warning warn={"NO HAY CONEXIÓN CON EL SERVIDOR INTENTE NUEVAMENTE"} />
                        {/* <button className=' rounded-full mx-auto px-3 py-2 bg-cv-celeste-claro' onClick={() => setServerConnection(true)}>Intente Nuevamente</button> */}
                        {/* <a href="/" className='text-2xl px-8 rounded-full mx-auto py-3 bg-cv-celeste-claro'>Volver</a> */}
                        <button className='font-medium text-3xl px-8 rounded-lg text-white mt-16 mx-auto w-2/3 py-3 bg-cv-verde-oscuro' onClick={() => {
                            // setInternetConnection(true);
                            setServerConnection(true)
                            setLoading(false);
                        }}>Volver</button>
                        </div>

                        </div>
            </>

        )
    }

    if (Loading) {
        return (
            <Warning warn={"CARGANDO..."} />
        )
    }





    return (
        <>
            {/* <Navbar2 /> */}
            {
                !showTramites ?
                    <>

                        <div className='flex flex-col items-center justify-center min-h-screen px-28 '>
                            <h1 className='block text-center text-white text-start  text-6xl font-bold'>INGRESE SU NOMBRE Y APELLIDO</h1>
                            <form action="#" method="post" onSubmit={handleSubmit} className='w-full mt-10 py-4 rounded-xl bg-white shadow-xl '>
                                <label htmlFor="InputDocumento" ></label>
                                <input
                                    className='block w-full m-auto text-center lg:text-5xl lg:rounded-xl  text-rojo font-bold '
                                    type="Text"
                                    id="InputDocumento"
                                    name="dni"
                                    value={nameInputValue}
                                    readOnly
                                    // style={{ display: "block" }}
                                    required
                                // onChange={(e) => handleChange(e)}
                                />
                                {/* <button type="submit"  >Enviar</button> */}
                                <Teclado onKeyPress={handleKeyPress} />
                            </form>
                            {/* <button onClick={()=>setShowTramites(false)}>Reset show tramites</button> */}

                        </div>

                    </>
                    :
                    <>
                        <div className='text-center mt-10 text-4xl text-white bg-cv-verde-oscuro p-5 rounded-xl w-2/3 mx-auto '>
                            <h1 >Bienvenido a la Municipalidad de Rawson</h1>
                            <h2 className='my-4'>Tome asiento y será llamado por la pantalla</h2>
                            <button onClick={() => setShowTramites(false)} className='rounded-full p-10 bg-cv-celeste-claro'>Volver</button>
                        </div>
                        {/* <button onClick={()=>setShowTramites(false)}>Reset show tramites</button> */}

                    </>
            }

        </>
    )
}
