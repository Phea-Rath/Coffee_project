import React, { useEffect, useState } from 'react'
import { IoSearchOutline } from "react-icons/io5";
import { GiCoffeeCup } from "react-icons/gi";
import { TbHttpDelete } from "react-icons/tb";
import { GrSubtractCircle } from "react-icons/gr";
import { LuCirclePlus } from "react-icons/lu";
import axios from 'axios';
import BASE_URL from '../Services/Base_Url';
const Home = () => {
  const [products, setProducts] = useState([]);
  const [productsType, setProductsType] = useState([]);
  const [orderProduct, setOrderProduct] = useState([]);
  const [unitTotal, setUnitTotal] = useState(0);
  useEffect(() => {
    async function fetchProduct() {
      try {
        const repsonse = await axios.get(BASE_URL + '/products');
        setProducts(repsonse.data.data);
        setProductsType(repsonse.data.data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchProduct();
  }, []);
  function handleCategory(item) {
    if (item == 'all') {
      setProductsType(products);
      return;
    }
    const data = products.filter(({ category }) => category.toLowerCase() == item);
    setProductsType(data);
  }
  const categorys = ["all", ...new Set(products.map(({ category }) => category.toLowerCase()))];
  async function handleProduct(id) {
    const order = products.find(item => item.id === id);
    const checkOrder = orderProduct.orderItem?.find(item => item.id === id);
    if (checkOrder) {
      setOrderProduct(prevItems =>
        prevItems.map(item =>
          item.id === id ? {unit_total: item.unit_total + (item.unit_price*(item.qty+1)),orderItem:[...item?.orderItem,{ ...item, qty: item.qty+1,price: (item.unit_price*(item.qty+1)).toFixed(2) }]} : item
        )
      );
      setUnitTotal(changeUnitTotal);
    } else {
      setOrderProduct({unit_total:order.unit_price,orderItem:[{ id: order.id, code: order.code, name: order.name, qty: 1, unit_price: order.unit_price, price: order.unit_price }]});
      setUnitTotal(changeUnitTotal);
    }
    console.log(orderProduct)
  }


  function changeUnitTotal() {
    return orderProduct.orderItem?.reduce((init, current) => {
      return init + Number(current.price);
    }, 0);
  }
  return (
    <section className=' relative flex md:flex-row flex-col gap-3 h-[calc(100vh-100px)] overflow-auto'>
      <article className='flex flex-col md:w-[70%] gap-3 relative'>
        <article className=' bg-white p-5 pb-0 shadow-md h-[calc(100%-118px)]'>
          <nav className='flex justify-between items-center pb-2 '>
            <h5>All</h5>
            <div className=' relative bg-gray-50 p-1 rounded-md'>
              <label htmlFor="search" className=' absolute left-1 top-2 text-gray-500'><IoSearchOutline /></label>
              <input className='ml-5 outline-0' type="text" name='search' placeholder='Search item' />
            </div>
          </nav>
          <nav className='flex justify-center flex-wrap gap-5 h-[calc(100%-50px)] overflow-auto border border-gray-200 border-b-0 pt-1'>
            {productsType?.map(({id,name,image,unit_price},index)=><div key={index} onClick={()=>handleProduct(id)} className='w-[150px] h-[250px] flex flex-col gap-3'>
              <div className='border border-gray-200 h-[150px] overflow-hidden flex justify-center items-center shadow-sm'>
                <img className='w-[120px]' src={image} alt="" />
              </div>
              <div className='text-center'>
                <h4>{name}</h4>
                <h4 className=' font-semibold text-green-800'>${unit_price}</h4>
              </div>
            </div>
            )}
          </nav>
        </article>
        <article className='flex justify-center gap-5 flex-wrap'>
          {categorys.map((category,index)=><nav key={index} onClick={()=>handleCategory(category)} className='border border-[#3c2a1e] text-center p-2 w-[100px] bg-white shadow-md rounded-sm cursor-pointer'>
            <GiCoffeeCup className='mx-auto' />
            <h4>{category}</h4>
          </nav>)}
          
        </article>
        <article className='flex justify-end gap-5'>
          <button className='border border-red-500 p-1 rounded-sm font-semibold text-red-500' type="button">Cancel Order</button>
          <button className='border border-green-500 p-1 rounded-sm font-semibold text-green-500' type="button">Hold Order</button>
        </article>
      </article>
      <article className='md:w-[30%] flex flex-col gap-5'>
        <article className='bg-white shadow-md pt-3 h-[calc(100%-54px)] flex flex-col justify-between'>
          <h4 className='w-full text-center'>Checkout</h4>
          <table>
            <thead>
                <tr className='border-y border-gray-100 bg-gray-50 text-sm'>
                  <th className='w-10'>Action</th>
                  <th className='w-30'>Code</th>
                  <th>Name</th>
                  <th>Qty</th>
                  <th>Price</th>
                </tr>
              </thead>
          </table>
          <nav className='text-center flex flex-col gap-3 h-[50vh] overflow-y-auto'>
            <table className='w-full table-auto'>
              {/* <thead>
                <tr className='border-y border-gray-100 bg-gray-50 text-sm'>
                  <th>Action</th>
                  <th>Code</th>
                  <th>Name</th>
                  <th>Qty</th>
                  <th>Price</th>
                </tr>
              </thead> */}
              <tbody className=' relative max-h-[20vh] overflow-scroll'>
                {orderProduct?.orderItem?.map(({code,name,qty,price},index)=><tr key={index} className='border-b relative border-gray-100 text-sm'>
                  <td><TbHttpDelete className='mx-auto text-xl text-red-600'/></td>
                  <td>{code}</td>
                  <td>{name}</td>
                  <td className='flex items-center gap-1 py-2'><GrSubtractCircle className='text-green-400' />{qty}<LuCirclePlus className='text-green-400' /></td>
                  <td>${price}</td>
                </tr>)}
              </tbody>
            </table>
          </nav>
          <nav>
            <div>
              <table className='w-full'>
                <tbody>
                  <tr className='bg-gray-100'>
                    <td className='p-2'>Sub Total</td>
                    <td  className='text-end p-2'>${unitTotal}</td>
                  </tr>
                  <tr className='bg-gray-100'>
                    <td className='p-2'>Discount(%)</td>
                    <td className='text-end p-2'><input type="number" name='discount' className='bg-white rounded-sm w-16 text-end outline-0'/></td>
                  </tr>
                  <tr className='bg-gray-100'>
                    <td className='p-2'>Tax(10%)</td>
                    <td className='text-end p-2'>$1.50</td>
                  </tr>
                  <tr className='bg-gray-100'>
                    <td className='p-2'>Currency</td>
                    <td className='text-end p-2'><select defaultValue="USD" name="currency" id="currency">
                      <option value="USD">USD</option>
                      <option value="KHR">KHR</option>
                    </select></td>
                  </tr>
                  <tr>
                    <td className='p-2'>Total</td>
                    <th className='text-end p-2'>$17.50</th>
                  </tr>
                </tbody>
              </table>
            </div>
          </nav>
        </article>
        <button className='bg-green-700 rounded-sm text-white p-1 w-full'>Pay ($17.50)</button>
      </article>
    </section>
  )
}

export default Home