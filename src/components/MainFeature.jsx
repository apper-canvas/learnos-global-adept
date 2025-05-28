import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from './ApperIcon'

export default function MainFeature() {
  const navigate = useNavigate()

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
  const [expandedNotes, setExpandedNotes] = useState(new Set())
  const [editingNote, setEditingNote] = useState(null)
  const [editForm, setEditForm] = useState({ title: '', content: '', tags: '' })
  const [editingGoal, setEditingGoal] = useState(null)
  const [goalFormData, setGoalFormData] = useState({ title: '', description: '', targetDate: '', progress: 0 })


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

  const handleSubjectClick = (subjectId) => {
    navigate(`/subject/${subjectId}`)
  }

  const handleNoteClick = (noteId) => {
    setExpandedNotes(prev => {
      const newSet = new Set(prev)
      if (newSet.has(noteId)) {
        newSet.delete(noteId)
      } else {
        newSet.add(noteId)
      }
      return newSet
    })
  }

  const handleEditNote = (note) => {
    setEditingNote(note.id)
    setEditForm({
      title: note.title,
      content: note.content,
      tags: note.tags.join(', ')
    })
  }

  const handleUpdateNote = (e) => {
    e.preventDefault()
    if (!editForm.title.trim() || !editForm.content.trim()) {
      toast.error('Please enter both title and content')
      return
    }

    setNotes(prev => prev.map(note => 
      note.id === editingNote
        ? {
            ...note,
            title: editForm.title,
            content: editForm.content,
            tags: editForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
          }
        : note
    ))
    
    setEditingNote(null)
    setEditForm({ title: '', content: '', tags: '' })
    toast.success('Note updated successfully!')
  }

  const handleDeleteNote = (noteId) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      setNotes(prev => prev.filter(note => note.id !== noteId))
      setExpandedNotes(prev => {
        const newSet = new Set(prev)
        newSet.delete(noteId)
        return newSet
      })
      toast.success('Note deleted successfully!')
    }
  }

  const handleAddGoal = (e) => {
    e.preventDefault()
    if (!goalFormData.title.trim()) {
      toast.error('Please enter a goal title')
      return
    }
    if (!goalFormData.targetDate) {
      toast.error('Please select a target date')
      return
    }

    const newGoal = {
      id: Date.now(),
      title: goalFormData.title,
      description: goalFormData.description || 'No description provided',
      progress: parseInt(goalFormData.progress) || 0,
      targetDate: goalFormData.targetDate,
      status: 'in-progress'
    }

    setGoals(prev => [...prev, newGoal])
    setGoalFormData({ title: '', description: '', targetDate: '', progress: 0 })
    setShowAddForm(false)
    toast.success('Goal added successfully!')
  }

  const handleEditGoal = (goal) => {
    setEditingGoal(goal.id)
    setGoalFormData({
      title: goal.title,
      description: goal.description || '',
      targetDate: goal.targetDate,
      progress: goal.progress
    })
  }

  const handleUpdateGoal = (e) => {
    e.preventDefault()
    if (!goalFormData.title.trim()) {
      toast.error('Please enter a goal title')
      return
    }
    if (!goalFormData.targetDate) {
      toast.error('Please select a target date')
      return
    }

    setGoals(prev => prev.map(goal => 
      goal.id === editingGoal
        ? {
            ...goal,
            title: goalFormData.title,
            description: goalFormData.description,
            targetDate: goalFormData.targetDate,
            progress: parseInt(goalFormData.progress)
          }
        : goal
    ))
    
    setEditingGoal(null)
    setGoalFormData({ title: '', description: '', targetDate: '', progress: 0 })
    toast.success('Goal updated successfully!')
  }

  const handleDeleteGoal = (goalId) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      setGoals(prev => prev.filter(goal => goal.id !== goalId))
      toast.success('Goal deleted successfully!')
    }
  }

  const handleUpdateGoalProgress = (id, newProgress) => {
    setGoals(prev => prev.map(goal => 
      goal.id === id 
        ? { ...goal, progress: newProgress }
        : goal
    ))
    toast.success('Goal progress updated!')
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
            className="learning-card p-6 group cursor-pointer hover:scale-[1.02] transition-all duration-300"
            onClick={() => handleSubjectClick(subject.id)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 ${subject.color} rounded-xl flex items-center justify-center`}>
                <ApperIcon name="BookOpen" className="w-6 h-6 text-white" />
              </div>
              <div 
                className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => e.stopPropagation()}
              >
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

            <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">Learning Notes</h3>
          <p className="text-slate-600 dark:text-slate-400">Your knowledge repository - Click on notes to expand them</p>
        </div>
        <motion.button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center space-x-2 bg-gradient-to-r from-primary to-secondary text-white px-4 py-2 rounded-xl font-medium hover:shadow-lg transition-all duration-300"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <ApperIcon name="Plus" className="w-4 h-4" />
          <span>Add Note</span>
        </motion.button>
      </div>
      
      <AnimatePresence>
        {showAddForm && (
          <motion.form
            onSubmit={(e) => {
              e.preventDefault()
              if (!formData.title.trim() || !formData.description.trim()) {
                toast.error('Please enter both title and content')
                return
              }

              const newNote = {
                id: Date.now(),
                title: formData.title,
                content: formData.description,
                tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
                createdAt: new Date().toISOString().split('T')[0]
              }

              setNotes(prev => [...prev, newNote])
              setFormData({ title: '', description: '', tags: '' })
              setShowAddForm(false)
              toast.success('Note added successfully!')
            }}
            className="learning-card p-6 space-y-4"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Note Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="learning-input"
                  placeholder="Enter note title"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.tags || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                  className="learning-input"
                  placeholder="e.g., theory, practice, important"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Content
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="learning-input h-32 resize-none"
                placeholder="Write your note content here..."
                required
              />
            </div>
            <div className="flex space-x-3">
              <button
                type="submit"
                className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded-xl font-medium hover:bg-primary-dark transition-colors"
              >
                <ApperIcon name="Check" className="w-4 h-4" />
                <span>Save Note</span>
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
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {notes.map((note, index) => (
          <motion.div
            key={note.id}
            className="learning-card p-6 group cursor-pointer hover:shadow-lg transition-all duration-300"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <div 
              className="flex items-start justify-between mb-3"
              onClick={() => handleNoteClick(note.id)}
            >
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  {note.title}
                </h4>
              </div>
              <div className="flex items-center space-x-2">
                <div 
                  className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => handleEditNote(note)}
                    className="p-1.5 neu-button rounded-lg text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                  >
                    <ApperIcon name="Edit" className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteNote(note.id)}
                    className="p-1.5 neu-button rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <ApperIcon name="Trash2" className="w-4 h-4" />
                  </button>
                </div>
                <motion.div
                  animate={{ rotate: expandedNotes.has(note.id) ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ApperIcon name="ChevronDown" className="w-5 h-5 text-slate-400" />
                </motion.div>
              </div>
            </div>
            
            {/* Preview when collapsed */}
            {!expandedNotes.has(note.id) && (
              <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-3">
                {note.content}
              </p>
            )}
            
            {/* Full content when expanded */}
            <AnimatePresence>
              {expandedNotes.has(note.id) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700"
                >
                  {editingNote === note.id ? (
                    <form onSubmit={handleUpdateNote} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Title
                        </label>
                        <input
                          type="text"
                          value={editForm.title}
                          onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                          className="learning-input"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Content
                        </label>
                        <textarea
                          value={editForm.content}
                          onChange={(e) => setEditForm(prev => ({ ...prev, content: e.target.value }))}
                          className="learning-input h-32 resize-none"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Tags (comma-separated)
                        </label>
                        <input
                          type="text"
                          value={editForm.tags}
                          onChange={(e) => setEditForm(prev => ({ ...prev, tags: e.target.value }))}
                          className="learning-input"
                          placeholder="e.g., theory, practice, important"
                        />
                      </div>
                      <div className="flex space-x-3">
                        <button
                          type="submit"
                          className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded-xl font-medium hover:bg-primary-dark transition-colors"
                        >
                          <ApperIcon name="Check" className="w-4 h-4" />
                          <span>Update</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingNote(null)}
                          className="flex items-center space-x-2 neu-button px-4 py-2 rounded-xl font-medium text-slate-600 dark:text-slate-400"
                        >
                          <ApperIcon name="X" className="w-4 h-4" />
                          <span>Cancel</span>
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-4">
                      <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4">
                        <h5 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">Full Content</h5>
                        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed whitespace-pre-wrap">
                          {note.content}
                        </p>
                      </div>
                      
                      {note.tags && note.tags.length > 0 && (
                        <div>
                          <h5 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">Tags</h5>
                          <div className="flex flex-wrap gap-2">
                            {note.tags.map(tag => (
                              <span
                                key={tag}
                                className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded-lg"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-700">
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          Created {note.createdAt}
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditNote(note)}
                            className="flex items-center space-x-1 text-xs bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 px-2 py-1 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/30 transition-colors"
                          >
                            <ApperIcon name="Edit" className="w-3 h-3" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteNote(note.id)}
                            className="flex items-center space-x-1 text-xs bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 px-2 py-1 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/30 transition-colors"
                          >
                            <ApperIcon name="Trash2" className="w-3 h-3" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  )


  const renderGoals = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">Learning Goals</h3>
          <p className="text-slate-600 dark:text-slate-400">Set and track your learning objectives</p>
        </div>
        <motion.button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center space-x-2 bg-gradient-to-r from-primary to-secondary text-white px-4 py-2 rounded-xl font-medium hover:shadow-lg transition-all duration-300"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <ApperIcon name="Plus" className="w-4 h-4" />
          <span>Add Goal</span>
        </motion.button>
      </div>

      <AnimatePresence>
        {showAddForm && (
          <motion.form
            onSubmit={handleAddGoal}
            className="learning-card p-6 space-y-4"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Goal Title
                </label>
                <input
                  type="text"
                  value={goalFormData.title}
                  onChange={(e) => setGoalFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="learning-input"
                  placeholder="Enter goal title"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Target Date
                </label>
                <input
                  type="date"
                  value={goalFormData.targetDate}
                  onChange={(e) => setGoalFormData(prev => ({ ...prev, targetDate: e.target.value }))}
                  className="learning-input"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Description
              </label>
              <textarea
                value={goalFormData.description}
                onChange={(e) => setGoalFormData(prev => ({ ...prev, description: e.target.value }))}
                className="learning-input h-20 resize-none"
                placeholder="Describe what you want to achieve"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Initial Progress: {goalFormData.progress}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={goalFormData.progress}
                onChange={(e) => setGoalFormData(prev => ({ ...prev, progress: parseInt(e.target.value) }))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>
            <div className="flex space-x-3">
              <button
                type="submit"
                className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded-xl font-medium hover:bg-primary-dark transition-colors"
              >
                <ApperIcon name="Check" className="w-4 h-4" />
                <span>Add Goal</span>
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
      
      <div className="space-y-4">
        {goals.map((goal, index) => (
          <motion.div
            key={goal.id}
            className="learning-card p-6 group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            {editingGoal === goal.id ? (
              <form onSubmit={handleUpdateGoal} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Goal Title
                    </label>
                    <input
                      type="text"
                      value={goalFormData.title}
                      onChange={(e) => setGoalFormData(prev => ({ ...prev, title: e.target.value }))}
                      className="learning-input"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Target Date
                    </label>
                    <input
                      type="date"
                      value={goalFormData.targetDate}
                      onChange={(e) => setGoalFormData(prev => ({ ...prev, targetDate: e.target.value }))}
                      className="learning-input"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={goalFormData.description}
                    onChange={(e) => setGoalFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="learning-input h-20 resize-none"
                    placeholder="Describe what you want to achieve"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Progress: {goalFormData.progress}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={goalFormData.progress}
                    onChange={(e) => setGoalFormData(prev => ({ ...prev, progress: parseInt(e.target.value) }))}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded-xl font-medium hover:bg-primary-dark transition-colors"
                  >
                    <ApperIcon name="Check" className="w-4 h-4" />
                    <span>Update Goal</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingGoal(null)}
                    className="flex items-center space-x-2 neu-button px-4 py-2 rounded-xl font-medium text-slate-600 dark:text-slate-400"
                  >
                    <ApperIcon name="X" className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                </div>
              </form>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-secondary to-accent rounded-xl flex items-center justify-center">
                      <ApperIcon name="Target" className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                        {goal.title}
                      </h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Target: {goal.targetDate}
                      </p>
                      {goal.description && (
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                          {goal.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div 
                      className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <button
                        onClick={() => handleEditGoal(goal)}
                        className="p-1.5 neu-button rounded-lg text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                      >
                        <ApperIcon name="Edit" className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteGoal(goal.id)}
                        className="p-1.5 neu-button rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <ApperIcon name="Trash2" className="w-4 h-4" />
                      </button>
                    </div>
                    <CircularProgress progress={goal.progress} size={60} />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">Progress</span>
                    <span className="font-medium text-slate-900 dark:text-slate-100">{goal.progress}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={goal.progress}
                    onChange={(e) => handleUpdateGoalProgress(goal.id, parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mt-2">
                    <motion.div
                      className="bg-gradient-to-r from-secondary to-accent h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${goal.progress}%` }}
                      transition={{ duration: 1, delay: index * 0.2 }}
                    />
                  </div>
                </div>
              </>
            )}
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