import App from "@/App";
import AdminLayout from "@/pages/Admin/AdminLayout";
import Cart from "@/pages/Cart";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import NotFound from "@/pages/NotFound";
import Product from "@/pages/Product";
import ProductsLists from "@/pages/ProductsList";
import Register from "@/pages/Register";
import { type RouteObject } from "react-router-dom";
import { AdminRoutes, AuthenticatedRoutes } from "./ProtectedRoutes";
import Favorites from "@/pages/Favorites";
import Account from "@/pages/Account";
import Profile from "@/pages/Profile";

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
                path: "cart",
                element: <Cart />,
            },
            {
                path: "login",
                element: <Login />,
            },
        ],
    },
    {
        path: "/account",
        element: <Account />,
        children: [
            {
                index: true,
                element: <Profile />, // padrão: /account
            },
            {
                path: "favorites",
                element: <Favorites />, // /account/favorites
            },
        ],
    },
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
