import App from "@/App";
import Cart from "@/pages/Cart";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import NotFound from "@/pages/NotFound";
import Product from "@/pages/Product";
import ProductsLists from "@/pages/ProductsList";
import Register from "@/pages/Register";
import { type RouteObject } from "react-router-dom";

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
      }
    ],
  },
];

export default routesConfig;