const keys = [
  ['A', 'B', 'C', 'D', 'E', 'F'],
  ['G', 'H', 'I', 'J', 'K', 'L'],
  ['M', 'N', 'Ñ', 'O', 'P', 'Q'],
  ['R', 'S', 'T', 'U', 'V', 'W'],
  ['X', 'Y', 'Z', '-' ,'←', '✓'],
  [' '] // Fila dedicada para la tecla de espacio
];

const Teclado = ({ onKeyPress }) => {
  return (
    <div className="mt-3">
      {keys.map((row, rowIndex) => (
        <div key={rowIndex} className="w-full m-auto px-10">
          <div className={`px-2 pt-1 m-auto grid ${rowIndex === keys.length - 1 ? 'grid-cols-6' : 'grid-cols-6'} gap-2`}>
            {row.map((key) => (
              <button 
                key={key}
                type={key === '✓' ? 'submit' : 'button'}
                className={`h-16 mb-2 rounded-xl text-3xl ${
                  key === '✓' ? 'col-span-1 bg-green-400 shadow-lg border border-black  font-bold  text-4xl' : key === '←' ? 'shadow-lg col-span-1 bg-red-400 border border-black  text-5xl font-bold' : key === ' ' ? 'col-span-6 text-white border border-cv-verde-oscuro shadow-lg' : 'text-cv-verde-oscuro shadow-lg bg-white font-bold border border-cv-verde-oscuro'
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
