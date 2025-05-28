import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '../components/ApperIcon'
import MainFeature from '../components/MainFeature'

export default function Home() {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    })
  }

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const quickAccessItems = [
    {
      title: 'Achievements',
      description: 'Track your learning milestones and accomplishments',
      icon: 'Award',
      gradient: 'from-yellow-400 to-orange-500',
      link: '/achievements',
      stats: 'View & manage achievements'
    },
    {
      title: 'Subjects',
      description: 'Browse and manage your learning subjects',
      icon: 'BookOpen',
      gradient: 'from-blue-500 to-purple-600',
      link: '/subjects',
      stats: 'Explore subjects'
    },
    {
      title: 'Goals',
      description: 'Set and track your learning objectives',
      icon: 'Target',
      gradient: 'from-green-500 to-blue-500',
      link: '/goals',
      stats: 'Manage goals'
    },
    {
      title: 'Notes',
      description: 'Capture and organize your learning notes',
      icon: 'FileText',
      gradient: 'from-purple-500 to-pink-500',
      link: '/notes',
      stats: 'Create & review notes'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <h1 className="text-4xl md:text-6xl font-bold gradient-text mb-4">
              LearnOS
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400 mb-6">
              Your Personal Learning Operating System
            </p>
            
            {/* Live Clock */}
            <div className="learning-card p-6 max-w-md mx-auto">
              <div className="text-center">
                <div className="text-3xl font-mono font-bold text-primary mb-2">
                  {formatTime(currentTime)}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  {formatDate(currentTime)}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Quick Access Section */}
        <div className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center mb-8"
          >
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
              Quick Access
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              Jump into your learning journey
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickAccessItems.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
              >
                <Link to={item.link} className="block">
                  <div className="learning-card p-6 group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    <div className="text-center">
                      <div className={`w-16 h-16 bg-gradient-to-br ${item.gradient} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                        <ApperIcon name={item.icon} className="w-8 h-8 text-white" />
                      </div>
                      
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2 group-hover:text-primary transition-colors">
                        {item.title}
                      </h3>
                      
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                        {item.description}
                      </p>
                      
                      <div className="text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                        {item.stats}
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Main Feature Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <MainFeature />
        </motion.div>

        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="text-center mt-16"
        >
          <div className="learning-card p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              Welcome to Your Learning Hub
            </h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              LearnOS is designed to help you organize, track, and achieve your learning goals. 
              Whether you're studying new subjects, taking notes, or celebrating achievements, 
              everything you need is right here at your fingertips.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}