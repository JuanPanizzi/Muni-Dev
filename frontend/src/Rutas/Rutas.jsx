import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Pantalla3 } from '../componentes/Pantalla3'
import { Home } from '../componentes/Home'
import { Box } from '../componentes/Box'
import { HomeTeclado } from '../componentes/HomeTeclado'
// import Prueba from '../componentes/Prueba'
// import { Ej } from '../componentes/ej'
// import PrintButton from '../componentes/PrintButton'

export const Rutas = () => {
  
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path='/' element={<Prueba />} /> */}
        <Route path='/' element={<HomeTeclado />} />
        
        {/* <Route path='/' element={<Home />} /> */}
        {/* <Route path='/ej' element={<Ej />} /> */}
        <Route path='/pantalla' element={<Pantalla3 />} />
        {/* <Route path='/print' element={<PrintButton />} /> */}
        <Route path='/box/:BoxId' element={<Box />} />
        
      </Routes>
    </BrowserRouter>
  )
}
