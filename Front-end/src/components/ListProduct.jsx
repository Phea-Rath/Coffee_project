import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { IoSearchOutline } from 'react-icons/io5'
import { TbHttpDelete } from 'react-icons/tb'
import { Link, useNavigate } from 'react-router'
import BASE_URL from '../Services/Base_Url'
import { FiEdit3 } from 'react-icons/fi'

const ListProduct = () => {
  const navigator = useNavigate();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const accountId = localStorage.getItem("accountId");

  // Get unique categories for dropdown
  const categories = ['all', ...new Set(products?.map(product => product.category))];

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await axios(BASE_URL + "/products");
        setProducts(response.data.data);
        setFilteredProducts(response.data.data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchProducts();
  }, []);

  // Apply filters whenever search term, category, or products change
  useEffect(() => {
    let result = products;
    
    // Apply category filter
    if (selectedCategory !== 'all') {
      result = result.filter(product => product.category === selectedCategory);
    }
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(product => 
        product.name.toLowerCase().includes(term) || 
        product.code.toLowerCase().includes(term))
    }
    
    setFilteredProducts(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, selectedCategory, products]);

  // Get current products for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredProducts?.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts?.length / itemsPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle items per page change
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };

  async function handleRemoved(id) {
    const filter = filteredProducts.filter((item) => item.id !== id);
    console.log(filter);
    setFilteredProducts(filter)
    try {
      const response = await axios.delete(BASE_URL + `/products/${id}`);
      if (response.data.data.status == 200) {
        alert(response.data.data.message);
        setFilteredProducts(filter);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <section className='h-[calc(100vh-100px)] flex flex-col gap-3'>
      <article className='flex'>
        <nav className='flex-1 flex gap-3'>
          {accountId==1?<Link to="/admin/add-product">
            <button className='bg-green-600 px-2 py-1 text-white rounded-sm'>+ Add New</button>
          </Link>:""}
          <div>
            <label htmlFor="page">Items per page</label>
            <select 
              name="page" 
              id="page" 
              className='bg-gray-50 outline-0 p-1 rounded-md ml-2'
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>
        </nav>
        <nav className='flex gap-5'>
          <div className='relative bg-gray-50 p-1 rounded-md'>
            <label htmlFor="search" className='absolute left-1 top-2 text-gray-500'>
              <IoSearchOutline />
            </label>
            <input 
              className='ml-5 outline-0' 
              type="text" 
              name='search' 
              placeholder='Search item' 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <select 
              name="category" 
              id="category" 
              className='bg-gray-50 outline-0 p-1 rounded-md'
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((category, index) => (
                <option key={index} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1).replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>
        </nav>
      </article>
      
      <div className='flex-1 overflow-auto'>
        <table className='table-auto w-full'>
          <thead className='bg-[#6f4e37] text-white sticky top-0'>
            <tr>
              <th className='text-start p-2'>#</th>
              <th className='text-start'>Code</th>
              <th className='text-start'>Name</th>
              <th className='text-start'>Category</th>
              <th className='text-start'>Price</th>
              {accountId==1?<th className='text-start'>Action</th>:""}
            </tr>
          </thead>
          <tbody className='bg-white'>
            {currentProducts?.length > 0 ? (
              currentProducts.map((item, index) => (
                <tr key={index} className='border-y border-gray-300'>
                  <td className='p-2'>{indexOfFirstItem + index + 1}</td>
                  <td>{item.code}</td>
                  <td>{item.name}</td>
                  <td>{item.category}</td>
                  <td>${item.unit_price}</td>
                  {accountId==1?<td className='flex'>
                    <TbHttpDelete onClick={() => handleRemoved(item.id)} className='mx-auto text-xl text-red-600 cursor-pointer' />
                    <FiEdit3
                      onClick={() => {
                        accountId == 2
                          ? navigator(`/Staff/edit-product/${item.id}`)
                          : navigator(`/Admin/edit-product/${item.id}`)
                      }}
                      className='mx-auto cursor-pointer text-xl text-blue-600'
                    />
                  </td>:""}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4">No products found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination controls */}
      <div className='flex justify-between items-center mt-2'>
        <div>
          Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredProducts?.length)} of {filteredProducts?.length} entries
        </div>
        <div className='flex gap-2'>
          <button 
            onClick={() => paginate(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded ${currentPage === 1 ? 'bg-gray-200 cursor-not-allowed' : 'bg-[#6f4e37] text-white'}`}
          >
            Previous
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
            <button
              key={number}
              onClick={() => paginate(number)}
              className={`px-3 py-1 rounded ${currentPage === number ? 'bg-[#6f4e37] text-white' : 'bg-gray-200'}`}
            >
              {number}
            </button>
          ))}
          
          <button 
            onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded ${currentPage === totalPages ? 'bg-gray-200 cursor-not-allowed' : 'bg-[#6f4e37] text-white'}`}
          >
            Next
          </button>
        </div>
      </div>
    </section>
  )
}

export default ListProduct