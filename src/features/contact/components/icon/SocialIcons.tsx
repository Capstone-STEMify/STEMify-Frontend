// src/components/SocialIcons.tsx
"use client";
import { motion } from "framer-motion";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaTwitter } from "react-icons/fa";
import { type Variants } from "framer-motion";

const SocialIcons = () => {
  const icons = [
    { icon: <FaFacebookF />, href: "#" },
    { icon: <FaInstagram />, href: "#" },
    { icon: <FaLinkedinIn />, href: "#" },
    { icon: <FaTwitter />, href: "#" },
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 1, 
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <motion.div
      className="absolute top-3/4 right-0 transform -translate-y-1/2 flex flex-col gap-4 bg-brand-purple pl-3 pr-3 py-4 rounded-l-2xl z-10 bg-sky-300 inset-shadow-sky-500" 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {icons.map((item, index) => (
        <motion.a
          key={index}
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 bg-opacity-0 rounded-full text-white transition-colors duration-300 bg-sky-600"
          variants={itemVariants}
          whileHover={{ scale: 1.1, rotate: 360 }}
          whileTap={{ scale: 0.9 }}
        >
          {item.icon}
        </motion.a>
      ))}
    </motion.div>
  );
};

export default SocialIcons;