// OnScreenKeyboard.js
import React from 'react';
import './Teclado.css';

const keys = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['0', '←', '✓']
];

 const Teclado = ({ onKeyPress }) => {
  return (
    <div className="keyboard">
      {keys.map((row, rowIndex) => (
        <div key={rowIndex} className="keyboard-row">
          {row.map((key) => (
            <button 
              key={key}
              className="keyboard-key"
              onClick={() => onKeyPress(key)}
            >
              {key}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Teclado;