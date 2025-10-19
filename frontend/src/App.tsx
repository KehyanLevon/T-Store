import "./App.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import Dashboard from "./pages/Dashboard";
import ProductCreate from "./pages/ProductCreate";
import ProductEdit from "./pages/ProductEdit";
import Account from "./pages/Account";
import ProductDetail from "./pages/ProductDetail";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { fetchMeFx } from "./entities/auth/model";
import { loadLikesRequested } from "./entities/likes/model";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

function App() {
  useEffect(() => {
    fetchMeFx().catch(() => {});
    loadLikesRequested();
  }, []);

  return (
    <Router>
      <div className="page">
        <Header></Header>

        <main className="main">
          <div className="main__inner container">
            <div className="main__content">
              <Routes>
                <Route path="/" element={<Welcome />} />
                <Route path="/login" element={<Login />} />
                <Route path="/registration" element={<Registration />} />
                <Route path="/products" element={<Dashboard />} />
                <Route path="/products/new" element={<ProductCreate />} />
                <Route path="/account" element={<Account />} />
                <Route path="/products/:id" element={<ProductDetail />} />
                <Route path="/products/:id/edit" element={<ProductEdit />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
              </Routes>
            </div>
          </div>
        </main>

        <Footer></Footer>
      </div>
    </Router>
  );
}

export default App;
