import React, { createContext, useContext, useEffect, useState } from 'react'
import Logo from '../assets/logo.jpg'
import axios from 'axios'
import { useNavigate } from 'react-router';
import Base_Url from '../Services/Base_Url';
import { useAuth } from '../Routers/AuthContext';
import { Alert, AlertTitle, Box, CircularProgress } from '@mui/material';
export const useUser = createContext();
const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [userName, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [childValue, setChildValue] = useState({ status: 0, alertMessage: "" });
  const [wait, setWait] = useState(false);
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
   const renderAlertMessage = (message) => {
    if (!message) return "";
    if (typeof message === 'string') return message;
    if (message instanceof Error) return message.message;
    if (typeof message === 'object') return JSON.stringify(message);
    return String(message);
  };
  const Login = async (e) => {
    e.preventDefault();
    setWait(true);
    if (userName && password) {
      const userLogin = users.find((u) => u.name.toLowerCase() === userName.toLowerCase());
      if (userLogin && userLogin.password === password) {
        localStorage.setItem("accountId",userLogin.status_role)
        localStorage.branch_id = userLogin.branch_id;
        localStorage.user_id = userLogin.id;
        await login(userLogin.status_role);
        setChildValue({ status: 1, alertMessage: "User login successfully!" });
        setTimeout(() => {
          setWait(false);
          navigate("/" + userLogin.role);
        }, 2000);
        
      } else {
        setChildValue({ status: 2, alertMessage: "Account incurrect > " + error });
        setWait(false);
        setTimeout(() => setChildValue({ status: 0, alertMessage: "" }),5000);
      }
    } else {
      setChildValue({ status: 2, alertMessage: "Account incurrect > " + error });
      setWait(false);
        setTimeout(() => setChildValue({ status: 0, alertMessage: "" }),5000);
    }
  }
  return (
    <useUser.Provider value={{users}}>
      <section className='h-[100vh] bg-[#d5bba9] flex justify-center items-center'>
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
        <main className='bg-gray-50 md:rounded-md w-md h-[100vh] md:h-auto flex flex-col md:block'>
          <article className='flex-[0.7] p-5 flex justify-center items-center'>
            <nav>
              <img src={Logo} alt="" className='h-[150px]'/>
            </nav>
          </article>
          <form onSubmit={Login} className='flex-1 bg-[#5e422f] px-10 pb-[50px] pt-[25px] rounded-tl-[5rem] md:rounded-bl-md md:rounded-br-md'>
            <h2 className='text-white text-center text-3xl mb-[25px] font-bold'>Log In</h2>
            <nav className='flex flex-col gap-5'>
              <div className='bg-gray-50 rounded-md px-5 py-2 flex flex-col'>
                <label htmlFor="username" className=' font-semibold'>User Name</label>
                <input type="text" name='username' onChange={(e)=>setUsername(e.target.value)} value={userName} className='outline-0'/>
              </div>
              <div className='bg-gray-50 rounded-md px-5 py-2 flex flex-col'>
                <label htmlFor="password" className='font-semibold'>Password</label>
                <input type="text" name='password' onChange={(e)=>setPassword(e.target.value)} value={password} className='outline-0'/>
              </div>
              <div>
                {/* <input type="checkbox" name="remember" id="remember" /> */}
                <label htmlFor="remember" className='text-white'>user: Admin</label><br />
                <label htmlFor="remember" className='text-white'>password:123</label>
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