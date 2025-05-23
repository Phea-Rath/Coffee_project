import React, { useEffect, useState } from 'react'
import Logo from '../assets/logo.jpg'
import axios from 'axios'
import { useNavigate } from 'react-router';
import BASE_URL from '../Services/Base_Url';
import { Alert, AlertTitle, Box, CircularProgress } from '@mui/material';
import { useOutletContext } from '../Layout/ManagementLayout';
const Register = () => {
  const accountId = localStorage.getItem("accountId");
  const navigator = useNavigate();
  const [wait, setWait] = useState(false);
  const [childValue,setChildValue ]= useState({status:0,alertMessage:""});
  const [userName, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [role_status, setRole_status] = useState(0);
  const [branch_id, setBranch_id] = useState(0);
  const [branchs, setBranchs] = useState([]);

  useEffect(() => {
    async function fetchBranch() {
      try {
        const repsonse = await axios.get(BASE_URL + '/branchs');
        setBranchs(repsonse.data.data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchBranch();
  },[])
  
  async function Register(e) {
    e.preventDefault();
    if (!userName && !password && !role && !role_status) {
      setChildValue({ status: 3, alertMessage: "Missing require! > Please input data in field!" });
      return;
    }
    const formdata = JSON.stringify({
      name: userName,
      password: password,
      role: role,
      status_role: Number(role_status),
      branch_id: Number(branch_id),
      created_by: Number(accountId)
    });
    setWait(true);
    try {
      const respone = await axios.post(BASE_URL+'/users', formdata);
      setChildValue({ status: 1, alertMessage: respone.data.message });
      setWait(false);
      setTimeout(() => navigator("/Admin"), 2000);
      
    } catch (error) {
      setWait(false);
      setChildValue({ status: 2, alertMessage: "User register fail! > " + error });
      setTimeout(() => setChildValue({ status: 0, alertMessage: "" }), 5000);
    }
    setUsername("");
    setPassword("");
    setRole("");
    setRole_status("");
  }
    const renderAlertMessage = (message) => {
    if (!message) return "";
    if (typeof message === 'string') return message;
    if (message instanceof Error) return message.message;
    if (typeof message === 'object') return JSON.stringify(message);
    return String(message);
  };

  return (
    <section className='h-[100vh] bg-[#d5bba9] flex justify-center items-center'>
      <Box sx={{ display: 'flex' }} className={` absolute top-0 left-0 bg-gray-400 w-[100vw] h-[100vh] transition-all duration-500 ease-in-out justify-center items-center ${wait?'z-40 opacity-50':'-z-40 opacity-0'}`}>
        <CircularProgress />
      </Box>
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
      <main className='bg-gray-50 h-[100vh] md:h-auto flex flex-col md:block md:rounded-md w-md'>
        <article className='flex-[0.5] p-5 flex justify-center items-center relative'>
          <a className=' absolute left-2 top-2 underline' href="/admin">back</a>
          <nav>
            <img src={Logo} alt="" className='h-[70px]'/>
          </nav>
        </article>
        <form onSubmit={Register} className='bg-[#5e422f] flex-1  px-10 pb-[50px] pt-[25px] rounded-tl-[5rem] md:rounded-bl-md md:rounded-br-md'>
          <h2 className='text-white text-center text-3xl mb-[25px] font-bold'>Log In</h2>
          <nav className='flex flex-col gap-5'>
            <div className='bg-gray-50 rounded-md px-5 py-2 flex flex-col'>
              <label htmlFor="username" className=' font-semibold'>User Name</label>
              <input type="text" name='username' onChange={(e)=>setUsername(e.target.value)} value={userName} className='outline-0'/>
            </div>
            <div className='bg-gray-50 rounded-md px-5 py-2 flex flex-col'>
              <label htmlFor="password" className=' font-semibold'>Password</label>
              <input type="password" name='password' onChange={(e)=>setPassword(e.target.value)} value={password} className='outline-0'/>
            </div>
            <div className='bg-gray-50 rounded-md px-5 py-2 flex flex-col'>
              <label htmlFor="role" className='font-semibold'>Role</label>
              <select type="text" name='role' onChange={(e) => { setRole_status(e.target.value); setRole(e.target.value == 1?"Admin":"Staff")}} value={role_status} className='outline-0'>
                <option value="">Select role</option>
                <option value="1">Admin</option>
                <option value="2">Staff</option>
              </select>
            </div>
            <div className='bg-gray-50 rounded-md px-5 py-2 flex flex-col'>
              <label htmlFor="password" className='font-semibold'>Branch</label>
              <select type="text" name='password' onChange={(e) => { setBranch_id(e.target.value);}} value={branch_id} className='outline-0'>
                <option value="">Select branch</option>
                {branchs.map(({ id,name }) => <option key={id} value={id}>{name}</option>)}
              </select>
            </div>
            {/* <div>
              <input type="checkbox" name="remember" id="remember" />
              <label htmlFor="remember" className='text-white'> Remember me</label>
            </div> */}
          </nav>
          <button type='submit' className=' bg-blue-700 p-2 w-full mt-5 rounded-md text-white cursor-pointer'>Sign Up</button>
        </form>
      </main>
    </section>
  )
}

export default Register