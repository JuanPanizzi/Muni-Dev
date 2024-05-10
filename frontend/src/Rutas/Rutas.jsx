import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Pantalla } from '../componentes/Pantalla'
import { Home } from '../componentes/Home'
import { Box } from '../componentes/Box'
// import PrintButton from '../componentes/PrintButton'

export const Rutas = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='https://municipalidad-client.vercel.app' element={<Home />} />

        <Route path='/pantalla' element={<Pantalla />} />
        {/* <Route path='/print' element={<PrintButton />} /> */}
        <Route path='/box/:BoxId' element={<Box />} />
        
      </Routes>
    </BrowserRouter>
  )
}
