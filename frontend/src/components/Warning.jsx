import React from 'react'

export const Warning = ({warn}) => {
  return (
    <div className='bg-red-200 rounded-xl m-auto mt-10 text-xl text-center w-2/3  h-16'>
        <h1 className='my-auto'>
        {warn}
        </h1>
        </div>
  )
}
