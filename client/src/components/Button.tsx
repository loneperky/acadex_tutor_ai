import React from 'react'
import { useState } from 'react'
const Button = () => {

  const [count, setCount] = useState(0)
  return (
    <>
      <div className="flex justify-center items-center bg-gray-500">
        <div className="">
          <button onClick={(prev) => setCount(count + 1)} className='bg-white text-neutral-950 p-2 '>+</button>
          <h2 className='text-2xl' >{count}</h2>
        </div>
      </div>
    </>
  )
}

export default Button