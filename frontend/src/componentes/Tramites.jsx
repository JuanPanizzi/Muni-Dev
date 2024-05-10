import React, { useState } from 'react'
import '../styles/Tramites.css'

export const Tramites = ({handlePrintTurnoDni}) => {


   const [showImprimirTurno, setshowImprimirTurno] = useState(false) 



  return (
    <>
    {
        !showImprimirTurno ?

        <div className='ctnTramites'>
            <h1>¿Qué trámite desea realizar?</h1>
        <ol>
            <li onClick={()=> setshowImprimirTurno(true)}>Impositiva</li>
            <li onClick={()=> setshowImprimirTurno(true)}>Ingresos Brutos</li>
            <li onClick={()=> setshowImprimirTurno(true)}>Comercio</li>
            <li onClick={()=> setshowImprimirTurno(true)}>Automotores</li>
        </ol>
    </div>
    :
    <div className='ctnImprimirTurno'>
        <h2>Imprima su número de turno</h2>
        <button onClick={handlePrintTurnoDni} className='btnTramites'>Imprimir</button>
    </div>
}
    </>
  )
}
