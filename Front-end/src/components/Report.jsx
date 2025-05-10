import React from 'react'
import { IoSearchOutline } from 'react-icons/io5'
import { TbHttpDelete } from 'react-icons/tb'

const Report = () => {
  return (
    <section className='h-[calc(100vh-100px)] flex flex-col gap-3'>
      <article className='flex'>
        <nav className='flex-1 flex gap-3'>
          <label htmlFor="page">Page</label>
          <select name="page" id="page" className='bg-gray-50 outline-0 p-1 rounded-md ml-2'>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </nav>
        <nav className='flex gap-5'>
          <div className=' relative bg-gray-50 p-1 rounded-md'>
            <label htmlFor="search" className=' absolute left-1 top-2 text-gray-500'><IoSearchOutline /></label>
            <input className='ml-5 outline-0' type="text" name='search' placeholder='Search item' />
          </div>
          <div>
            <select name="category" id="category" className='bg-gray-50 outline-0 p-1 rounded-md'>
              <option value="all" selected>All</option>
              <option value="cold_brow">Cold Brow</option>
              <option value="late">Late</option>
            </select>
          </div>
        </nav>
      </article>
      <table className=' table-auto'>
        <thead className='bg-[#6f4e37] text-white'>
          <tr>
            <th className='text-start p-2'>#</th>
            <th className='text-start'>Code</th>
            <th className='text-start'>Name</th>
            <th className='text-start'>Category</th>
            <th className='text-start'>Price</th>
            <th className='text-start'>Action</th>
          </tr>
        </thead>
        <tbody className='bg-white'>
          <tr className='border-y border-gray-300'>
            <td className='p-2'>1</td>
            <td>124%23defd</td>
            <td>Hot Late</td>
            <td>Late</td>
            <td>$2.00</td>
            <td><TbHttpDelete className='mx-auto text-xl text-red-600'/></td>
          </tr>
          <tr className='border-y border-gray-300'>
            <td className='p-2'>2</td>
            <td>124%23defd</td>
            <td>Hot Late</td>
            <td>Late</td>
            <td>$2.00</td>
            <td><TbHttpDelete className='mx-auto text-xl text-red-600'/></td>
          </tr>
        </tbody>
      </table>
    </section>
  )
}

export default Report