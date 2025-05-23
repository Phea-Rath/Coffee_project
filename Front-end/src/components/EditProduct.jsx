import React, { useEffect, useState } from 'react'
import Logo from '../assets/logo.jpg'
import axios from 'axios';
import BASE_URL from '../Services/Base_Url';
import { useNavigate, useParams } from 'react-router';
import { useOutletContext } from '../Layout/ManagementLayout';
import { Box, CircularProgress } from '@mui/material';
const EditProduct = () => {
  const { setChildValue } = useOutletContext();
  const { id } = useParams();
  const navigator = useNavigate();
  const [Data, setData] = useState({});
  const [viewImage, setViewImage] = useState(null);
  const [wait, setWait] = useState(false);
  const user_id = localStorage.getItem("user_id");

  useEffect(() => {
    async function fetchProduct(params) {
      try {
        const response = await axios.get(BASE_URL + `/products/${params}`);
        if (response.data.status == 200) {
          setData({ ...response.data.data, imageFile: null });
          setViewImage(response.data.data.image || null)
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchProduct(id);
  }, []);
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setData(prev => ({ ...prev, imageFile: file }));
    setViewImage(URL.createObjectURL(file));

  };
  const handleChange = (e) => {
    setData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }
  async function handleSubmit() {
    if (!Data.code || !Data.name || !Data.image || !Data.category || !Data.unit_price) {
      setChildValue({status:3,alertMessage:"Missing require!, Please input data in field!"})
      return;
    }
    setWait(true);
    const formData = new FormData();
    formData.append("user_id", user_id);
    formData.append("code", Data.code);
    formData.append("name", Data.name);
    formData.append("image", Data.imageFile);
    formData.append("category", Data.category);
    formData.append("price", Data.unit_price);
    try {
      const response = await axios.post(BASE_URL + `/product/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.data.status == 200) {
        setChildValue({ status: 1, alertMessage: "Product updated successfully" });
        setWait(false);
        navigator('/admin/list-product');
      }
    } catch (error) {
      setChildValue({ status: 2, alertMessage: "Product update fail" });
      setWait(false);
    }
    
  }
  return (
    <section className='h-[calc(100vh-100px)] px-3'>
      <Box sx={{ display: 'flex' }} className={` absolute top-0 left-0 bg-gray-400 w-[100vw] h-[100vh] transition-all duration-500 ease-in-out justify-center items-center ${wait?'z-40 opacity-50':'-z-40 opacity-0'}`}>
        <CircularProgress />
      </Box>
      <h1>Update Product</h1>
      <article className='bg-white rounded-md p-3 flex flex-col gap-5 mt-3'>
        <nav className='flex items-center flex-col gap-3'>
          <div className=' overflow-hidden rounded-full'>
            <img className='w-[100px]' src={Logo} alt="" />
          </div>
          <h2 className=' font-semibold'>COFFEE HOME</h2>
        </nav>
        <nav className='flex gap-10 md:px-10'>
          <div className='flex-1'>
            <label htmlFor="code" className='text-gray-500 mb-3'>Code</label> <br />
            <input onChange={handleChange} value={Data.code} type="text" name='code' className='border border-gray-300 p-2 rounded-lg outline-0 w-full' />
          </div>
          <div className='flex-1'>
            <label htmlFor="name" className='text-gray-500 mb-3'>Name Product</label> <br />
            <input onChange={handleChange} value={Data.name} type="text" name='name' className='border border-gray-300 p-2 rounded-lg outline-0 w-full' />
          </div>
        </nav>
        <nav className='flex gap-10 md:px-10'>
          <div className='flex-1'>
            <label htmlFor="category" className='text-gray-500 mb-3'>Category</label> <br />
            <input onChange={handleChange} value={Data.category} type="text" name='category' className='border border-gray-300 p-2 rounded-lg outline-0 w-full' />
          </div>
          <div className='flex-1'>
            <label htmlFor="unit_price" className='text-gray-500 mb-3'>Price</label> <br />
            <input onChange={handleChange} value={Data.unit_price} type="text" name='unit_price' className='border border-gray-300 p-2 rounded-lg outline-0 w-full' />
          </div>
        </nav>
        <nav className='md:px-10 flex justify-between items-end'>
          <div>
            <label htmlFor="img"><img style={{ maxWidth: 'auto', height: '150px' }}  src={viewImage??"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKDvbGs5KSuVIll5qLjRALjnTvXletu7aiVQ&s"} alt="" /></label>
            <input type="file" onChange={handleFileChange} name="img" id="img" className='hidden' />
          </div>
          <div>
            <button onClick={handleSubmit} className='bg-green-600 px-5 py-1 rounded-md text-white'>Add Product</button>
          </div>
        </nav>
      </article>
    </section>
  )
}

export default EditProduct
