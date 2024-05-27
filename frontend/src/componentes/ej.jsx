import React, { useState } from 'react'

export const Ej = () => {

const [hola, setHola] = useState(0)


const changeHola = ()=> {
    setHola(prevHola => prevHola + 1)
    console.log(hola)
} 

  return (
<>
    <h1>Hola </h1>
    <button onClick={changeHola}>change hola</button>
</>
  )
}
