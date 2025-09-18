import App from "@/App";
import Home from "@/pages/Home";
import NotFound from "@/pages/NotFound";
import Product from "@/pages/Product";
import Cart from "@/pages/Cart";
import Login from "@/pages/Login";
import Profile from "@/pages/Profile";
import { type RouteObject } from "react-router-dom";
import ProductsLists from "@/pages/ProductsList";

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
        path: "account",
        element: <Profile  />
      }
    ],
  },
];

export default routesConfig;