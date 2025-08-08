import React from 'react'

interface feature {
  img: string,
  title: string,
  sub: string
}

const Feature = ({ img, title, sub }: feature) => {
  return (
    <>
      <div className="border p-4 cursor-pointer border-gray-500 rounded-2xl text-gray-100 hover:border-green-600 bg-gray- hover:text-green-500">
        <div className="">
          <p className='border-1 w-fit rounded-2xl p-4'>{img}</p>
        </div>
        <div className="title py-4">
          <h1 className='py-6 text-3xl font-bold'>{title}</h1>
          <p>{sub}</p>
        </div>
      </div>
    </>
  )
}

export default Feature