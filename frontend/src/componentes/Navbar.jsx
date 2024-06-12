import React from 'react'

import logoMuni from '../assets/logoMuni.png'
import lanuevacapi from '../assets/lanuevacap.png'
export const Navbar = () => {
    return (
        <section className='bg-custom-gradient h-25 lg:flex lg:justify-between lg:p-2 lg:shadow-2xl'  >
            <div className='lg:flex lg:items-center lg:justify-center lg:ml-4'>
                <img src={logoMuni} alt="logo-muni" className='lg:w-[65px]  '/>
                <p className='lg:ml-3 lg:text-lg'>
                Municipalidad de Rawson
                </p>
                </div>
        <div>
            <img src={lanuevacapi} alt="lanuevacapital" className='lg:w-[65px] '/>
        </div>
        </section>
    )
}
