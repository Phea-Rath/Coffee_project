import React, { useEffect, useState } from 'react'
import Logo from '../assets/logo.jpg'
import axios from 'axios'
import { useNavigate } from 'react-router';
import BASE_URL from '../Services/Base_Url';
const Register = () => {
  const accountId = localStorage.getItem("accountId");
  const navigator = useNavigate();
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
      alert("Please input data!")
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
    console.log(JSON.parse(formdata));
    try {
      const respone = await axios.post(BASE_URL+'/users', formdata);
      alert(respone.data.message);
      console.log("Success:", respone.data);
      navigator("/Admin")
    } catch (error) {
      console.log("Error posting data:", error);
      alert(error);
    }
    setUsername("");
    setPassword("");
    setRole("");
    setRole_status("");
  }
  return (
    <section className='h-[100vh] bg-[#d5bba9] flex justify-center items-center'>
          <main className='bg-gray-50 rounded-md w-md'>
            <article className='p-5 flex justify-center items-center relative'>
              <a className=' absolute left-2 top-2 underline' href="/admin">back</a>
              <nav>
                <img src={Logo} alt="" className='h-[70px]'/>
              </nav>
            </article>
            <form onSubmit={Register} className='bg-[#5e422f] px-10 pb-[50px] pt-[25px] rounded-tl-[5rem] rounded-bl-md rounded-br-md'>
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
                <div className='bg-gray-50 rounded-md px-5 py-2 flex flex-col'>
                  <label htmlFor="password" className='font-semibold'>Role</label>
                  <select type="text" name='password' onChange={(e) => { setRole_status(e.target.value); setRole(e.target.value == 1?"Admin":"Staff")}} value={role_status} className='outline-0'>
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