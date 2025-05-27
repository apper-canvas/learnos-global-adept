import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import MainFeature from '../components/MainFeature'
import ApperIcon from '../components/ApperIcon'

export default function Home() {
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])

  const quickStats = [
    { label: 'Active Subjects', value: '8', icon: 'BookOpen', color: 'text-blue-600' },
    { label: 'Study Hours', value: '24.5', icon: 'Clock', color: 'text-green-600' },
    { label: 'Completed Goals', value: '12', icon: 'Target', color: 'text-purple-600' },
    { label: 'Notes Created', value: '156', icon: 'FileText', color: 'text-orange-600' }
  ]

  return (
    <div className="min-h-screen">
      {/* Header */}
      <motion.header 
        className="sticky top-0 z-50 glass-effect border-b border-white/20 dark:border-slate-700/50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                <ApperIcon name="Brain" className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold gradient-text">LearnOS</h1>
                <p className="text-xs text-slate-600 dark:text-slate-400">Personal Learning OS</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2 neu-button rounded-xl"
              >
                <ApperIcon 
                  name={isDarkMode ? 'Sun' : 'Moon'} 
                  className="w-5 h-5 text-slate-600 dark:text-slate-400" 
                />
              </button>
              
              <div className="flex items-center space-x-2 bg-primary/10 dark:bg-primary/20 px-3 py-2 rounded-xl">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                  <ApperIcon name="User" className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Learning Mode</span>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Quick Stats */}
      <motion.section 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="learning-card p-4 lg:p-6"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.1 * index }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center justify-between mb-2">
                <ApperIcon name={stat.icon} className={`w-5 h-5 lg:w-6 lg:h-6 ${stat.color}`} />
                <span className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-slate-100">
                  {stat.value}
                </span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Main Feature */}
      <motion.main 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <MainFeature />
      </motion.main>
    </div>
  )
}