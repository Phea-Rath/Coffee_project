import React, { useState } from 'react'
import Logo from '../assets/logo.jpg'
import axios from 'axios';
import BASE_URL from '../Services/Base_Url';
import { useNavigate } from 'react-router';
const AddProduct = () => {
  const navigator = useNavigate();
  const [Data, setData] = useState({});
  const [viewImage, setViewImage] = useState(null);
  const user_id = sessionStorage.getItem("accountId");
  console.log(user_id)
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setData(prev => ({ ...prev, image: file }));
    setViewImage(URL.createObjectURL(file));

  };
  const handleChange = (e) => {
    setData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }
  async function handleSubmit() {
    // console.log(Data);
    if (!Data.code && !Data.name && !Data.image && !Data.category && !Data.price) {
      alert("Please input data");
      return;
    }
    const formData = new FormData();
    formData.append("user_id", user_id);
    formData.append("code", Data.code);
    formData.append("name", Data.name);
    formData.append("image", Data.image);
    formData.append("category", Data.category);
    formData.append("price", Data.price);
    try {
      const response = await axios.post(BASE_URL + "/products", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert(response.data.message);
      navigator('/admin/list-product');
    } catch (error) {
      alert("Error:", error)
    }
    
  }
  return (
    <section className='h-[calc(100vh-100px)] px-3'>
      <h1>Add New Product</h1>
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
            <label htmlFor="price" className='text-gray-500 mb-3'>Price</label> <br />
            <input onChange={handleChange} value={Data.price} type="text" name='price' className='border border-gray-300 p-2 rounded-lg outline-0 w-full' />
          </div>
        </nav>
        <nav className='md:px-10 flex justify-between items-end'>
          <div>
            <label htmlFor="img"><img style={{ maxWidth: 'auto', height: '150px' }}  src={viewImage||"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKDvbGs5KSuVIll5qLjRALjnTvXletu7aiVQ&s"} alt="" /></label>
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

export default AddProduct