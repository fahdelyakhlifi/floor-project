"use client"

import { motion } from "framer-motion"
import { Facebook, Instagram, Linkedin, Youtube, Mail, Phone, MapPin } from "lucide-react"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook", color: "hover:text-blue-400" },
    { icon: Instagram, href: "#", label: "Instagram", color: "hover:text-pink-400" },
    { icon: Linkedin, href: "#", label: "LinkedIn", color: "hover:text-blue-500" },
    { icon: Youtube, href: "#", label: "YouTube", color: "hover:text-red-500" },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  return (
    <footer className="bg-gradient-to-r from-slate-900 to-slate-800 text-slate-300 border-t border-slate-700">
      <div className="container mx-auto px-4 py-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8"
        >
          {/* Brand */}
          <motion.div variants={itemVariants} className="space-y-4">
            <div className="flex items-center gap-3">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="w-10 h-10 bg-gradient-to-br from-[#ADFAFF] to-[#80A8FF] rounded-xl"
              />
              <span className="text-xl font-bold bg-gradient-to-r from-[#ADFAFF] to-[#80A8FF] bg-clip-text text-transparent">
                Floor Designer Pro
              </span>
            </div>
            <p className="text-sm text-slate-400">Professional 3D floor design tool for architects and designers</p>
          </motion.div>

          {/* Product */}
          <motion.div variants={itemVariants}>
            <h4 className="font-semibold text-white mb-4">Product</h4>
            <ul className="space-y-2 text-sm">
              {["Features", "Pricing", "Gallery", "Documentation"].map((item) => (
                <li key={item}>
                  <motion.a
                    whileHover={{ x: 5 }}
                    href="#"
                    className="text-slate-400 hover:text-[#ADFAFF] transition-colors"
                  >
                    {item}
                  </motion.a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Company */}
          <motion.div variants={itemVariants}>
            <h4 className="font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              {["About", "Blog", "Careers", "Contact"].map((item) => (
                <li key={item}>
                  <motion.a
                    whileHover={{ x: 5 }}
                    href="#"
                    className="text-slate-400 hover:text-[#ADFAFF] transition-colors"
                  >
                    {item}
                  </motion.a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact & Social */}
          <motion.div variants={itemVariants} className="space-y-4">
            <div>
              <h4 className="font-semibold text-white mb-4">Contact</h4>
              <div className="space-y-2 text-sm">
                <motion.a
                  whileHover={{ x: 5 }}
                  href="mailto:info@floordesigner.com"
                  className="flex items-center gap-2 text-slate-400 hover:text-[#ADFAFF] transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  info@floordesigner.com
                </motion.a>
                <motion.a
                  whileHover={{ x: 5 }}
                  href="tel:+1234567890"
                  className="flex items-center gap-2 text-slate-400 hover:text-[#ADFAFF] transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  +1 (234) 567-890
                </motion.a>
                <motion.div className="flex items-center gap-2 text-slate-400">
                  <MapPin className="w-4 h-4" />
                  <span>123 Design St, City</span>
                </motion.div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-3">Follow Us</h4>
              <div className="flex gap-3">
                {socialLinks.map(({ icon: Icon, href, label, color }) => (
                  <motion.a
                    key={label}
                    whileHover={{ scale: 1.2, rotate: 10 }}
                    whileTap={{ scale: 0.9 }}
                    href={href}
                    title={label}
                    className={`w-10 h-10 rounded-lg bg-slate-700 hover:bg-slate-600 flex items-center justify-center transition-colors ${color}`}
                  >
                    <Icon className="w-5 h-5" />
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          className="border-t border-slate-700 pt-8 origin-left"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-400">© {currentYear} Floor Designer Pro. All rights reserved.</p>
            <div className="flex gap-6 text-sm">
              {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((item) => (
                <motion.a
                  key={item}
                  whileHover={{ color: "#ADFAFF" }}
                  href="#"
                  className="text-slate-400 hover:text-[#ADFAFF] transition-colors"
                >
                  {item}
                </motion.a>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
