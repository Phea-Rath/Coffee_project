import { createBrowserRouter, RouterProvider } from 'react-router'
import './App.css'
import ManagementLayout from './Layout/ManagementLayout'
import Home from './components/Home'
import About from './components/About'
import ListProduct from './components/ListProduct'
import AddProduct from './components/AddProduct'
import Report from './components/Report'
import Login from './components/Login'
import Register from './components/Register'
import RequireAuth from './Routers/RequireAuth'
import { AuthProvider } from './Routers/AuthContext'
import ListBranch from './components/ListBranch'
import AddBranch from './components/AddBranch'
// import Unauthorized from './components/Unauthorized'
import ErrorPage from './components/ErrorPage'
import ReceiptDetail from './components/ReceiptDetail'
import EditProduct from './components/EditProduct'

const router = createBrowserRouter([
  {
    path: "/unauthorized",
    element: <ErrorPage/>,
    errorElement: <ErrorPage/>,
  },
  {
    path: '/',
    element: <Login/>,
    errorElement: <ErrorPage/>,
  },
  {
    path: '/register',
    errorElement: <ErrorPage/>,
    element: <Register/>
  },
  {
    path: 'add-branch',
    element: <AddBranch/>,
    errorElement: <ErrorPage/>,
  },
  {
    element: <RequireAuth allowedRole="Admin" />,
    children: [
      {
        path: '/register',
        errorElement: <ErrorPage/>,
        element: <Register/>
      },
      {
        path: "/admin",
        element: <ManagementLayout />,
        errorElement: <ErrorPage/>,
        children: [
          {
            path: '',
            index: 1,
            element: <Home/>,
            errorElement: <ErrorPage/>,
          },
          {
            path: 'about',
            element: <About/>,
            errorElement: <ErrorPage/>,
          },
          {
            path: 'list-product',
            element: <ListProduct/>,
          },
          {
            path: 'add-product',
            element: <AddProduct/>,
          },
          {
            path: 'edit-product/:id',
            element: <EditProduct/>,
            errorElement: <ErrorPage/>,
          },
          {
            path: 'report',
            element: <Report/>,
            errorElement: <ErrorPage/>,
          },
          {
            path: 'add-branch',
            element: <AddBranch/>,
            errorElement: <ErrorPage/>,
          },
          {
            path: 'list-branch',
            element: <ListBranch/>,
            errorElement: <ErrorPage/>,
          },
        ]
      },
      {
        path: 'Admin/receipt-detail/:id',
        element: <ReceiptDetail/>,
        errorElement: <ErrorPage/>,
      },
    ]
  },
  {
    element: <RequireAuth allowedRole="Staff" />,
    errorElement: <ErrorPage/>,
    children: [
      {
        path: "/staff",
        element: <ManagementLayout />,
        errorElement: <ErrorPage/>,
        children: [
          {
            path: '',
            index: 1,
            element: <Home/>,
            errorElement: <ErrorPage/>,
          },
          {
            path: 'about',
            element: <About/>,
            errorElement: <ErrorPage/>,
          },
          {
            path: 'list-product',
            element: <ListProduct/>,
          },
          {
            path: 'report',
            element: <Report/>,
            errorElement: <ErrorPage/>,
          },
        ]
      },
      {
        path: 'staff/receipt-detail/:id',
        element: <ReceiptDetail/>,
        errorElement: <ErrorPage/>,
      },
    ]
  },
  
])
function App() {

  return (
    <AuthProvider>
     <RouterProvider router={router}/>
    </AuthProvider>
  )
}

export default App
