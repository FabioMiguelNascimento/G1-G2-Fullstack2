import App from "@/App";
import Account from "@/pages/Profile/Account";
import AdminLayout from "@/pages/Admin/AdminLayout";
import Cart from "@/pages/Profile/Cart";
import Home from "@/pages/Home";
import NotFound from "@/pages/NotFound";
import { type RouteObject } from "react-router-dom";
import { AdminRoutes, AuthenticatedRoutes } from "./ProtectedRoutes";
import Users from "@/pages/Admin/Users";
import ProductAdmin from "@/pages/Admin/Product";
import Product from "@/pages/Product/Product";
import Login from "@/pages/Auth/Login";
import Register from "@/pages/Auth/Register";
import ProductsLists from "@/pages/Product/ProductsList";
import Profile from "@/pages/Profile/Profile";
import Orders from "@/pages/Profile/Orders";
import Payment from "@/pages/Payment/page";
import EditUser from "@/pages/Profile/EditUser";
import Suppliers from "@/pages/Admin/Suppliers";

const routesConfig: RouteObject[] = [
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
      {
        path: "product/:id",
        element: <Product />,
      },
      {
        path: "products",
        element: <ProductsLists />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "payment",
        element: <Payment />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        element: <AuthenticatedRoutes />,
        children: [
          {
            path: "/account/:userId",
            element: <Account />,
            children: [
              {
                index: true,
                element: <Profile />,
              },
              {
                path: "edit",
                element: <EditUser />,  
              },
              {
                path: "cart",
                element: <Cart />,
              },
              {
                path: "orders",
                element: <Orders />,
              },
            ],
          },
          {
            element: <AdminRoutes />,
            children: [
              {
                path: "admin",
                element: <AdminLayout />,
                children: [
                  {
                    index: true,
                    element: <AdminLayout />,
                  },
                  {
                    path: "users",
                    element: <Users />,
                  },
                  {
                    path: "produtos",
                    element: <ProductAdmin />,
                  },
                  {
                    path: "suppliers",
                    element: <Suppliers />,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];

export default routesConfig;