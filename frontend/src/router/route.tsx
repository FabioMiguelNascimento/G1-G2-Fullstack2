import App from "@/App";
import Admin from "@/pages/Admin/Admin";
import AdminLayout from "@/pages/Admin/AdminLayout";
import Cart from "@/pages/Cart";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import NotFound from "@/pages/NotFound";
import Product from "@/pages/Product";
import ProductsLists from "@/pages/ProductsList";
import Profile from "@/pages/Profile";
import Register from "@/pages/Register";
import { type RouteObject } from "react-router-dom";
import { AdminRoutes, AuthenticatedRoutes } from "./ProtectedRoutes";
import Users from "@/pages/Admin/Users";

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
        element: <Product />
      },
      {
        path: "products",
        element: <ProductsLists />
      },
      {
        path: "cart",
        element: <Cart />
      },
      {
        path: "login",
        element: <Login />
      },
       {
        path: "register",
        element: <Register />
      },
      {
        element: <AuthenticatedRoutes />,
        children: [
          {
            path: "profile",
            element: <Profile />
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
                    element: <Admin />
                  },
                  {
                    path: "users",
                    element: <Users />
                  }
                ]
              }
            ]
          }
        ]
      }
    ],
  },
];

export default routesConfig;