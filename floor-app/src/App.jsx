//C:\Users\Fahd-EL\Desktop\projet stage\Projet Floor\floor-app\src\App.jsx

import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import Home from "./pages/Home"
import Decoration from "./pages/Decoration" 
import CreateTemplatePage from "./pages/CreateTemplatePage"   // ← ADD THIS LINE
import { Toaster } from "sonner"
import Contact from "./pages/Contact"
import Login from "./pages/Login"
import Signup from "./pages/Signup"

function App() {
  const location = useLocation()
  const hideFooterOnRoutes = ["/decoration","/create-template"]   // ⬅️ هنا كنخبيو Footer غير فهاد الصفحة
  const shouldHideFooter = hideFooterOnRoutes.includes(location.pathname.toLowerCase())
  return (
    <div className="flex flex-col min-h-screen">
    <Toaster richColors position="top-center" />   {/* ⬅️ باش يخدم toast */}

      <Navbar />
      <main className="flex-flex-grow pt-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Decoration" element={<Decoration />} />
          <Route path="/create-template" element={<CreateTemplatePage />} />   {/* ← NEW */}
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </main>
      {!shouldHideFooter && <Footer />}  {/* ⬅️ Footer كيتخبّى ف /decoration */}
    </div>
  )
}

export default App
