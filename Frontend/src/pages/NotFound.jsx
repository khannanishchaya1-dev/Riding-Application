import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const NotFound = () => {
  return (
    <div className='h-[100dvh] w-full bg-black flex flex-col items-center justify-center px-6 text-center overflow-hidden'>

      {/* Animated 404 */}
      <motion.h1
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.5,
          type: 'spring',
          stiffness: 120,
        }}
        className='text-[120px] md:text-[160px] font-extrabold text-white leading-none'
      >
        404
      </motion.h1>

      {/* Text */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className='text-2xl md:text-3xl font-semibold text-red-500 mt-2'
      >
        Page Not Found
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className='text-gray-400 mt-4 max-w-md text-sm md:text-base'
      >
        The page you are looking for doesn’t exist or has been moved.
      </motion.p>

      {/* Button */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Link
          to='/'
          className='mt-8 inline-block border border-white/20 px-6 py-3 rounded-full text-white hover:bg-white hover:text-black transition-all duration-300'
        >
          Go Back Home
        </Link>
      </motion.div>

    </div>
  )
}

export default NotFound