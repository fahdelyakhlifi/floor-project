//C:\Users\Fahd-EL\Desktop\projet stage\Projet Floor\floor-app\src\components\Navbar.jsx

import { Link } from "react-router-dom"
import { useState } from "react"
import { motion } from "framer-motion"
import { Menu, X, Home, Palette, Mail, LogIn } from "lucide-react"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { to: "/", label: "Home", icon: Home },
    { to: "/decoration", label: "decoration", icon: Palette },
    { to: "/contact", label: "Contact", icon: Mail },
  ]

  return (
    <nav className="bg-gradient-to-r from-slate-900 to-slate-800 shadow-2xl fixed top-0 left-0 right-0 z-50 border-b border-slate-700/50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="w-10 h-10 bg-gradient-to-br from-[#ADFAFF] to-[#80A8FF] rounded-xl shadow-lg group-hover:shadow-[#ADFAFF]/50 transition-all"
            />
            <span className="text-2xl font-bold bg-gradient-to-r from-[#ADFAFF] to-[#80A8FF] bg-clip-text text-transparent">
              Floor Designer
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-8 items-center">
            {navItems.map(({ to, label, icon: Icon }) => (
              <Link key={to} to={to}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-2 text-slate-300 hover:text-[#ADFAFF] transition-colors font-medium group"
                >
                  <Icon className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                  {label}
                </motion.div>
              </Link>
            ))}
            <Link to="/login">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(173, 250, 255, 0.3)" }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 rounded-lg bg-gradient-to-r from-[#80A8FF] to-[#ADFAFF] text-white font-medium hover:from-[#ADFAFF] hover:to-[#80A8FF] transition-all shadow-lg flex items-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                Login
              </motion.button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-slate-300 hover:text-[#ADFAFF] transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </motion.button>
        </div>

        {/* Mobile Navigation */}
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: isOpen ? 1 : 0, height: isOpen ? "auto" : 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden overflow-hidden"
        >
          <div className="mt-4 space-y-3 pb-4">
            {navItems.map(({ to, label, icon: Icon }) => (
              <Link key={to} to={to}>
                <motion.div
                  whileHover={{ x: 5 }}
                  className="flex items-center gap-2 text-slate-300 hover:text-[#ADFAFF] transition-colors font-medium py-2"
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </motion.div>
              </Link>
            ))}
            <Link to="/login">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full px-6 py-2 rounded-lg bg-gradient-to-r from-[#80A8FF] to-[#ADFAFF] text-white font-medium hover:from-[#ADFAFF] hover:to-[#80A8FF] transition-all flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                Login
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    </nav>
  )
}
