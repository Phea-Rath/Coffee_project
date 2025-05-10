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

const router = createBrowserRouter([
  {
    path: "/unauthorized",
    element: <ErrorPage/>,
    errorElement: <ErrorPage/>,
  },
  {
    element: <RequireAuth allowedRole="Login" />,
    errorElement: <ErrorPage/>,
    children: [
      {
        path: '/',
        element: <Login/>,
        errorElement: <ErrorPage/>,
      },
    ]
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
        index: 1,
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
        ]
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
