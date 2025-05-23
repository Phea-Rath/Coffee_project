import React, { createContext, useContext, useEffect, useState } from 'react'
import Header from './Header'
import { Outlet } from 'react-router'
import { AlertTitle } from '@mui/material';
import Alert from '@mui/material/Alert';
const OutletContext = createContext();

export function useOutletContext() {
  return useContext(OutletContext);
}
const ManagementLayout = () => {
  const [childValue, setChildValue] = useState({ status: 0, alertMessage: "" });
  useEffect(() => {
    if (childValue.status == 1) {
      setTimeout(() => {
        setChildValue({ status: 0, alertMessage: "" });
      }, 2000);
    } else {
      setTimeout(() => {
        setChildValue({ status: 0, alertMessage: "" });
      }, 5000);
    }
  }, [childValue.status]);
  // Helper function to safely render error messages
  const renderAlertMessage = (message) => {
    if (!message) return "";
    if (typeof message === 'string') return message;
    if (message instanceof Error) return message.message;
    if (typeof message === 'object') return JSON.stringify(message);
    return String(message);
  };
  return (
    <OutletContext.Provider value={{ childValue, setChildValue }}>
      <section>
        <header>
          <Header/>
        </header>
        <main className='p-3 bg-[#efe5de]'>
          {/* Success Alert */}
          <div className={`absolute top-20 shadow-current shadow-lg shadow-green-500/20 left-3 right-3 transition-all duration-500 ease-in-out ${
            childValue.status === 1 ? 'opacity-100 z-50 translate-y-0' : 'opacity-0 -z-50 -translate-y-8'
          }`}>
            <Alert severity="success" className="border border-green-600 shadow-md">
              <AlertTitle>Success</AlertTitle>
              {renderAlertMessage(childValue?.alertMessage)}
            </Alert>
          </div>
    
          {/* Error Alert */}
          <div className={`absolute top-20 shadow-current shadow-lg shadow-red-500/20 left-3 right-3 transition-all duration-500 ease-in-out ${
            childValue?.status === 2 ? 'opacity-100 z-50 translate-y-0' : 'opacity-0 -z-50  -translate-y-8'
          }`}>
            <Alert severity="error" className="border border-red-600 shadow-md">
              <AlertTitle>Error</AlertTitle>
              {renderAlertMessage(childValue?.alertMessage)}
            </Alert>
          </div>
          {/* Warning Alert */}
          <div className={`absolute top-20 shadow-current shadow-lg shadow-yellow-500/20 left-3 right-3 transition-all duration-500 ease-in-out ${
            childValue?.status === 3 ? 'opacity-100 z-50 translate-y-0' : 'opacity-0 -z-50  -translate-y-8'
          }`}>
            <Alert severity="warning" className="border border-yellow-600 shadow-md">
              <AlertTitle>Warning</AlertTitle>
              {renderAlertMessage(childValue?.alertMessage)}
            </Alert>
          </div>
          <Outlet/>
        </main>
      </section>
    </OutletContext.Provider>
  )
}

export default ManagementLayout