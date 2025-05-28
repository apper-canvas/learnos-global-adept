import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from './ApperIcon'
import { subjectService } from '../services/subjectService'
import { noteService } from '../services/noteService'
import { goalService } from '../services/goalService'

export default function MainFeature() {
  const navigate = useNavigate()
  const { user, isAuthenticated } = useSelector((state) => state.user)

  const [activeTab, setActiveTab] = useState('subjects')
  
  // Data states
  const [subjects, setSubjects] = useState([])
  const [notes, setNotes] = useState([])
  const [goals, setGoals] = useState([])
  
  // Loading states
  const [loadingSubjects, setLoadingSubjects] = useState(false)
  const [loadingNotes, setLoadingNotes] = useState(false)
  const [loadingGoals, setLoadingGoals] = useState(false)
  
  // Form states
  const [showAddForm, setShowAddForm] = useState(false)
  const [expandedNotes, setExpandedNotes] = useState(new Set())
  const [editingNote, setEditingNote] = useState(null)
  const [editForm, setEditForm] = useState({ title: '', content: '', tags: '' })
  const [editingGoal, setEditingGoal] = useState(null)
  const [goalFormData, setGoalFormData] = useState({ title: '', description: '', targetDate: '', progress: 0 })
  const [formData, setFormData] = useState({ title: '', description: '', color: 'bg-blue-500', tags: '' })

  const tabs = [
    { id: 'subjects', label: 'Subjects', icon: 'BookOpen', count: subjects.length },
    { id: 'notes', label: 'Notes', icon: 'FileText', count: notes.length },
    { id: 'goals', label: 'Goals', icon: 'Target', count: goals.length }
  ]

  const subjectColors = [
    'bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-orange-500', 
    'bg-pink-500', 'bg-indigo-500', 'bg-cyan-500', 'bg-red-500'
  ]

  // Fetch subjects from database
  const fetchSubjects = async () => {
    if (!isAuthenticated) return
    
    setLoadingSubjects(true)
    try {
      const data = await subjectService.fetchSubjects()
      setSubjects(data || [])
    } catch (error) {
      console.error('Error fetching subjects:', error)
      toast.error('Failed to load subjects')
      setSubjects([])
    } finally {
      setLoadingSubjects(false)
    }
  }

  // Fetch notes from database
  const fetchNotes = async () => {
    if (!isAuthenticated) return
    
    setLoadingNotes(true)
    try {
      const data = await noteService.fetchNotes()
      setNotes(data || [])
    } catch (error) {
      console.error('Error fetching notes:', error)
      toast.error('Failed to load notes')
      setNotes([])
    } finally {
      setLoadingNotes(false)
    }
  }

  // Fetch goals from database
  const fetchGoals = async () => {
    if (!isAuthenticated) return
    
    setLoadingGoals(true)
    try {
      const data = await goalService.fetchGoals()
      setGoals(data || [])
    } catch (error) {
      console.error('Error fetching goals:', error)
      toast.error('Failed to load goals')
      setGoals([])
    } finally {
      setLoadingGoals(false)
    }
  }

  // Load data when component mounts or authentication changes
  useEffect(() => {
    if (isAuthenticated) {
      fetchSubjects()
      fetchNotes() 
      fetchGoals()
    }
  }, [isAuthenticated])

  // Load data when tab changes
  useEffect(() => {
    if (!isAuthenticated) return
    
    switch (activeTab) {
      case 'subjects':
        if (subjects.length === 0) fetchSubjects()
        break
      case 'notes':
        if (notes.length === 0) fetchNotes()
        break
      case 'goals':
        if (goals.length === 0) fetchGoals()
        break
    }
  }, [activeTab, isAuthenticated])

  const handleAddSubject = async (e) => {
    e.preventDefault()
    if (!formData.title.trim()) {
      toast.error('Please enter a subject title')
      return
    }

    setLoadingSubjects(true)
    try {
      const subjectData = {
        Name: formData.title,
        title: formData.title,
        description: formData.description || 'No description provided',
        progress: 0,
        color: formData.color,
        modules: 0,
        completed_modules: 0,
        enrolled_date: new Date().toISOString().split('T')[0]
      }

      const newSubject = await subjectService.createSubject(subjectData)
      setSubjects(prev => [newSubject, ...prev])
      setFormData({ title: '', description: '', color: 'bg-blue-500' })
      setShowAddForm(false)
      toast.success('Subject added successfully!')
    } catch (error) {
      console.error('Error adding subject:', error)
      toast.error('Failed to add subject')
    } finally {
      setLoadingSubjects(false)
    }
  }

  const handleDeleteSubject = async (id) => {
    if (!window.confirm('Are you sure you want to delete this subject?')) return
    
    setLoadingSubjects(true)
    try {
      await subjectService.deleteSubject(id)
      setSubjects(prev => prev.filter(subject => subject.Id !== id))
      toast.success('Subject deleted successfully!')
    } catch (error) {
      console.error('Error deleting subject:', error)
      toast.error('Failed to delete subject')
    } finally {
      setLoadingSubjects(false)
    }
  }

  const handleUpdateProgress = async (id, newProgress) => {
    setLoadingSubjects(true)
    try {
      const subject = subjects.find(s => s.Id === id)
      if (!subject) return
      
      const updateData = {
        progress: newProgress,
        completed_modules: Math.floor((newProgress / 100) * (subject.modules || 0))
      }
      
      await subjectService.updateSubject(id, updateData)
      
      setSubjects(prev => prev.map(subject => 
        subject.Id === id 
          ? { ...subject, ...updateData }
          : subject
      ))
      toast.success('Progress updated!')
    } catch (error) {
      console.error('Error updating progress:', error)
      toast.error('Failed to update progress')
    } finally {
      setLoadingSubjects(false)
    }
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
    setEditingNote(note.Id)
    setEditForm({
      title: note.title || note.Name || '',
      content: note.content || '',
      tags: note.Tags || ''
    })
  }

  const handleUpdateNote = async (e) => {
    e.preventDefault()
    if (!editForm.title.trim() || !editForm.content.trim()) {
      toast.error('Please enter both title and content')
      return
    }

    setLoadingNotes(true)
    try {
      const updateData = {
        Name: editForm.title,
        title: editForm.title,
        content: editForm.content,
        Tags: editForm.tags
      }
      
      await noteService.updateNote(editingNote, updateData)
      
      setNotes(prev => prev.map(note => 
        note.Id === editingNote
          ? { ...note, ...updateData }
          : note
      ))
      
      setEditingNote(null)
      setEditForm({ title: '', content: '', tags: '' })
      toast.success('Note updated successfully!')
    } catch (error) {
      console.error('Error updating note:', error)
      toast.error('Failed to update note')
    } finally {
      setLoadingNotes(false)
    }
  }

  const handleDeleteNote = async (noteId) => {
    if (!window.confirm('Are you sure you want to delete this note?')) return
    
    setLoadingNotes(true)
    try {
      await noteService.deleteNote(noteId)
      setNotes(prev => prev.filter(note => note.Id !== noteId))
      setExpandedNotes(prev => {
        const newSet = new Set(prev)
        newSet.delete(noteId)
        return newSet
      })
      toast.success('Note deleted successfully!')
    } catch (error) {
      console.error('Error deleting note:', error)
      toast.error('Failed to delete note')
    } finally {
      setLoadingNotes(false)
    }
  }

  const handleAddNote = async (e) => {
    e.preventDefault()
    if (!formData.title.trim() || !formData.description.trim()) {
      toast.error('Please enter both title and content')
      return
    }

    setLoadingNotes(true)
    try {
      const noteData = {
        Name: formData.title,
        title: formData.title,
        content: formData.description,
        Tags: formData.tags || '',
        created_at: new Date().toISOString().split('T')[0]
      }

      const newNote = await noteService.createNote(noteData)
      setNotes(prev => [newNote, ...prev])
      setFormData({ title: '', description: '', tags: '' })
      setShowAddForm(false)
      toast.success('Note added successfully!')
    } catch (error) {
      console.error('Error adding note:', error)
      toast.error('Failed to add note')
    } finally {
      setLoadingNotes(false)
    }
  }

  const handleAddGoal = async (e) => {
    e.preventDefault()
    if (!goalFormData.title.trim()) {
      toast.error('Please enter a goal title')
      return
    }
    if (!goalFormData.targetDate) {
      toast.error('Please select a target date')
      return
    }

    setLoadingGoals(true)
    try {
      const goalData = {
        Name: goalFormData.title,
        title: goalFormData.title,
        description: goalFormData.description || 'No description provided',
        progress: parseInt(goalFormData.progress) || 0,
        target_date: goalFormData.targetDate,
        status: 'in-progress'
      }

      const newGoal = await goalService.createGoal(goalData)
      setGoals(prev => [newGoal, ...prev])
      setGoalFormData({ title: '', description: '', targetDate: '', progress: 0 })
      setShowAddForm(false)
      toast.success('Goal added successfully!')
    } catch (error) {
      console.error('Error adding goal:', error)
      toast.error('Failed to add goal')
    } finally {
      setLoadingGoals(false)
    }
  }

  const handleEditGoal = (goal) => {
    setEditingGoal(goal.Id)
    setGoalFormData({
      title: goal.title || goal.Name || '',
      description: goal.description || '',
      targetDate: goal.target_date || '',
      progress: goal.progress || 0
    })
  }

  const handleUpdateGoal = async (e) => {
    e.preventDefault()
    if (!goalFormData.title.trim()) {
      toast.error('Please enter a goal title')
      return
    }
    if (!goalFormData.targetDate) {
      toast.error('Please select a target date')
      return
    }

    setLoadingGoals(true)
    try {
      const updateData = {
        Name: goalFormData.title,
        title: goalFormData.title,
        description: goalFormData.description,
        target_date: goalFormData.targetDate,
        progress: parseInt(goalFormData.progress)
      }
      
      await goalService.updateGoal(editingGoal, updateData)
      
      setGoals(prev => prev.map(goal => 
        goal.Id === editingGoal
          ? { ...goal, ...updateData }
          : goal
      ))
      
      setEditingGoal(null)
      setGoalFormData({ title: '', description: '', targetDate: '', progress: 0 })
      toast.success('Goal updated successfully!')
    } catch (error) {
      console.error('Error updating goal:', error)
      toast.error('Failed to update goal')
    } finally {
      setLoadingGoals(false)
    }
  }

  const handleDeleteGoal = async (goalId) => {
    if (!window.confirm('Are you sure you want to delete this goal?')) return
    
    setLoadingGoals(true)
    try {
      await goalService.deleteGoal(goalId)
      setGoals(prev => prev.filter(goal => goal.Id !== goalId))
      toast.success('Goal deleted successfully!')
    } catch (error) {
      console.error('Error deleting goal:', error)
      toast.error('Failed to delete goal')
    } finally {
      setLoadingGoals(false)
    }
  }

  const handleUpdateGoalProgress = async (id, newProgress) => {
    setLoadingGoals(true)
    try {
      await goalService.updateGoal(id, { progress: newProgress })
      
      setGoals(prev => prev.map(goal => 
        goal.Id === id 
          ? { ...goal, progress: newProgress }
          : goal
      ))
      toast.success('Goal progress updated!')
    } catch (error) {
      console.error('Error updating goal progress:', error)
      toast.error('Failed to update goal progress')
    } finally {
      setLoadingGoals(false)
    }
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

  const renderSubjects = () => {
    if (loadingSubjects) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-3 text-slate-600 dark:text-slate-400">Loading subjects...</span>
        </div>
      )
    }

    return (
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
            disabled={loadingSubjects}
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
                    disabled={loadingSubjects}
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
                        disabled={loadingSubjects}
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
                  disabled={loadingSubjects}
                />
              </div>
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded-xl font-medium hover:bg-primary-dark transition-colors disabled:opacity-50"
                  disabled={loadingSubjects}
                >
                  <ApperIcon name="Check" className="w-4 h-4" />
                  <span>Add Subject</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex items-center space-x-2 neu-button px-4 py-2 rounded-xl font-medium text-slate-600 dark:text-slate-400"
                  disabled={loadingSubjects}
                >
                  <ApperIcon name="X" className="w-4 h-4" />
                  <span>Cancel</span>
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {subjects.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <ApperIcon name="BookOpen" className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">No subjects yet</h3>
              <p className="text-slate-600 dark:text-slate-400">Add your first learning subject to get started</p>
            </div>
          ) : (
            subjects.map((subject, index) => (
              <motion.div
                key={subject.Id}
                className="learning-card p-6 group cursor-pointer hover:scale-[1.02] transition-all duration-300"
                onClick={() => handleSubjectClick(subject.Id)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 ${subject.color || 'bg-blue-500'} rounded-xl flex items-center justify-center`}>
                    <ApperIcon name="BookOpen" className="w-6 h-6 text-white" />
                  </div>
                  <div 
                    className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => handleDeleteSubject(subject.Id)}
                      className="p-1.5 neu-button rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                      disabled={loadingSubjects}
                    >
                      <ApperIcon name="Trash2" className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  {subject.title || subject.Name}
                </h4>
                <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
                  {subject.description || 'No description provided'}
                </p>

                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    {subject.completed_modules || 0} / {subject.modules || 0} modules
                  </div>
                  <CircularProgress progress={subject.progress || 0} size={50} />
                </div>

                <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">Progress</span>
                    <span className="font-medium text-slate-900 dark:text-slate-100">{subject.progress || 0}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={subject.progress || 0}
                    onChange={(e) => handleUpdateProgress(subject.Id, parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
                    disabled={loadingSubjects}
                  />
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    )
  }

  const renderNotes = () => {
    if (loadingNotes) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-3 text-slate-600 dark:text-slate-400">Loading notes...</span>
        </div>
      )
    }

    return (
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
            disabled={loadingNotes}
          >
            <ApperIcon name="Plus" className="w-4 h-4" />
            <span>Add Note</span>
          </motion.button>
        </div>
        
        <AnimatePresence>
          {showAddForm && (
            <motion.form
              onSubmit={handleAddNote}
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
                    disabled={loadingNotes}
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
                    disabled={loadingNotes}
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
                  disabled={loadingNotes}
                />
              </div>
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded-xl font-medium hover:bg-primary-dark transition-colors disabled:opacity-50"
                  disabled={loadingNotes}
                >
                  <ApperIcon name="Check" className="w-4 h-4" />
                  <span>Save Note</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex items-center space-x-2 neu-button px-4 py-2 rounded-xl font-medium text-slate-600 dark:text-slate-400"
                  disabled={loadingNotes}
                >
                  <ApperIcon name="X" className="w-4 h-4" />
                  <span>Cancel</span>
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {notes.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <ApperIcon name="FileText" className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">No notes yet</h3>
              <p className="text-slate-600 dark:text-slate-400">Create your first note to start building your knowledge base</p>
            </div>
          ) : (
            notes.map((note, index) => (
              <motion.div
                key={note.Id}
                className="learning-card p-6 group cursor-pointer hover:shadow-lg transition-all duration-300"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <div 
                  className="flex items-start justify-between mb-3"
                  onClick={() => handleNoteClick(note.Id)}
                >
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {note.title || note.Name}
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
                        disabled={loadingNotes}
                      >
                        <ApperIcon name="Edit" className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteNote(note.Id)}
                        className="p-1.5 neu-button rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                        disabled={loadingNotes}
                      >
                        <ApperIcon name="Trash2" className="w-4 h-4" />
                      </button>
                    </div>
                    <motion.div
                      animate={{ rotate: expandedNotes.has(note.Id) ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ApperIcon name="ChevronDown" className="w-5 h-5 text-slate-400" />
                    </motion.div>
                  </div>
                </div>
                
                {/* Preview when collapsed */}
                {!expandedNotes.has(note.Id) && (
                  <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-3">
                    {note.content || 'No content'}
                  </p>
                )}
                
                {/* Full content when expanded */}
                <AnimatePresence>
                  {expandedNotes.has(note.Id) && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700"
                    >
                      {editingNote === note.Id ? (
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
                              disabled={loadingNotes}
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
                              disabled={loadingNotes}
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
                              disabled={loadingNotes}
                            />
                          </div>
                          <div className="flex space-x-3">
                            <button
                              type="submit"
                              className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded-xl font-medium hover:bg-primary-dark transition-colors disabled:opacity-50"
                              disabled={loadingNotes}
                            >
                              <ApperIcon name="Check" className="w-4 h-4" />
                              <span>Update</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingNote(null)}
                              className="flex items-center space-x-2 neu-button px-4 py-2 rounded-xl font-medium text-slate-600 dark:text-slate-400"
                              disabled={loadingNotes}
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
                              {note.content || 'No content'}
                            </p>
                          </div>
                          
                          {note.Tags && (
                            <div>
                              <h5 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">Tags</h5>
                              <div className="flex flex-wrap gap-2">
                                {note.Tags.split(',').filter(tag => tag.trim()).map((tag, idx) => (
                                  <span
                                    key={idx}
                                    className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded-lg"
                                  >
                                    {tag.trim()}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-700">
                            <div className="text-xs text-slate-500 dark:text-slate-400">
                              Created {note.created_at || 'Unknown'}
                            </div>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleEditNote(note)}
                                className="flex items-center space-x-1 text-xs bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 px-2 py-1 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/30 transition-colors"
                                disabled={loadingNotes}
                              >
                                <ApperIcon name="Edit" className="w-3 h-3" />
                                <span>Edit</span>
                              </button>
                              <button
                                onClick={() => handleDeleteNote(note.Id)}
                                className="flex items-center space-x-1 text-xs bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 px-2 py-1 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/30 transition-colors"
                                disabled={loadingNotes}
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
            ))
          )}
        </div>
      </div>
    )
  }

  const renderGoals = () => {
    if (loadingGoals) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-3 text-slate-600 dark:text-slate-400">Loading goals...</span>
        </div>
      )
    }

    return (
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
            disabled={loadingGoals}
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
                    disabled={loadingGoals}
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
                    disabled={loadingGoals}
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
                  disabled={loadingGoals}
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
                  disabled={loadingGoals}
                />
              </div>
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded-xl font-medium hover:bg-primary-dark transition-colors disabled:opacity-50"
                  disabled={loadingGoals}
                >
                  <ApperIcon name="Check" className="w-4 h-4" />
                  <span>Add Goal</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex items-center space-x-2 neu-button px-4 py-2 rounded-xl font-medium text-slate-600 dark:text-slate-400"
                  disabled={loadingGoals}
                >
                  <ApperIcon name="X" className="w-4 h-4" />
                  <span>Cancel</span>
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
        
        <div className="space-y-4">
          {goals.length === 0 ? (
            <div className="text-center py-12">
              <ApperIcon name="Target" className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">No goals yet</h3>
              <p className="text-slate-600 dark:text-slate-400">Set your first learning goal to track your progress</p>
            </div>
          ) : (
            goals.map((goal, index) => (
              <motion.div
                key={goal.Id}
                className="learning-card p-6 group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                {editingGoal === goal.Id ? (
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
                          disabled={loadingGoals}
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
                          disabled={loadingGoals}
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
                        disabled={loadingGoals}
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
                        disabled={loadingGoals}
                      />
                    </div>
                    <div className="flex space-x-3">
                      <button
                        type="submit"
                        className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded-xl font-medium hover:bg-primary-dark transition-colors disabled:opacity-50"
                        disabled={loadingGoals}
                      >
                        <ApperIcon name="Check" className="w-4 h-4" />
                        <span>Update Goal</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingGoal(null)}
                        className="flex items-center space-x-2 neu-button px-4 py-2 rounded-xl font-medium text-slate-600 dark:text-slate-400"
                        disabled={loadingGoals}
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
                            {goal.title || goal.Name}
                          </h4>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            Target: {goal.target_date || 'No date set'}
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
                            disabled={loadingGoals}
                          >
                            <ApperIcon name="Edit" className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteGoal(goal.Id)}
                            className="p-1.5 neu-button rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                            disabled={loadingGoals}
                          >
                            <ApperIcon name="Trash2" className="w-4 h-4" />
                          </button>
                        </div>
                        <CircularProgress progress={goal.progress || 0} size={60} />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600 dark:text-slate-400">Progress</span>
                        <span className="font-medium text-slate-900 dark:text-slate-100">{goal.progress || 0}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={goal.progress || 0}
                        onChange={(e) => handleUpdateGoalProgress(goal.Id, parseInt(e.target.value))}
                        className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
                        disabled={loadingGoals}
                      />
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mt-2">
                        <motion.div
                          className="bg-gradient-to-r from-secondary to-accent h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${goal.progress || 0}%` }}
                          transition={{ duration: 1, delay: index * 0.2 }}
                        />
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            ))
          )}
        </div>
      </div>
    )
  }

  // Show authentication message if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="learning-card p-8 text-center">
        <ApperIcon name="Lock" className="w-16 h-16 text-slate-400 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">Authentication Required</h3>
        <p className="text-slate-600 dark:text-slate-400 mb-4">Please log in to access your learning data.</p>
        <button
          onClick={() => navigate('/login')}
          className="bg-primary text-white px-6 py-2 rounded-xl font-medium hover:bg-primary-dark transition-colors"
        >
          Go to Login
        </button>
      </div>
    )
  }

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
