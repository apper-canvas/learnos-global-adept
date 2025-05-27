import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from './ApperIcon'

export default function MainFeature() {
  const [activeTab, setActiveTab] = useState('subjects')
  const [subjects, setSubjects] = useState([
    { id: 1, title: 'Machine Learning', description: 'Deep learning fundamentals', progress: 75, color: 'bg-blue-500', modules: 12, completedModules: 9 },
    { id: 2, title: 'React Development', description: 'Modern web development', progress: 60, color: 'bg-cyan-500', modules: 8, completedModules: 5 },
    { id: 3, title: 'Data Science', description: 'Analytics and visualization', progress: 40, color: 'bg-purple-500', modules: 15, completedModules: 6 }
  ])
  
  const [notes, setNotes] = useState([
    { id: 1, title: 'Neural Networks Basics', content: 'Key concepts: perceptrons, backpropagation, activation functions...', subjectId: 1, tags: ['ML', 'Neural Networks'], createdAt: '2024-01-15' },
    { id: 2, title: 'React Hooks Patterns', content: 'useState, useEffect, custom hooks best practices...', subjectId: 2, tags: ['React', 'Hooks'], createdAt: '2024-01-14' }
  ])
  
  const [goals, setGoals] = useState([
    { id: 1, title: 'Complete ML Course', progress: 75, targetDate: '2024-02-28', status: 'in-progress' },
    { id: 2, title: 'Build Portfolio Project', progress: 30, targetDate: '2024-03-15', status: 'in-progress' }
  ])

  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({ title: '', description: '', color: 'bg-blue-500' })

  const tabs = [
    { id: 'subjects', label: 'Subjects', icon: 'BookOpen', count: subjects.length },
    { id: 'notes', label: 'Notes', icon: 'FileText', count: notes.length },
    { id: 'goals', label: 'Goals', icon: 'Target', count: goals.length }
  ]

  const subjectColors = [
    'bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-orange-500', 
    'bg-pink-500', 'bg-indigo-500', 'bg-cyan-500', 'bg-red-500'
  ]

  const handleAddSubject = (e) => {
    e.preventDefault()
    if (!formData.title.trim()) {
      toast.error('Please enter a subject title')
      return
    }

    const newSubject = {
      id: Date.now(),
      title: formData.title,
      description: formData.description || 'No description provided',
      progress: 0,
      color: formData.color,
      modules: 0,
      completedModules: 0
    }

    setSubjects(prev => [...prev, newSubject])
    setFormData({ title: '', description: '', color: 'bg-blue-500' })
    setShowAddForm(false)
    toast.success('Subject added successfully!')
  }

  const handleDeleteSubject = (id) => {
    setSubjects(prev => prev.filter(subject => subject.id !== id))
    toast.success('Subject removed successfully!')
  }

  const handleUpdateProgress = (id, newProgress) => {
    setSubjects(prev => prev.map(subject => 
      subject.id === id 
        ? { ...subject, progress: newProgress, completedModules: Math.floor((newProgress / 100) * subject.modules) }
        : subject
    ))
    toast.success('Progress updated!')
  }

  const CircularProgress = ({ progress, size = 60 }) => {
    const radius = (size - 8) / 2
    const circumference = radius * 2 * Math.PI
    const strokeDasharray = `${(progress / 100) * circumference} ${circumference}`

    return (
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="progress-ring" width={size} height={size}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth="4"
            className="text-slate-200 dark:text-slate-700"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth="4"
            strokeDasharray={strokeDasharray}
            className="text-primary transition-all duration-1000 ease-out"
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            {progress}%
          </span>
        </div>
      </div>
    )
  }

  const renderSubjects = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">Learning Subjects</h3>
          <p className="text-slate-600 dark:text-slate-400">Manage your learning topics and track progress</p>
        </div>
        <motion.button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center space-x-2 bg-gradient-to-r from-primary to-secondary text-white px-4 py-2 rounded-xl font-medium hover:shadow-lg transition-all duration-300"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <ApperIcon name="Plus" className="w-4 h-4" />
          <span>Add Subject</span>
        </motion.button>
      </div>

      <AnimatePresence>
        {showAddForm && (
          <motion.form
            onSubmit={handleAddSubject}
            className="learning-card p-6 space-y-4"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Subject Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="learning-input"
                  placeholder="Enter subject title"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Color Theme
                </label>
                <div className="flex space-x-2">
                  {subjectColors.map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, color }))}
                      className={`w-8 h-8 rounded-lg ${color} ${formData.color === color ? 'ring-2 ring-primary ring-offset-2' : ''}`}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="learning-input h-20 resize-none"
                placeholder="Brief description of what you'll learn"
              />
            </div>
            <div className="flex space-x-3">
              <button
                type="submit"
                className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded-xl font-medium hover:bg-primary-dark transition-colors"
              >
                <ApperIcon name="Check" className="w-4 h-4" />
                <span>Add Subject</span>
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="flex items-center space-x-2 neu-button px-4 py-2 rounded-xl font-medium text-slate-600 dark:text-slate-400"
              >
                <ApperIcon name="X" className="w-4 h-4" />
                <span>Cancel</span>
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {subjects.map((subject, index) => (
          <motion.div
            key={subject.id}
            className="learning-card p-6 group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >

          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 ${subject.color} rounded-xl flex items-center justify-center`}>
                <ApperIcon name="BookOpen" className="w-6 h-6 text-white" />
              </div>
              <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleDeleteSubject(subject.id)}
                  className="p-1.5 neu-button rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <ApperIcon name="Trash2" className="w-4 h-4" />
                </button>
              </div>
            </div>

            <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
              {subject.title}
            </h4>
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
              {subject.description}
            </p>

            <div className="flex items-center justify-between mb-4">
              <div className="text-sm text-slate-600 dark:text-slate-400">
                {subject.completedModules} / {subject.modules} modules
              </div>
              <CircularProgress progress={subject.progress} size={50} />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400">Progress</span>
                <span className="font-medium text-slate-900 dark:text-slate-100">{subject.progress}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={subject.progress}
                onChange={(e) => handleUpdateProgress(subject.id, parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )

  const renderNotes = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">Learning Notes</h3>
        <p className="text-slate-600 dark:text-slate-400">Your knowledge repository</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {notes.map((note, index) => (
          <motion.div
            key={note.id}
            className="learning-card p-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <div className="flex items-start justify-between mb-3">
              <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                {note.title}
              </h4>
              <ApperIcon name="FileText" className="w-5 h-5 text-slate-400" />
            </div>
            
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-3">
              {note.content}
            </p>
            
            <div className="flex flex-wrap gap-2 mb-3">
              {note.tags.map(tag => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded-lg"
                >
                  {tag}
                </span>
              ))}
            </div>
            
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Created {note.createdAt}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )

  const renderGoals = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">Learning Goals</h3>
        <p className="text-slate-600 dark:text-slate-400">Track your learning objectives</p>
      </div>
      
      <div className="space-y-4">
        {goals.map((goal, index) => (
          <motion.div
            key={goal.id}
            className="learning-card p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-secondary to-accent rounded-xl flex items-center justify-center">
                  <ApperIcon name="Target" className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                    {goal.title}
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Target: {goal.targetDate}
                  </p>
                </div>
              </div>
              <CircularProgress progress={goal.progress} size={60} />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400">Progress</span>
                <span className="font-medium text-slate-900 dark:text-slate-100">{goal.progress}%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                <motion.div
                  className="bg-gradient-to-r from-secondary to-accent h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${goal.progress}%` }}
                  transition={{ duration: 1, delay: index * 0.2 }}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )

  return (
    <div className="learning-card p-6 lg:p-8">
      {/* Tab Navigation */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0">
        <div className="flex space-x-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
          {tabs.map(tab => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-slate-700 text-primary shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <ApperIcon name={tab.icon} className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="bg-slate-200 dark:bg-slate-600 text-xs px-2 py-0.5 rounded-full">
                {tab.count}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'subjects' && renderSubjects()}
          {activeTab === 'notes' && renderNotes()}
          {activeTab === 'goals' && renderGoals()}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}