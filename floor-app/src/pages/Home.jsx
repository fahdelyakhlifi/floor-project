"use client"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"

const Home = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
      },
    },
    hover: {
      scale: 1.02,
      y: -8,
      transition: {
        duration: 0.3,
      },
    },
  }

  const statsVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
      },
    },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          className="absolute top-1/4 -left-10 w-72 h-72 bg-[#80A8FF] rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{
            duration: 6,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute bottom-1/4 -right-10 w-96 h-96 bg-[#ADFAFF] rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.05, 0.1, 0.05],
          }}
          transition={{
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#80A8FF] rounded-full blur-3xl"
        />
      </div>

      <div className="relative pt-20 pb-16">
        <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center max-w-6xl mx-auto"
          >
            <motion.div variants={itemVariants} className="inline-block mb-8">
              <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700/50 px-6 py-3 rounded-2xl">
                <span className="bg-gradient-to-r from-[#ADFAFF] to-[#80A8FF] bg-clip-text text-transparent text-sm font-semibold">
                  ARCHITECTURE 3D PROFESSIONNELLE
                </span>
              </div>
            </motion.div>

            <motion.h1 variants={itemVariants} className="text-5xl sm:text-7xl lg:text-8xl font-bold mb-8">
              <span className="bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">
                Floor <span className="bg-gradient-to-r from-[#ADFAFF] via-[#80A8FF] to-[#ADFAFF] bg-clip-text text-transparent">
              Designer
              </span> 
              </span>
              
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-xl sm:text-2xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed"
            >
              Create stunning <span className="text-[#ADFAFF] font-semibold"> floor designs</span> in real-time with
              our professional design tool.
              <span className="text-[#80A8FF]"> Visualize instantly</span> and transform your spaces with architectural
              precision.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link to="/decoration">
                <motion.button
                  variants={itemVariants}
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 20px 40px rgba(173, 250, 255, 0.3)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-[#80A8FF] to-[#ADFAFF] text-white px-8 sm:px-12 py-4 rounded-2xl text-lg font-semibold shadow-2xl hover:from-[#ADFAFF] hover:to-[#80A8FF] transition-all duration-300 flex items-center space-x-3 group"
                >
                  <span>Commencer la Création</span>
                  <motion.span
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                    className="group-hover:translate-x-1 transition-transform duration-200"
                  >
                    →
                  </motion.span>
                </motion.button>
              </Link>

              <motion.button
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-slate-600 text-slate-300 px-8 py-4 rounded-2xl text-lg font-semibold hover:border-[#ADFAFF] hover:text-[#ADFAFF] transition-all duration-300 backdrop-blur-sm"
              >
                Voir la Galerie
              </motion.button>
            </motion.div>
          </motion.div>
        </section>

        <section className="relative py-20 px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="max-w-6xl mx-auto"
          >
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl sm:text-5xl font-bold text-center mb-16"
            >
              <span className="bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">
                Fonctionnalités
              </span>
              <span className="bg-gradient-to-r from-[#ADFAFF] to-[#80A8FF] bg-clip-text text-transparent">
                {" "}
                Premium
              </span>
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: "🎨",
                  title: "Design Réaliste",
                  description: "Rendu 3D haute définition avec éclairage naturel et textures photoréalistes",
                  gradient: "from-[#80A8FF] to-[#ADFAFF]",
                },
                {
                  icon: "⚡",
                  title: "Temps Réel",
                  description: "Modifications instantanées avec prévisualisation en temps réel sans délai",
                  gradient: "from-[#ADFAFF] to-[#80A8FF]",
                },
                {
                  icon: "📐",
                  title: "Précision Architecturale",
                  description: "Outils de mesure avancés et proportions exactes pour les professionnels",
                  gradient: "from-[#80A8FF] to-[#ADFAFF]",
                },
                {
                  icon: "💎",
                  title: "Matériaux Premium",
                  description: "Bibliothèque exhaustive de matériaux et finitions haute gamme",
                  gradient: "from-[#ADFAFF] to-[#80A8FF]",
                },
                {
                  icon: "🔄",
                  title: "Collaboration",
                  description: "Travaillez en équipe avec le partage et les commentaires en temps réel",
                  gradient: "from-[#80A8FF] to-[#ADFAFF]",
                },
                {
                  icon: "📱",
                  title: "Multi-Device",
                  description: "Conception responsive accessible sur tous vos appareils",
                  gradient: "from-[#ADFAFF] to-[#80A8FF]",
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  whileHover="hover"
                  className="bg-slate-800/50 backdrop-blur-lg p-8 rounded-3xl border border-slate-700/50 shadow-2xl hover:shadow-3xl transition-all duration-300"
                >
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                    className={`text-3xl mb-6 w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center shadow-lg`}
                  >
                    {feature.icon}
                  </motion.div>
                  <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        <section className="relative py-20 px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="max-w-6xl mx-auto"
          >
            <div className="bg-slate-800/30 backdrop-blur-lg rounded-3xl p-8 sm:p-12 border border-slate-700/50 shadow-2xl">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="space-y-6"
                >
                  <h3 className="text-3xl font-bold text-white mb-8">
                    Rendu{" "}
                    <span className="bg-gradient-to-r from-[#ADFAFF] to-[#80A8FF] bg-clip-text text-transparent">
                      3D Immersif
                    </span>
                  </h3>

                  {[
                    { text: "Rendu haute résolution 4K", color: "bg-green-400" },
                    { text: "Textures réalistes PBR", color: "bg-[#ADFAFF]" },
                    { text: "Éclairage dynamique HDR", color: "bg-[#80A8FF]" },
                    { text: "Perspective architecturale", color: "bg-purple-400" },
                    { text: "Animations fluides 60FPS", color: "bg-blue-400" },
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center space-x-4 group"
                    >
                      <div
                        className={`w-3 h-3 ${item.color} rounded-full animate-pulse group-hover:scale-150 transition-transform duration-300`}
                      ></div>
                      <span className="text-slate-300 group-hover:text-white transition-colors duration-300">
                        {item.text}
                      </span>
                    </motion.div>
                  ))}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="relative"
                >
                  <div className="bg-gradient-to-br from-[#80A8FF]/20 to-[#ADFAFF]/20 rounded-2xl p-8 border border-slate-600/50">
                    <div className="bg-slate-900 rounded-xl p-6 shadow-2xl">
                      <div className="grid grid-cols-4 gap-3 transform perspective-1000">
                        {Array.from({ length: 16 }).map((_, i) => (
                          <motion.div
                            key={i}
                            animate={{
                              scale: [1, 1.1, 1],
                              opacity: [0.6, 1, 0.6],
                              y: [0, -5, 0],
                            }}
                            transition={{
                              duration: 2,
                              delay: i * 0.1,
                              repeat: Number.POSITIVE_INFINITY,
                            }}
                            className="aspect-square bg-gradient-to-br from-[#80A8FF]/20 to-[#ADFAFF]/20 rounded-lg shadow-lg border border-slate-600/30 backdrop-blur-sm"
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <motion.div
                    animate={{
                      y: [0, -10, 0],
                      rotate: [0, 2, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    }}
                    className="absolute -top-3 -right-3 bg-gradient-to-r from-[#80A8FF] to-[#ADFAFF] text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg"
                  >
                    Nouveau
                  </motion.div>

                  <motion.div
                    animate={{
                      y: [0, -15, 0],
                      rotate: [0, -2, 0],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                      delay: 1,
                    }}
                    className="absolute -bottom-3 -left-3 bg-gradient-to-r from-[#ADFAFF] to-[#80A8FF] text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg"
                  >
                    Rendu 3D
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </section>

        <section className="relative py-20 px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { number: "10K+", label: "Designs Créés", suffix: "" },
                { number: "99", label: "Satisfaction", suffix: "%" },
                { number: "24/7", label: "Support", suffix: "" },
                { number: "4.9", label: "Évaluation", suffix: "/5" },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  variants={statsVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center bg-slate-800/50 backdrop-blur-lg p-8 rounded-2xl border border-slate-700/50 shadow-xl hover:shadow-2xl transition-all duration-300"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      type: "spring",
                      stiffness: 200,
                      delay: index * 0.2,
                    }}
                    className="text-3xl font-bold bg-gradient-to-r from-[#ADFAFF] to-[#80A8FF] bg-clip-text text-transparent mb-2"
                  >
                    {stat.number}
                    <span className="text-[#ADFAFF]">{stat.suffix}</span>
                  </motion.div>
                  <div className="text-slate-400 text-sm font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>
      </div>

      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-[#ADFAFF] rounded-full"
            animate={{
              y: [0, -100, 0],
              x: [0, Math.sin(i) * 30, 0],
              opacity: [0, 0.8, 0],
            }}
            transition={{
              duration: 4 + i * 0.5,
              repeat: Number.POSITIVE_INFINITY,
              delay: i * 0.3,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>
    </div>
  )
}

export default Home
