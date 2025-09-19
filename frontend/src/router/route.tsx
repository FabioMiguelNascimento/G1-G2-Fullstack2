import App from "@/App";
import Home from "@/pages/Home";
import NotFound from "@/pages/NotFound";
import Product from "@/pages/Product";
import Cart from "@/pages/Cart";
import Login from "@/pages/Login";
import { type RouteObject } from "react-router-dom";
import ProductsLists from "@/pages/ProductsList";
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
];

export default routesConfig;
