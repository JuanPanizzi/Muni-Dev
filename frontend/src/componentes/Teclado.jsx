// OnScreenKeyboard.js
import React from 'react';
// import './Teclado.css';

const keys = [
  ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
  ['H', 'I', 'J', 'K', 'L', 'M', 'N'],
  ['O', 'P', 'Q', 'R', 'S', 'T', 'U'],
  ['V', 'W', 'X', 'Y', 'Z', '←', '✓' ],
  [' ']
];

 const Teclado = ({ onKeyPress }) => {
  // return (
  //   <div className=" mt-3">
  //     {keys.map((row, rowIndex) => (
  //       <div key={rowIndex} className="w-2/3  m-auto ">
  //         <div className='px-2 pt-1 m-auto grid  grid-cols-3 gap-2 '>

  //         {row.map((key) => (
  //           <button 
  //           key={key}
  //           type={key === '✓' ? 'submit' : 'button'}
  //           className={`h-[60px] mb-2 rounded-xl text-2xl  ${key === '✓' ? 'bg-green-400' : key === '←' ? 'bg-red-400' : 'bg-cv-celeste-claro'}`}
  //           onClick={() => onKeyPress(key)}
  //           >
  //             {key}
  //           </button>
  //         ))}
  //     </div>
  //       </div>
  //     ))}
  //   </div>
  // );
  return (
    <div className="mt-3">
    {keys.map((row, rowIndex) => (
      <div key={rowIndex} className="w-2/3 m-auto">
        <div className={`px-2 pt-1 m-auto grid ${rowIndex === keys.length - 1 ? 'grid-cols-2' : 'grid-cols-7'} gap-2`}>
          {row.map((key) => (
            <button 
              key={key}
              type={key === '✓' ? 'submit' : 'button'}
              className={`h-[60px] mb-2 rounded-xl text-2xl ${
                key === '✓' ? 'bg-green-400' : key === '←' ? 'bg-red-400' : key === ' ' ? 'col-span-6 bg-white' : 'text-cv-verde-oscuro bg-white'
              }`}
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