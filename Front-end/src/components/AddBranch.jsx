import React, { useState } from 'react'
import Logo from '../assets/logo.jpg'
import axios from 'axios';
import BASE_URL from '../Services/Base_Url';
import { useNavigate } from 'react-router';
import { Box, CircularProgress } from '@mui/material';
const AddBranch = () => {
  const navigator = useNavigate();
  const [childValue,setChildValue ] = useState();
  const [Data, setData] = useState({});
  const [wait, setWait] = useState(false);
  const handleChange = (e) => {
    setData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }
  async function handleSubmit() {
    if (!Data.location && !Data.name) {
      alert("Please input data");
      return;
    }
    setWait(true);
    const formData = new FormData();
    formData.append("name", Data.name);
    formData.append("location", Data.location);
    try {
      const response = await axios.post(BASE_URL + "/branchs", formData);
      setChildValue({ status: 1, alertMessage: response.data.message });
      setWait(false);
      setTimeout(() => setChildValue({ status: 0, alertMessage: "" }), 2000);
      navigator('/admin/list-branch');
    } catch (error) {
      setWait(false);
      setChildValue({ status: 2, alertMessage: "Branch add fail! > " + error });
      setTimeout(() => setChildValue({ status: 0, alertMessage: "" }), 5000);
    }
    
  }
  return (
    <section className='h-[calc(100vh-100px)] px-3'>
      {/* Success Alert */}
      <div className={`absolute top-3 shadow-current shadow-lg shadow-green-500/20 left-3 right-3 transition-all duration-500 ease-in-out ${
        childValue.status === 1 ? 'opacity-100 z-50 translate-y-0' : 'opacity-0 -z-50 -translate-y-8'
      }`}>
        <Alert severity="success" className="border border-green-600 shadow-md">
          <AlertTitle>Success</AlertTitle>
          {renderAlertMessage(childValue?.alertMessage)}
        </Alert>
      </div>

      {/* Error Alert */}
      <div className={`absolute top-3 shadow-current shadow-lg shadow-red-500/20 left-3 right-3 transition-all duration-500 ease-in-out ${
        childValue?.status === 2 ? 'opacity-100 z-50 translate-y-0' : 'opacity-0 -z-50  -translate-y-8'
      }`}>
        <Alert severity="error" className="border border-red-600 shadow-md">
          <AlertTitle>Error</AlertTitle>
          {renderAlertMessage(childValue?.alertMessage)}
        </Alert>
      </div>
      {/* Warning Alert */}
      <div className={`absolute top-3 shadow-current shadow-lg shadow-yellow-500/20 left-3 right-3 transition-all duration-500 ease-in-out ${
        childValue?.status === 3 ? 'opacity-100 z-50 translate-y-0' : 'opacity-0 -z-50  -translate-y-8'
      }`}>
        <Alert severity="warning" className="border border-yellow-600 shadow-md">
          <AlertTitle>Warning</AlertTitle>
          {renderAlertMessage(childValue?.alertMessage)}
        </Alert>
      </div>
      <Box sx={{ display: 'flex' }} className={` absolute top-0 left-0 bg-gray-400 w-[100vw] h-[100vh] transition-all duration-500 ease-in-out justify-center items-center ${wait?'z-40 opacity-50':'-z-40 opacity-0'}`}>
        <CircularProgress />
      </Box>
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