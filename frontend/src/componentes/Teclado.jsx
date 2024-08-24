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
        <div key={rowIndex} className="w-full m-auto px-2 sm:px-4 md:px-8 lg:px-10">
          <div className={`px-2 pt-1 m-auto grid ${rowIndex === keys.length - 1 ? 'grid-cols-6' : 'grid-cols-6'} gap-2`}>
            {row.map((key) => (
              <button
                key={key}
                type={key === '✓' ? 'submit' : 'button'}
                className={`h-12 sm:h-14 md:h-16 lg:h-16 mb-2 rounded-xl text-xl sm:text-2xl md:text-3xl lg:text-4xl ${
                  key === '✓'
                    ? 'col-span-1 bg-green-400 shadow-lg border border-black text-lg sm:text-xl md:text-2xl lg:text-4xl font-medium'
                    : key === '←'
                    ? 'shadow-lg col-span-1 bg-red-400 border border-black text-lg sm:text-xl md:text-2xl lg:text-4xl font-medium'
                    : key === ' '
                    ? 'col-span-6 text-white border border-cv-verde-oscuro shadow-lg font-medium'
                    : 'text-cv-verde-oscuro shadow-lg bg-white border border-cv-verde-oscuro font-medium'
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
