import React from 'react';

const PrintButton = () => {
  const handlePrint = () => {
    // Crea un iframe oculto
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);

    // Carga el contenido que deseas imprimir dentro del iframe
    iframe.contentDocument.write(`
      <html>
        <head>
          <title>Impresión</title>
        </head>
        <body>
          <div id="elementId">BK</div>
        </body>
      </html>
    `);

    // Imprime el contenido directamente sin mostrar el cuadro de diálogo de impresión
    iframe.contentWindow.print();

    // Elimina el iframe después de la impresión
    setTimeout(() => {
      document.body.removeChild(iframe);
    }, 1000); // Espera un segundo antes de eliminar el iframe para asegurar que se haya completado la impresión
  };

  return (
    <>
    <h1>PRUEBA DE IMPRESION CON IFRAME</h1>
    <button onClick={handlePrint}>Imprimir</button>
    </>
  );
};

export default PrintButton;
