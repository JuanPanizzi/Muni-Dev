import React, { useEffect, useState } from 'react'
import io from 'socket.io-client'
import { Tramites } from './Tramites';
// import '../styles/Home.css'
import Teclado from './Teclado';
// import { Navbar } from './Navbar';
import { Navbar2 } from './Navbar2';
import { Warning } from './Warning';

const socket = io('/');


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

    const [actualUserTurnoDni, setActualUserTurnoDni] = useState(null);

    //FIN USESTATES

    const handleShowTramites = (boolean) => setShowTramites(boolean);
    const handleSubmit = (e) => {

        e.preventDefault();
        //cuando se hace un submit, en la funcion sendDni de abajo se envia el documento al websocket (con el numero de turno asociado) y se aumenta el state numeroTurno, y eso dispara el useEffect de abajo que lo que hace es guardar en el local storage el nuevo numero de turno

        if (!navigator.onLine){
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
        //Controlar si el mensaje llega al servidor
        //Controlar 
        

        setLoading(true)
        
        const actualUserTurnoDni = { dni: documento, nroTurno };

        socket.timeout(4000).emit("sendDni", actualUserTurnoDni, (err, response) => {

            if (err) {
                setLoading(false)
                handleShowTramites(false)
                setServerConnection(false)
                console.log('El mensaje no se recibió ')
                // the other side did not acknowledge the event in the given delay
            } else {
                setActualUserTurnoDni(actualUserTurnoDni)
                setTimeout(() => {
                    setLoading(false)
                }, 2000);
            }
        });

        // documento == null ?
        //     alert('no se puede enviar un dni vacio') :
        //     socket.emit('sendDni', { dni: documento, nroTurno });
        // //Aca se recibe lo que se manda para chequear que eso llegó
        // socket.on('respuestaDni', (turnoDniResponse) => {
        //         setActualUserTurnoDni(turnoDniResponse)
        //     // const { dni: dniRecibido, nroTurno: nroTurnoRecibido } = turnoDniResponse;
        // })

        setNumeroTurno((prevNumeroTurno) => {
            return prevNumeroTurno > 98 ? 1 : prevNumeroTurno + 1;
        }); // Incrementar el número de turno para el siguiente usuario;

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
                <button onClick={() => setInternetConnection(true)}>Intente Nuevamente</button>
            </>
        )
    }
    if (!serverConnection) {
        return (
            <>
                <Warning warn={"NO HAY CONEXION CON EL SERVIDOR INTENTE DE NUEVO..."} />
                <button onClick={() => setServerConnection(true)}>Intente Nuevamente</button>
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
            <Navbar2 />
            {
                !showTramites ?
                    <>

                        <div className='  m-auto w-auto '>

                            <form action="#" method="post" onSubmit={handleSubmit} className=' lg:w-2/3 lg:m-auto lg:mt-16 bg-cv-verde-oscuro py-3 rounded-xl   '>
                                <label htmlFor="InputDocumento" className='text-center block text-white text-4xl '>Nombre y Apellido</label>
                                <input
                                    className='block w-2/3 m-auto lg:text-5xl lg:rounded-xl   text-center p-1 mt-2 bg-cv-celeste-claro'
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

                        <h1 >Bienvenido a la Municipalidad de Rawson</h1>
                        <h2>Tome asiento y será llamado por la pantalla</h2>
                        <button onClick={()=>setShowTramites(false)}>Volver</button>
                        {/* <button onClick={()=>setShowTramites(false)}>Reset show tramites</button> */}

                    </>
            }

        </>
    )
}
