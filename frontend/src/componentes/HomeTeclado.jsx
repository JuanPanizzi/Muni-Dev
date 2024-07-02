import React, { useEffect, useState } from 'react'
import io from 'socket.io-client'
import { Tramites } from './Tramites';
// import '../styles/Home.css'
import printJS from 'print-js';
import Teclado from './Teclado';
// import { Navbar } from './Navbar';
import { Navbar2 } from './Navbar2';
import { Warning } from './Warning';

const socket = io('/');


export const HomeTeclado = () => {

    //USE STATES
    const [dni, setDni] = useState(null);
    const [printError, setPrintError] = useState(null); 
    const [internetConnection, setInternetConnection] = useState(true)
    const [serverConnection, setServerConnection] = useState(true)
    const [showTramites, setShowTramites] = useState(false);
    const [dniInputValue, setDniInputValue] = useState('');
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
        if (!dniInputValue) return alert('no se puede enviar un dni vacío');

        sendDni(dniInputValue, numeroTurno)
        // console.log(`este es el dni que se le pasa a la funcion sendDni: ${dni}, y este es el nrode turno ${numeroTurno}`)
        setDniInputValue('')
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
    // const handlePrintTurnoDni = () => {
    //     printJS({ printable: 'turnoDniToPrint', type: 'html', font_size: '90pt' });
    // }

    const handlePrintTurnoDni = () => {


        try {
            printJS({
                printable: 'turnoDniToPrint',
                type: 'html',
                font_size: '90pt',
                onError: (error) => {
                    console.error('Print error:', error);
                    setPrintError('No hay papel, consultar con personal de la institución.');
                }
            });
        } catch (error) {
            console.error('Print exception:', error);
            setPrintError('No hay papel, consultar con personal de la institución.');
        }
    };

    // const handleChange = (e) => {
    //     setDni(e.target.value)
    // }

    const handleKeyPress = (key) => {
        //Esta funcion, llena el dniInputValue con cada numero que agrega el usuario, y ademas llena el "value del formulario, por lo que se ira mostrando en el input los numerso que se vayan cliqueando. (Lo que se hacia antes era con el handlechange del input se llenaba el state "dni" y ese state luego se enviaba al servidor. Ahora enviaremos el state "dniInputValue")

        if (key === '←') {
            setDniInputValue(dniInputValue.slice(0, -1));
        } else if (key === '✓') {
            return;
        } else {
            setDniInputValue(dniInputValue + key);
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
            {printError && <div style={{ color: 'red' }}>{printError}</div>}
            {
                !showTramites ?
                    <>

                        <div className='  m-auto w-auto '>

                            <form action="#" method="post" onSubmit={handleSubmit} className=' lg:w-2/3 lg:m-auto lg:mt-16 bg-cv-verde-oscuro py-3 rounded-xl   '>
                                <label htmlFor="InputDocumento" className='text-center block text-white text-4xl '>INGRESE SU DNI:</label>
                                <input
                                    className='block w-2/3 m-auto lg:text-5xl lg:rounded-xl   text-center p-1 mt-2 bg-cv-celeste-claro'
                                    type="Text"
                                    id="InputDocumento"
                                    name="dni"
                                    value={dniInputValue}
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

                        {/* <Tramites handlePrintTurnoDni={handlePrintTurnoDni} handleShowTramites={handleShowTramites} /> */}
                        {/* <button onClick={handlePrintTurnoDni}>IMPRIMIR </button> */}
                        <h1 >Bienvenido a la Municipalidad de Rawson</h1>
                        <h2>Tome asiento y será llamado por la pantalla</h2>
                        <button onClick={()=>setShowTramites(false)}>Volver</button>
                        {/* <button onClick={()=>setShowTramites(false)}>Reset show tramites</button> */}

                    </>
            }

            {
                actualUserTurnoDni !== null && <h1 id='turnoDniToPrint' style={{ color: 'blue', textAlign: "center" }} >TURNO: {actualUserTurnoDni.nroTurno} - DNI: {actualUserTurnoDni.dni}</h1>
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
