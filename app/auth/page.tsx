'use client';
// import LoginButton from '@/components/ui/'
import { FaGoogle } from 'react-icons/fa'
import { motion } from 'framer-motion'
import { BarChart3 } from 'lucide-react'
import { signIn } from 'next-auth/react';
import { redirect } from 'next/navigation'
import { useSession } from 'next-auth/react';
export default function AuthPage() {
    const { data: session } = useSession();
    if(session){
      redirect('/dashboard/explore');
    }
  return (
    <div className="flex min-h-screen bg-gray-950 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_200px,#2563eb10,transparent)]" />
      <div className="flex flex-1 flex-col justify-center items-center px-4 sm:px-6 lg:px-20 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto w-full max-w-md"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col items-center space-y-6 mb-10"
          >
            <div className="flex items-center justify-center p-3 bg-blue-600/20 border border-blue-500/20 rounded-xl">
              <BarChart3 className="w-10 h-10 text-blue-500" />
            </div>
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-bold tracking-tight text-white font-oswald">
                Welcome to Ournotes
              </h1>
              <p className="text-gray-400 font-jakarta">
                Sign in to access your dashboard
              </p>
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-gradient-to-r from-blue-600/10 to-blue-600/10 border border-blue-500/20 rounded-xl p-8 shadow-xl"
          >
            <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <button
        onClick={()=>{
            signIn('google')
        }}
        className="w-full py-6 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-300 flex items-center justify-center gap-3 shadow-lg shadow-blue-500/20 cursor-pointer"
      >
        <FaGoogle className="text-xl" />
        <span className="text-base">Sign in with Google</span>
      </button>
    </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}