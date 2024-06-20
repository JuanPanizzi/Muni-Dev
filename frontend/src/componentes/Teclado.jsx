// OnScreenKeyboard.js
import React from 'react';
// import './Teclado.css';

const keys = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['0', '←', '✓']
];

 const Teclado = ({ onKeyPress }) => {
  return (
    <div className=" mt-3">
      {keys.map((row, rowIndex) => (
        <div key={rowIndex} className="w-2/3  m-auto ">
          <div className='px-2 pt-1 m-auto grid  grid-cols-3 gap-2 '>

          {row.map((key) => (
            <button 
            key={key}
            type={key === '✓' ? 'submit' : 'button'}
            className={`h-[60px] mb-2 rounded-xl text-2xl  ${key === '✓' ? 'bg-green-400' : key === '←' ? 'bg-red-400' : 'bg-cv-celeste-claro'}`}
            onClick={() => onKeyPress(key)}
            >
              {key}
            </button>
          ))}
      </div>
        </div>
      ))}
    </div>
  );
  };

export default Teclado;