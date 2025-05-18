import React, { useEffect, useState } from 'react'
import { IoSearchOutline } from "react-icons/io5";
import { TbHttpDelete } from "react-icons/tb";
import { GrSubtractCircle } from "react-icons/gr";
import { LuCirclePlus } from "react-icons/lu";
import axios from 'axios';
import BASE_URL from '../Services/Base_Url';
const Home = () => {
  const tax = 5;
  const userId = localStorage.getItem("user_id")
  const branch_id = localStorage.getItem("branch_id")
  const [products, setProducts] = useState([]);
  const [productsType, setProductsType] = useState([]);
  const [orderProduct, setOrderProduct] = useState([]);
  const [currency, setCurrency] = useState("USD");
  const [discount, setDiscount] = useState(0);
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
    if (item.target.value == 'all') {
      setProductsType(products);
      return;
    }
    const data = products.filter(({ category }) => category.toLowerCase() == item.target.value);
    setProductsType(data);
  }
  const categorys = ["all", ...new Set(products?.map(({ category }) => category.toLowerCase()))];
  async function handleProduct(id) {
    const order = products.find(item => item.id === id);
    const checkOrder = orderProduct.orderItem?.find(item => item.id === id);
    if (checkOrder) {
      setOrderProduct(prev => {
        const updatedOrderItems = prev.orderItem?.map(item =>
         item.id === id
        ? { ...item, qty: item.qty+1,price: (item.unit_price*(item.qty+1)).toFixed(2) }
            : item);
        const newUnitTotal = updatedOrderItems?.reduce(
        (sum, item) => sum + Number(item.qty) * Number(item.unit_price),0);
        return { unit_total: newUnitTotal, currency: currency,tax:newUnitTotal*(tax/100),total:newUnitTotal +(newUnitTotal*(tax/100)), orderItem: updatedOrderItems };
        
      });
      // setUnitTotal(changeUnitTotal);
    } else {
      setOrderProduct(prev => {
        const Orders = [...prev.orderItem ?? '', { id: order.id, code: order.code, name: order.name, qty: 1, unit_price: order.unit_price, price: order.unit_price }];
        const newUnitTotal = Orders?.reduce(
        (sum, item) => sum + Number(item.qty) * Number(item.unit_price),0);
        return { unit_total: newUnitTotal??order.unit_price,tax:newUnitTotal*(tax/100), orderItem: Orders }
      });
    }
    console.log(orderProduct)
  }

  function formatCurrency(value, currency = 'USD', locale = 'en-US') {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency
  }).format(value);
}

  function changeCurrency(e) {
    if (e.target.value == "USD") {
      setOrderProduct(prev => ({ ...prev, currency: "USD"}));
      setCurrency("USD")
    } else {
      setOrderProduct(prev => ({ ...prev, currency: "KHR"}));
      setCurrency("KHR")
    }
  }
  function changeDiscount(e) {
    if (e.target.value > 0) {
      setOrderProduct(prev => ({ ...prev, discount: Number(e.target.value) }));
      setDiscount(Number(e.target.value)/100);
    } else {
      setDiscount(0)
    }
  }

  const handleRemoveOrder = (code) => {
    const order = orderProduct.orderItem.filter((item) => item.code != code);
    setOrderProduct(prev =>({...prev, orderItem: order}));
  }

  const changeSearch = (e) => {
    if (e.target.value) {
      const filterProducts = productsType.filter((item) => item.name.toLowerCase().includes(e.target.value.toLowerCase()));
      setProductsType(filterProducts);
    } else {
      setProductsType(products);
    }
  }
  
  async function handlePay() {
    const formData = {
      user_id: Number(userId),
      branch_id: Number(branch_id),
      unit_total: orderProduct.unit_total,
      discount: orderProduct.discount||0,
      tax: Number((orderProduct.tax).toFixed(2)),
      currency: currency,
      total_receipt: Number(((orderProduct.unit_total - (orderProduct.unit_total *discount)) + orderProduct.tax).toFixed(2)),
      sale_detail: orderProduct.orderItem,
    }
    console.log(formData)
    try {
      const respones = await axios.post(BASE_URL + "/receipts", formData);
      alert(respones.data.message);
      setOrderProduct([]);
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <section className=' relative flex md:flex-row flex-col gap-3 h-[calc(100vh-100px)] overflow-auto'>
      <article className='flex flex-col md:w-[70%] gap-3 relative'>
        <article className=' bg-white p-5 pb-0 shadow-md h-[calc(100%-50px)]'>
          <nav className='flex justify-between items-center pb-2 '>
            <h5>Products</h5>
            <div className=' relative bg-gray-50 p-1 rounded-md'>
              <label htmlFor="search" className=' absolute left-1 top-2 text-gray-500'><IoSearchOutline /></label>
              <input onChange={changeSearch} className='ml-5 outline-0' type="text" name='search' placeholder='Search item' />
            </div>
            <select name="category" onChange={handleCategory} id="category">
              {categorys?.map((name,index) => <option key={index} value={name}>{name}</option>)}
            </select>
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
        <article className='flex justify-end gap-5'>
          {orderProduct?.orderItem ?<button onClick={()=>setOrderProduct([])} className='border border-red-500 p-1 rounded-sm font-semibold text-red-500' type="button">Cancel Order</button>:""}
          {/* <button className='border border-green-500 p-1 rounded-sm font-semibold text-green-500' type="button">Hold Order</button> */}
        </article>
      </article>
      <article className='md:w-[30%] flex flex-col gap-5'>
        <article className='bg-white shadow-md pt-3 h-[calc(100%-54px)] flex flex-col justify-between'>
          <h4 className='w-full text-center'>Checkout</h4>
          <nav className='text-center flex flex-col gap-3 h-[50vh] overflow-y-auto'>
            <table className='w-full table-auto'>
              <thead>
                <tr className='border-y border-gray-100 bg-gray-50 text-sm'>
                  <th>Action</th>
                  <th>Code</th>
                  <th>Name</th>
                  <th>Qty</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody className=' relative max-h-[20vh] overflow-scroll'>
                {orderProduct?.orderItem?.map(({code,name,qty,price},index)=><tr key={index} className='border-b relative border-gray-100 text-sm'>
                  <td><TbHttpDelete onClick={()=>handleRemoveOrder(code)} className='mx-auto text-xl text-red-600'/></td>
                  <td>{code}</td>
                  <td>{name}</td>
                  <td className='flex items-center gap-1 py-2'>{qty}</td>
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
                    <td className='p-2'>Unit Total</td>
                    <td className='text-end p-2'>${Number(orderProduct.unit_total).toFixed(2) == "NaN"?"0.00":Number(orderProduct.unit_total).toFixed(2)}</td>
                  </tr>
                  <tr className='bg-gray-100'>
                    <td className='p-2'>Discount(%)</td>
                    <td className='text-end p-2'><input type="number" onChange={changeDiscount} min="0" defaultValue={0} name='discount' className='bg-white rounded-sm w-16 text-end outline-0'/></td>
                  </tr>
                  <tr className='bg-gray-100'>
                    <td className='p-2'>Tax(5%)</td>
                    <td className='text-end p-2'>${ Number(orderProduct.tax).toFixed(2)=="NaN"?"0.00":Number(orderProduct.tax).toFixed(2)}</td>
                  </tr>
                  <tr className='bg-gray-100'>
                    <td className='p-2'>Currency</td>
                    <td className='text-end p-2' onChange={changeCurrency}><select defaultValue="USD" name="currency" id="currency">
                      <option value="USD">USD</option>
                      <option value="KHR">KHR</option>
                    </select></td>
                  </tr>
                  <tr>
                    <td className='p-2'>Total</td>
                    <th className='text-end p-2'>{ Number(orderProduct.unit_total).toFixed(2)=="NaN"?"0.00":currency=="KHR"?"៛"+formatCurrency(((orderProduct.unit_total-(orderProduct.unit_total*discount))+orderProduct.tax)* 4000,"KHR","km-KH").replace(/[^\d.,]/g, '').trim():"$"+formatCurrency((orderProduct.unit_total-(orderProduct.unit_total*discount))+orderProduct.tax,"USD","en-US").replace(/[^\d.,]/g, '').trim()}</th>
                  </tr>
                </tbody>
              </table>
            </div>
          </nav>
        </article>
        <button onClick={handlePay} disabled={orderProduct.length == 0} className='bg-green-700 rounded-sm text-white p-1 w-full cursor-pointer'>Pay ({currency=="KHR"?"៛"+formatCurrency(((orderProduct.unit_total-(orderProduct.unit_total*discount))+orderProduct.tax )* 4000,"KHR","km-KH").replace(/[^\d.,]/g, '').trim():"$"+formatCurrency((orderProduct.unit_total-(orderProduct.unit_total*discount))+orderProduct.tax,"USD","en-US").replace(/[^\d.,]/g, '').trim()})</button>
      </article>
    </section>
  )
}

export default Home