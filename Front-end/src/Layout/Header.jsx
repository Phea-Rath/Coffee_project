import React, { useEffect, useState } from 'react'
import Logo from '../assets/logo.jpg'
import { TbReport } from "react-icons/tb";
import { FaStore } from "react-icons/fa";
import { FcAbout } from "react-icons/fc";
import { IoMdArrowDropdown } from "react-icons/io";
import { Link, NavLink, useNavigate } from 'react-router';
import { useAuth } from '../Routers/AuthContext';
const Header = () => {
  const { logout } = useAuth();
  const navigator = useNavigate();
  const [accountId, setAccountId] = useState(0);
  const [drop,setDrop] = useState(false)
  useEffect(() => {
    setAccountId(localStorage.getItem("accountId"));
  }, []);
  let path = null;
  if (accountId == 1) {
    path = "/Admin";
  } else path = "/Staff";
  // console.log(accountId)
  return (
    <section className=' bg-[#3c2a1e] text-white flex items-center px-5 py-3'>
      <article className='flex-1'>
        <Link className='flex items-center gap-3' to={path}>
          <div className=' overflow-hidden rounded-full'>
            <img className='w-[50px]' src={Logo} alt="" />
          </div>
          <h2 className=' font-semibold'>COFFEE HOME</h2>
        </Link>
      </article>
      <article className='flex flex-[0.3] justify-between items-center'>
      {accountId==1?<NavLink to="list-product">
        <FaStore className='text-3xl' title='List' />
      </NavLink>:""}
      <NavLink to="report">
        <TbReport className='text-3xl' title='Report'/>
      </NavLink>
      <NavLink>
        <FcAbout className='text-3xl' title='About'/>
      </NavLink>
        <nav className='flex items-center gap-3 relative'>
          <label className=' cursor-pointer' htmlFor="" onClick={()=>setDrop(!drop)}><IoMdArrowDropdown className='text-3xl'/></label>
          {drop?<ul className=' absolute -bottom-[120px] -left-10 bg-gray-300 text-black z-20 shadow-md'>
            <li onClick={() => { setDrop(false); navigator('list-branch')}} className='p-2 hover:bg-gray-600 cursor-pointer'>Branch</li>
            <li onClick={() => { setDrop(false); navigator('/register')}} className='p-2 hover:bg-gray-600 cursor-pointer'>Register</li>
            <li onClick={async () => { setDrop(false); localStorage.setItem("accountId", 0); localStorage.setItem("AccountRouter", JSON.stringify({ accountId, role: 'Login' })); await logout(); navigator('/');}} className='p-2 hover:bg-gray-600 cursor-pointer'>Logout</li>
          </ul>:''}
          {/* <h4 onClick={handleLogout}>Logout</h4> */}
        {/* <div className=' overflow-hidden rounded-full'>
          <img className='w-[40px] ' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQttE9sxpEu1EoZgU2lUF_HtygNLCaz2rZYHg&s" alt="" />
        </div> */}
      </nav>

      </article>
    </section>
  )
}

export default Header