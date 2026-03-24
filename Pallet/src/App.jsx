import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { CartProvider } from "./context/CartContext";
import Layout from "./components/Layout";

import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import CollectionPage from "./pages/CollectionPage";
import ProductDetails from "./pages/ProductDetails";
import MyOrderPage from "./pages/MyOrderPage";
import Checkout from "./pages/Checkout";
import OrderDetailsPage from "./pages/OrderDetailsPage";
import Sport from "./pages/Sport";
import Brands from "./pages/Brands";
import NewArrivals from "./pages/NewArrivals";
import Favorites from "./pages/Favorites";
import AdminLayout from "./Admin/AdminLayout";
import AdminProducts from "./Admin/AdminProducts";
import AdminDashboard from "./Admin/AdminDashboard";
import AdminOrders from "./Admin/AdminOrders";
import AdminUsers from "./Admin/AdminUsers";
import AdminOffers from "./Admin/AdminOffers";
import AdminSettings from "./Admin/AdminSettings";

function App() {
  return (
    <CartProvider>
      <Router>
        <Toaster position="top-right" richColors />
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/collections" element={<CollectionPage />} />
            <Route path="/collections/:collection" element={<CollectionPage />} />
            <Route path="/product/:productId" element={<ProductDetails />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-confirmation" element={<OrderDetailsPage />} />
            <Route path="/my-orders" element={<MyOrderPage />} />
            <Route path="/sport" element={<Sport />} />
            <Route path="/brands" element={<Brands />} />
            <Route path="/new" element={<NewArrivals />} />
            <Route path="/favorite" element={<Favorites />} />
          </Route>

          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="offers" element={<AdminOffers />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;