import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { IoSearchOutline, IoChevronBack, IoChevronForward } from 'react-icons/io5'
import { TbHttpDelete } from 'react-icons/tb'
import { Link } from 'react-router'
import BASE_URL from '../Services/Base_Url'

const ListBranch = () => {
  const [branches, setBranches] = useState([]);
  const [filteredBranches, setFilteredBranches] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function fetchBranches() {
      try {
        const response = await axios(BASE_URL + "/branchs");
        setBranches(response.data.data);
        setFilteredBranches(response.data.data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchBranches();
  }, []);

  // Handle search functionality
  useEffect(() => {
    const results = branches.filter(branch =>
      branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      branch.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredBranches(results);
    setCurrentPage(1); // Reset to first page when searching
  }, [searchTerm, branches]);

  // Handle items per page change
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  // Handle remove branch
  async function handleRemove(id) {
    const filtered = branches.filter((item) => item.id !== id);
    try {
      const response = await axios.delete(BASE_URL + `/branchs/${id}`);
      if (response.data.status === 200) {
        setBranches(filtered);
        setFilteredBranches(filtered);
        alert("Branch deleted successfully");
      }
    } catch (error) {
      console.log(error);
    }
  }

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredBranches.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredBranches.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <section className='h-[calc(100vh-100px)] flex flex-col gap-3 p-4'>
      <article className='flex flex-col md:flex-row justify-between gap-4 mb-4'>
        <nav className='flex flex-wrap gap-3'>
          <Link to="/admin/add-branch">
            <button className='bg-green-600 px-4 py-2 text-white rounded-md hover:bg-green-700 transition'>
              + Add New Branch
            </button>
          </Link>
          <div className='flex items-center'>
            <label htmlFor="page" className='mr-2 text-gray-700'>Items per page:</label>
            <select 
              name="page" 
              id="page" 
              className='bg-gray-50 border border-gray-300 outline-0 p-1 rounded-md'
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>
        </nav>
        <nav className='flex gap-3'>
          <div className='relative bg-gray-50 border border-gray-300 rounded-md flex items-center'>
            <IoSearchOutline className='absolute left-3 text-gray-500' />
            <input 
              className='pl-10 pr-4 py-2 outline-0 bg-transparent w-full'
              type="text" 
              placeholder='Search branches...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </nav>
      </article>

      <div className='overflow-x-auto bg-white rounded-lg shadow'>
        <table className='min-w-full divide-y divide-gray-200'>
          <thead className='bg-[#6f4e37]'>
            <tr>
              <th className='px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider'>#</th>
              <th className='px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider'>Name</th>
              <th className='px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider'>Location</th>
              <th className='px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider'>Action</th>
            </tr>
          </thead>
          <tbody className='bg-white divide-y divide-gray-200'>
            {currentItems.length > 0 ? (
              currentItems.map((item, index) => (
                <tr key={item.id} className='hover:bg-gray-50'>
                  <td className='px-6 py-4 whitespace-nowrap'>{indexOfFirstItem + index + 1}</td>
                  <td className='px-6 py-4 whitespace-nowrap'>{item.name}</td>
                  <td className='px-6 py-4 whitespace-nowrap'>{item.location}</td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <button 
                      onClick={() => handleRemove(item.id)}
                      className='text-red-600 hover:text-red-800 transition'
                      title='Delete branch'
                    >
                      <TbHttpDelete className='text-xl' />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className='px-6 py-4 text-center text-gray-500'>
                  No branches found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination controls */}
      {filteredBranches.length > 0 && (
        <div className='flex items-center justify-between mt-4'>
          <div className='text-sm text-gray-700'>
            Showing <span className='font-medium'>{indexOfFirstItem + 1}</span> to{' '}
            <span className='font-medium'>{Math.min(indexOfLastItem, filteredBranches.length)}</span> of{' '}
            <span className='font-medium'>{filteredBranches.length}</span> branches
          </div>
          <div className='flex gap-2'>
            <button
              onClick={() => paginate(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded-md ${currentPage === 1 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-[#6f4e37] text-white hover:bg-[#5a3d2a]'}`}
            >
              <IoChevronBack />
            </button>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              // Show pages around current page
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              
              return (
                <button
                  key={pageNum}
                  onClick={() => paginate(pageNum)}
                  className={`px-3 py-1 rounded-md ${currentPage === pageNum ? 'bg-[#6f4e37] text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded-md ${currentPage === totalPages ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-[#6f4e37] text-white hover:bg-[#5a3d2a]'}`}
            >
              <IoChevronForward />
            </button>
          </div>
        </div>
      )}
    </section>
  )
}

export default ListBranch