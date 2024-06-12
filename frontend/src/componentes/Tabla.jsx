import React from 'react'

export const Tabla = () => {


  return (
    <>
    
   {/*
  Heads up! 👋

  This component comes with some `rtl` classes. Please remove them if they are not needed in your project.
*/}

<div className="overflow-x-auto rounded-lg border border-gray-200">
  <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
    <thead className="ltr:text-left rtl:text-right">
      <tr>
        <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">TURNO</th>
        <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">DNI</th>
        <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">BOX</th>
      </tr>
    </thead>

    <tbody className="divide-y divide-gray-200">
      <tr>
        <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">John Doe</td>
        <td className="whitespace-nowrap px-4 py-2 text-gray-700">24/05/1995</td>
        <td className="whitespace-nowrap px-4 py-2 text-gray-700">Web Developer</td>
      </tr>

      <tr>
        <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Jane Doe</td>
        <td className="whitespace-nowrap px-4 py-2 text-gray-700">04/11/1980</td>
        <td className="whitespace-nowrap px-4 py-2 text-gray-700">Web Designer</td>
      </tr>

      <tr>
        <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Gary Barlow</td>
        <td className="whitespace-nowrap px-4 py-2 text-gray-700">24/05/1995</td>
        <td className="whitespace-nowrap px-4 py-2 text-gray-700">$20,000</td>
      </tr>
    </tbody>
  </table>
</div>
    
    
    </>
  )
}
