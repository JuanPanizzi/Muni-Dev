// Prueba.js
import React, { useState } from 'react';
import OnScreenKeyboard from './OnScreenKeyboard';

const Prueba = () => {
  const [dni, setDni] = useState('');

  const handleKeyPress = (key) => {
    if (key === '←') {
      setDni(dni.slice(0, -1));
    } else if (key === '✓') {
      alert(`DNI ingresado: ${dni}`);
    } else {
      setDni(dni + key);
    }
  };

  const handleChange = (e) => {

    console.log(e.target.value);

  }

  return (
    <div>
      <form>
        <label htmlFor="dni">Ingrese su DNI:</label>
        <input
          type="text"
          id="dni"
          value={dni}
          readOnly
          onClick={() => document.getElementById('keyboard').style.display = 'block'}
        />
      </form>
      <div id="keyboard">
        <OnScreenKeyboard onKeyPress={handleKeyPress} />
      </div>
    </div>
  );
};

export default Prueba;
