import { createHashRouter } from "react-router";
import FrontendLayout from "./layout/FrontendLayout";
import { Children } from "react";
import Home from "./views/front/Home";
import Products from "./views/front/Products";
import Cart from "./views/front/Cart";
import SingleProduct from "./views/front/SingleProduct";
import NotFound from "./views/front/NotFound";

export const router = createHashRouter([
    {
        path: "/",
        element: <FrontendLayout />,
        children: [{
            index: true,
            element: <Home />
        },
        {
            path: "products",
            element: <Products />
        },
        {
            path: "product/:id",
            element: <SingleProduct />
        },
        {
            path: "cart",
            element: <Cart />
        }]
    },
    {
        path: "*",
        element: <NotFound />
    }
])