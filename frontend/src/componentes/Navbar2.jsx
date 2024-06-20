import React from 'react'

import logoMuni from '../assets/escudoMuni.webp'
import lanuevacapi from '../assets/lanuevacap.png'

export const Navbar2 = () => {
    return (
        <section className='bg-cv-celeste-claro h-25 lg:flex lg:justify-between lg:p-2  '  >
            <div className='lg:flex lg:items-center lg:justify-center lg:ml-4'>
                <img src={logoMuni} alt="logo-muni" className='lg:w-[65px]  '/>
                <p className='lg:ml-3 lg:text-lg'>
                Municipalidad de Rawson
                </p>
                </div>
        <div className='lg:mr-4 flex items-center'>
            {/* <img src={lanuevacapi} alt="lanuevacapital" className='lg:w-[65px] '/> */}
            <p>13:05</p> 
        </div>
        </section>
    )
}
