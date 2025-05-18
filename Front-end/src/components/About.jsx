import React from 'react';
import { FaCheckCircle, FaPhp, FaReact } from 'react-icons/fa';
import { SiTailwindcss } from "react-icons/si";

const About = () => {
  return (
    <section className='h-[calc(100vh-100px)] overflow-auto'>
      <main className='p-5 max-w-4xl mx-auto bg-white rounded-lg shadow-md'>
        <h1 className='text-3xl font-bold text-center mb-6 text-amber-800'>Home Coffee</h1>
      
        <div className='mb-8 bg-gray-50 p-4 rounded-lg'>
          <h2 className='text-xl font-semibold mb-4 text-amber-700'>About This Project</h2>
          <p className='mb-4 text-gray-700'>
            This project is a coffee shop management system designed to:
          </p>
          <ul className='space-y-2 pl-5'>
            <li className='flex items-start'>
              <FaCheckCircle className='text-green-500 mt-1 mr-2 flex-shrink-0' />
              <span>Manage coffee inventory and products</span>
            </li>
            <li className='flex items-start'>
              <FaCheckCircle className='text-green-500 mt-1 mr-2 flex-shrink-0' />
              <span>Track sales and imports</span>
            </li>
            <li className='flex items-start'>
              <FaCheckCircle className='text-green-500 mt-1 mr-2 flex-shrink-0' />
              <span>Process instant payments for sold items</span>
            </li>
            <li className='flex items-start'>
              <FaCheckCircle className='text-green-500 mt-1 mr-2 flex-shrink-0' />
              <span>Generate invoices for customers</span>
            </li>
            <li className='flex items-start'>
              <FaCheckCircle className='text-green-500 mt-1 mr-2 flex-shrink-0' />
              <span>Remotely manage and monitor all shop activities online</span>
            </li>
          </ul>
        </div>
        <div className='mb-8'>
          <h2 className='text-2xl font-bold text-center mb-6 text-amber-800'>Developer Information</h2>
          <div className='overflow-x-auto'>
            <table className='min-w-full bg-white rounded-lg overflow-hidden'>
              <thead className='bg-amber-700 text-white'>
                <tr>
                  <th className='py-3 px-4 text-left'>Created By</th>
                  <th className='py-3 px-4 text-left'></th>
                </tr>
              </thead>
              <tbody className='text-gray-700'>
                <tr className='border-b border-gray-200 hover:bg-gray-50'>
                  <th className='py-3 px-4 text-left font-semibold'>Name</th>
                  <td className='py-3 px-4'>ទេព​ភារ៉ាត់</td>
                </tr>
                <tr className='border-b border-gray-200 hover:bg-gray-50'>
                  <th className='py-3 px-4 text-left font-semibold'>Class</th>
                  <td className='py-3 px-4'>M1</td>
                </tr>
                <tr className='hover:bg-gray-50'>
                  <th className='py-3 px-4 text-left font-semibold'>Subject</th>
                  <td className='py-3 px-4'>Web Development</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className='bg-gray-50 p-4 rounded-lg'>
          <h2 className='text-2xl font-bold text-center mb-6 text-amber-800'>Technology Stack</h2>
      
          <div className='mb-6'>
            <h3 className='text-xl font-semibold mb-3 text-amber-700 flex items-center'>
              <FaReact className='mr-2 text-blue-500' />
              Front-end
            </h3>
            <ul className='space-y-2 pl-5'>
              <li className='flex items-center'>
                <FaCheckCircle className='text-green-500 mr-2' />
                <FaReact className='text-blue-500 mr-2' />
                <span>React JS</span>
              </li>
              <li className='flex items-center'>
                <FaCheckCircle className='text-green-500 mr-2' />
                <SiTailwindcss className='text-cyan-500 mr-2' />
                <span>Tailwind CSS</span>
              </li>
              <li className='flex items-center'>
                <FaCheckCircle className='text-green-500 mr-2' />
                {/* <Icon className='text-blue-600 mr-2' /> */}
                <svg  className='text-blue-600 mr-2' xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"><path fill="#0073E6" fill-rule="evenodd" d="M24 5.601V1.592a.344.344 0 0 0-.514-.298l-2.64 1.508a.688.688 0 0 0-.346.597v4.009c0 .264.285.43.514.298l2.64-1.508A.688.688 0 0 0 24 5.6ZM.515 1.295l7.643 4.383a.688.688 0 0 0 .684 0l7.643-4.383a.344.344 0 0 1 .515.298v12.03c0 .235-.12.453-.319.58l-4.65 2.953 3.11 1.832c.22.13.495.127.713-.009l4.61-2.878a.344.344 0 0 0 .161-.292v-4.085c0-.254.14-.486.362-.606l2.507-1.346a.344.344 0 0 1 .506.303v7.531c0 .244-.13.47-.34.593l-7.834 4.592a.688.688 0 0 1-.71-.009l-5.953-3.681A.344.344 0 0 1 9 18.808v-3.624c0-.115.057-.222.153-.286l4.04-2.694a.688.688 0 0 0 .307-.572v-4.39a.137.137 0 0 0-.208-.117l-4.44 2.664a.688.688 0 0 1-.705.002L3.645 7.123a.138.138 0 0 0-.208.118v7.933a.344.344 0 0 1-.52.295L.5 14.019C.19 13.833 0 13.497 0 13.135V1.593c0-.264.286-.43.515-.298Z" clip-rule="evenodd"/></svg>
                <span>Material UI</span>
              </li>
            </ul>
          </div>
      
          <div>
            <h3 className='text-xl font-semibold mb-3 text-amber-700 flex items-center'>
              <FaPhp className='mr-2 text-purple-500' />
              Back-end
            </h3>
            <ul className='space-y-2 pl-5'>
              <li className='flex items-center'>
                <FaCheckCircle className='text-green-500 mr-2' />
                <FaPhp className='text-purple-500 mr-2' />
                <span>PHP Slim Framework</span>
              </li>
            </ul>
          </div>
        </div>
      </main>
    </section>
  );
};

export default About;