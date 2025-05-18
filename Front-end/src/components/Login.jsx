import React, { createContext, useContext, useEffect, useState } from 'react'
import Logo from '../assets/logo.jpg'
import axios from 'axios'
import { useNavigate } from 'react-router';
import Base_Url from '../Services/Base_Url';
import { useAuth } from '../Routers/AuthContext';
export const useUser = createContext();
const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [userName, setUsername] = useState("");
  const [password, setPassword] = useState("");
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios(Base_Url + '/users');
        setUsers(data.data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchUser();
  }, []);
  console.log(users);
  const Login = async (e) => {
    e.preventDefault();
    if (userName && password) {
      const userLogin = users.find((u) => u.name.toLowerCase() === userName.toLowerCase());
      console.log(userLogin);
      if (userLogin && userLogin.password === password) {
        localStorage.setItem("accountId",userLogin.status_role)
        localStorage.branch_id = userLogin.branch_id;
        localStorage.user_id = userLogin.id;
        await login(userLogin.status_role);
        navigate("/"+userLogin.role);
      } else {
        alert("Account incurrect")
      }
    } else {
      alert("Please input account.")
    }
  }
  return (
    <useUser.Provider value={{users}}>
      <section className='h-[100vh] bg-[#d5bba9] flex justify-center items-center'>
        <main className='bg-gray-50 rounded-md w-sm'>
          <article className='p-5 flex justify-center items-center'>
            <nav>
              <img src={Logo} alt="" className='h-[150px]'/>
            </nav>
          </article>
          <form onSubmit={Login} className='bg-[#5e422f] px-10 pb-[50px] pt-[25px] rounded-tl-[5rem] rounded-bl-md rounded-br-md'>
            <h2 className='text-white text-center text-3xl mb-[25px] font-bold'>Log In</h2>
            <nav className='flex flex-col gap-5'>
              <div className='bg-gray-50 rounded-md px-5 py-2 flex flex-col'>
                <label htmlFor="username" className=' font-semibold'>User Name</label>
                <input type="text" name='username' onChange={(e)=>setUsername(e.target.value)} value={userName} className='outline-0'/>
              </div>
              <div className='bg-gray-50 rounded-md px-5 py-2 flex flex-col'>
                <label htmlFor="password" className=' font-semibold'>Password</label>
                <input type="text" name='password' onChange={(e)=>setPassword(e.target.value)} value={password} className='outline-0'/>
              </div>
              <div>
                <input type="checkbox" name="remember" id="remember" />
                <label htmlFor="remember" className='text-white'> Remember me</label>
              </div>
            </nav>
            <button type='submit' className=' bg-blue-700 p-2 w-full rounded-md text-white'>Login</button>
          </form>
        </main>
      </section>
    </useUser.Provider>
  )
}

export default Login