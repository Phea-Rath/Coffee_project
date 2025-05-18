import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router';
import BASE_URL from '../Services/Base_Url';
import axios from 'axios';
import Logo from "../assets/logo.jpg";
import { toPng } from 'html-to-image';
import { FiDownload, FiPrinter } from 'react-icons/fi';
import { head } from '../Services/head';

const CoffeeShopReceipt = ({ order }) => {
  const receiptRef = useRef(null);
  
  // Format the current date and time
  const currentDate = new Date(order.sale_date).toLocaleDateString();
  const currentTime = new Date(order.sale_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const handleDownload = () => {
    if (receiptRef.current === null) {
      return;
    }

    toPng(receiptRef.current, { 
      backgroundColor: '#ffffff',
      quality: 1,
      pixelRatio: 3 // Higher resolution
    })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = `HomeCoffee-Receipt-${order.receipt_id}.png`;
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.error('Error generating image:', err);
      });
  };

  const handlePrint = () => {
    if (receiptRef.current === null) {
      return;
    }
    // console.log(receiptRef.current)
    // window.print();
    const printWindow = window;
    printWindow.document.write(head);
    // // printWindow.document.write('<style>@media print { body { margin: 0; padding: 0; } }</style>');
    printWindow.document.write('</head><body>');
    printWindow.document.write(receiptRef.current.innerHTML);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.focus();
    
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  return (
    <div className="flex flex-col items-center ">
      {/* Receipt with ref for capturing */}
      <div ref={receiptRef} className="max-w-xs mx-auto p-6 bg-white rounded-lg shadow-md font-mono mb-4">
        <div><img src={Logo} alt="logo" className='h-20 mx-auto rounded-full' /></div>
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-amber-800">Home Coffee</h1>
          <p className="text-sm text-gray-600">seansoks Coffee Lane, phnom penh City</p>
          <p className="text-sm text-gray-600">(+855) 97-977-2133</p>
        </div>

        {/* Order Info */}
        <div className="mb-4 border-b border-gray-200 pb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Order #:</span>
            <span>{order.receipt_id}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Date:</span>
            <span>{currentDate}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Time:</span>
            <span>{currentTime}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Branch:</span>
            <span>{ order.branch_name}</span>
          </div>
        </div>

        {/* Order Items */}
        <div className="mb-4 border-b border-gray-200 pb-4">
          <div className="grid grid-cols-12 gap-2 mb-2 font-semibold text-sm">
            <div className="col-span-6">Item</div>
            <div className="col-span-2 text-right">Qty</div>
            <div className="col-span-2 text-right">Price</div>
            <div className="col-span-2 text-right">Total</div>
          </div>
          
          {order.products?.map((item, index) => (
            <div key={index} className="grid grid-cols-12 gap-2 text-sm mb-1">
              <div className="col-span-6">
                {item.name}
              </div>
              <div className="col-span-2 text-right">{item.qty}</div>
              <div className="col-span-2 text-right">${item.unit_price}</div>
              <div className="col-span-2 text-right">${(item.total)}</div>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-1">
            <span>Subtotal:</span>
            <span>${order.unit_total}</span>
          </div>
          <div className="flex justify-between text-sm mb-1">
            <span>Tax (8%):</span>
            <span>${order.tax}</span>
          </div>
          <div className="flex justify-between font-bold mt-2">
            <span>Total:</span>
            <span>${order.receipt_total}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-gray-500">
          <p>Thank you for visiting Home Coffee!</p>
          <p>We hope to see you again soon</p>
          <p className="mt-2">* Customer copy *</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 bg-amber-700 hover:bg-amber-800 text-white font-medium py-2 px-4 rounded-lg shadow transition-colors"
        >
          <FiDownload className="text-lg" />
          Download
        </button>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 bg-gray-700 hover:bg-gray-800 text-white font-medium py-2 px-4 rounded-lg shadow transition-colors"
        >
          <FiPrinter className="text-lg" />
          Print
        </button>
      </div>
    </div>
  );
};

const ReceiptDetail = () => {
  const { id } = useParams();
  const [receipt, setReceipt] = useState({ products: [] }); // Initialize with empty products array

  useEffect(() => {
    async function fetchReceiptDetail() {
      try {
        const response = await axios.get(BASE_URL + `/receipts_detail/${id}`);
        if (response.data.status === 200) {
          setReceipt(response.data.data);
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchReceiptDetail();
  }, [id]); // Add id to dependency array

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <CoffeeShopReceipt order={receipt} />
    </div>
  );
};

export default ReceiptDetail;