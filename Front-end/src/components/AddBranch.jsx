import React, { useState } from 'react'
import Logo from '../assets/logo.jpg'
import axios from 'axios';
import BASE_URL from '../Services/Base_Url';
import { useNavigate } from 'react-router';
const AddBranch = () => {
  const navigator = useNavigate();
  const [Data, setData] = useState({});
  const handleChange = (e) => {
    setData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }
  async function handleSubmit() {
    console.log(Data);
    if (!Data.location && !Data.name) {
      alert("Please input data");
      return;
    }
    const formData = new FormData();
    formData.append("name", Data.name);
    formData.append("location", Data.location);
    try {
      const response = await axios.post(BASE_URL + "/branchs", formData);
      alert(response.data.message);
      navigator('/admin/list-branch');
    } catch (error) {
      alert("Error:", error)
    }
    
  }
  return (
    <section className='h-[calc(100vh-100px)] px-3'>
      <h1>Add New Branch</h1>
      <article className='bg-white rounded-md p-3 flex flex-col gap-5 mt-3'>
        <nav className='flex items-center flex-col gap-3'>
          <div className=' overflow-hidden rounded-full'>
            <img className='w-[100px]' src={Logo} alt="" />
          </div>
          <h2 className=' font-semibold'>COFFEE HOME</h2>
        </nav>
        <nav className='flex gap-10 md:px-10'>
          <div className='flex-1'>
            <label htmlFor="name" className='text-gray-500 mb-3'>Name Branch</label> <br />
            <input onChange={handleChange} value={Data.name} type="text" name='name' className='border border-gray-300 p-2 rounded-lg outline-0 w-full' />
          </div>
          <div className='flex-1'>
            <label htmlFor="location" className='text-gray-500 mb-3'>location</label> <br />
            <input onChange={handleChange} value={Data.location} type="text" name='location' className='border border-gray-300 p-2 rounded-lg outline-0 w-full' />
          </div>
        </nav>
        <nav className='md:px-10 flex justify-between items-end'>
          <div>
            <button onClick={handleSubmit} className='bg-green-600 px-5 py-1 rounded-md text-white'>Add Branch</button>
          </div>
        </nav>
      </article>
    </section>
  )
}

export default AddBranch