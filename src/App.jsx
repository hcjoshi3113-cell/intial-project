import { useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "./routes/MainLayout";
import Home from "./components/pages/Home";
import About from "./components/ui/About";
import Menu from "./components/pages/Menu";
import FoodDetail from "./components/pages/FoodDetail";
import Cart from "./components/pages/Cart";
import Checkout from "./components/pages/Checkout";
import Auth from "./components/auth/Auth";
import ProtectedRoutes from "./routes/ProtectedRoutes";
import Error from "./components/pages/Error";
import MyOrders from "./components/pages/MyOrders";
import Profile from "./components/pages/Profile";
import Restaurants from "./components/pages/Restaurants";
import { CartProvider } from "./components/context/CartContext";
import { LocationProvider } from "./components/context/LocationContext";

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/auth",
      element: <Auth />,
    },
    {
      path: "/",
      element: <MainLayout />,
      errorElement: <Error />,
      children: [
        {
          index: true,
          element: <Home />,
        },
        {
          path: "about",
          element: <About />,
        },
        {
          path: "restaurants",
          element: <Restaurants />,
        },
        {
          path: "restaurant/:restaurantName",
          element: <Menu />,
        },
        {
          path: "food/:id",
          element: <FoodDetail />,
        },
        {
          path: "cart",
          element: <Cart />,
        },
        {
          element: <ProtectedRoutes />,
          children: [
            {
              path: "/checkout",
              element: <Checkout />
            },
            {
              path: "/myorders",
              element: <MyOrders />
            },
            {
              path: "/profile",
              element: <Profile />
            }
          ]
        }
      ],
    },
  ]);

  return (
    <LocationProvider>
      <CartProvider>
        <RouterProvider router={router}></RouterProvider>
      </CartProvider>
    </LocationProvider>
  );
};

export default App;
