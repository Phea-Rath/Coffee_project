import React from 'react'
import Header from './Header'
import { Outlet } from 'react-router'

const ManagementLayout = () => {
  return (
    <section>
      <header>
        <Header/>
      </header>
      <main className='p-3 bg-[#efe5de]'>
        <Outlet/>
      </main>
    </section>
  )
}

export default ManagementLayout