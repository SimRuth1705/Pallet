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
import AdminLayout from "./Admin/AdminLayout";

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
          </Route>

          <Route path="/admin/*" element={<AdminLayout />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;