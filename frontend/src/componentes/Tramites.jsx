import React, { useState } from 'react'

export const Tramites = ({handlePrintTurnoDni, handleShowTramites}) => {


   const [showImprimirTurno, setshowImprimirTurno] = useState(false); 
   const [imprimiendo, setImprimiendo] = useState(false); 

  const enviarImpresion = () => {
    // handlePrintTurnoDni()
    setImprimiendo(true)
  }



  return (
    <>
    {
        !showImprimirTurno ?

        <div className='bg-cv-verde-oscuro w-2/3 m-auto rounded-xl mt-16 p-5 text-center'>
            <h1 className='text-white text-3xl mt-2 mb-10'>¿QUÉ TRÁMITE DESEA REALIZAR?</h1>
        <ol>
            <li onClick={()=> setshowImprimirTurno(true)} className='bg-cv-celeste-claro mt-2 p-4 text-2xl rounded-xl hover:cursor-pointer hover:bg-cv-celeste-oscuro hover:text-white'>Impositiva</li>
            <li onClick={()=> setshowImprimirTurno(true)} className='bg-cv-celeste-claro mt-2 p-4 text-2xl rounded-xl hover:cursor-pointer hover:bg-cv-celeste-oscuro hover:text-white'>Ingresos Brutos</li>
            <li onClick={()=> setshowImprimirTurno(true)} className='bg-cv-celeste-claro mt-2 p-4 text-2xl rounded-xl hover:cursor-pointer hover:bg-cv-celeste-oscuro hover:text-white'>Comercio</li>
            <li onClick={()=> setshowImprimirTurno(true)} className='bg-cv-celeste-claro mt-2 p-4 text-2xl rounded-xl hover:cursor-pointer hover:bg-cv-celeste-oscuro hover:text-white'>Automotores</li>
        </ol>
    </div>
    :
    <>

    <div className='bg-cv-verde-oscuro w-2/3 m-auto rounded-xl mt-16 p-5 text-center'>
        <h2 className='text-white text-3xl mt-2 mb-10'>IMPRIMA SU NÚMERO DE TURNO</h2>
        <button onClick={enviarImpresion} className='px-10 py-5 bg-cv-celeste-claro rounded-xl hover:bg-cv-celeste-oscuro '>IMPRIMIR</button>
    </div>
    {
    imprimiendo && 
    <div className='text-center mt-10'>
        <button onClick={()=> handleShowTramites(false)}  className='px-10 py-5 bg-cv-celeste-claro rounded-xl hover:bg-verde-oscuro '>VOLVER A INICIO</button>
    </div>
    }
    </>
}
    </>
  )
}
