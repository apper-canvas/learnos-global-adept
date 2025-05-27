import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '../components/ApperIcon'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div 
        className="text-center max-w-md mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center"
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ApperIcon name="BookX" className="w-12 h-12 text-white" />
        </motion.div>
        
        <h1 className="text-6xl font-bold gradient-text mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
          Learning Path Not Found
        </h2>
        <p className="text-slate-600 dark:text-slate-400 mb-8">
          Looks like this learning module doesn't exist. Let's get you back to your learning dashboard.
        </p>
        
        <Link 
          to="/"
          className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-300"
        >
          <ApperIcon name="Home" className="w-5 h-5" />
          <span>Return to Dashboard</span>
        </Link>
      </motion.div>
    </div>
  )
}