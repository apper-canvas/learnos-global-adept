import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '../components/ApperIcon'

export default function SubjectDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')
  const [loading, setLoading] = useState(true)
  
  // Mock subject data - in real app, this would be fetched based on ID
  const [subject, setSubject] = useState(null)
  const [modules, setModules] = useState([])
  const [notes, setNotes] = useState([])
  const [assignments, setAssignments] = useState([])
  const [expandedModules, setExpandedModules] = useState(new Set())

  
  const [showAddModuleForm, setShowAddModuleForm] = useState(false)
  const [showAddNoteForm, setShowAddNoteForm] = useState(false)
  const [showAddAssignmentForm, setShowAddAssignmentForm] = useState(false)
  
  const [moduleForm, setModuleForm] = useState({ title: '', description: '', duration: '' })
  const [noteForm, setNoteForm] = useState({ title: '', content: '', tags: '' })
  const [assignmentForm, setAssignmentForm] = useState({ title: '', description: '', dueDate: '', priority: 'medium' })

  useEffect(() => {
    // Simulate loading subject data
    setTimeout(() => {
      const mockSubject = {
        id: parseInt(id),
        title: id === '1' ? 'Machine Learning' : id === '2' ? 'React Development' : 'Data Science',
        description: id === '1' ? 'Deep learning fundamentals and neural networks' : id === '2' ? 'Modern web development with React' : 'Analytics and data visualization',
        progress: id === '1' ? 75 : id === '2' ? 60 : 40,
        color: id === '1' ? 'bg-blue-500' : id === '2' ? 'bg-cyan-500' : 'bg-purple-500',
        modules: id === '1' ? 12 : id === '2' ? 8 : 15,
        completedModules: id === '1' ? 9 : id === '2' ? 5 : 6,
        enrolledDate: '2024-01-01',
        estimatedCompletion: '2024-03-01'
      }
      
      const mockModules = [
        { 
          id: 1, 
          title: 'Introduction to Neural Networks', 
          completed: true, 
          duration: '2 hours',
          description: 'Learn the fundamental concepts of neural networks including perceptrons, activation functions, and basic network architectures.',
          topics: [
            {
              id: 1,
              title: 'Perceptron Basics',
              objectives: [
                { id: 1, text: 'Understand the mathematical model of a perceptron', completed: true },
                { id: 2, text: 'Implement a simple perceptron algorithm', completed: true },
                { id: 3, text: 'Visualize perceptron decision boundaries', completed: false }
              ],
              keyConcepts: [
                { id: 1, concept: 'Linear Separation', description: 'How perceptrons can only classify linearly separable data', understood: true },
                { id: 2, concept: 'Weights and Bias', description: 'Role of weights and bias in determining decision boundaries', understood: true },
                { id: 3, concept: 'Activation Functions', description: 'Step function and its limitations in perceptrons', understood: false }
              ],
              resources: [
                { id: 1, type: 'video', title: 'Perceptron Explained', url: '#', duration: '15 min' },
                { id: 2, type: 'article', title: 'Mathematical Foundation of Perceptrons', url: '#', readTime: '10 min' },
                { id: 3, type: 'exercise', title: 'Implement Perceptron from Scratch', url: '#', difficulty: 'Medium' }
              ],
              prerequisites: ['Basic Linear Algebra', 'Python Programming'],
              progress: 75
            },
            {
              id: 2,
              title: 'Multi-layer Networks',
              objectives: [
                { id: 4, text: 'Understand the need for hidden layers', completed: true },
                { id: 5, text: 'Learn about universal approximation theorem', completed: false },
                { id: 6, text: 'Implement a multi-layer perceptron', completed: false }
              ],
              keyConcepts: [
                { id: 4, concept: 'Hidden Layers', description: 'How hidden layers enable non-linear classification', understood: true },
                { id: 5, concept: 'Universal Approximation', description: 'Theoretical foundation of neural network capabilities', understood: false },
                { id: 6, concept: 'Forward Propagation', description: 'Information flow through network layers', understood: false }
              ],
              resources: [
                { id: 4, type: 'video', title: 'Multi-layer Networks Deep Dive', url: '#', duration: '25 min' },
                { id: 5, type: 'simulation', title: 'Interactive Network Visualization', url: '#', features: 'Real-time' }
              ],
              prerequisites: ['Perceptron Basics', 'Calculus Fundamentals'],
              progress: 40
            }
          ]
        },
        { 
          id: 2, 
          title: 'Backpropagation Algorithm', 
          completed: true, 
          duration: '3 hours',
          description: 'Master the backpropagation algorithm that enables neural networks to learn from data through gradient descent optimization.',
          topics: [
            {
              id: 3,
              title: 'Gradient Descent Fundamentals',
              objectives: [
                { id: 7, text: 'Understand the concept of gradients in optimization', completed: true },
                { id: 8, text: 'Implement basic gradient descent algorithm', completed: true },
                { id: 9, text: 'Visualize gradient descent convergence', completed: true }
              ],
              keyConcepts: [
                { id: 7, concept: 'Loss Functions', description: 'Mathematical measures of prediction accuracy', understood: true },
                { id: 8, concept: 'Learning Rate', description: 'Step size parameter in gradient descent', understood: true },
                { id: 9, concept: 'Local Minima', description: 'Challenges in optimization landscapes', understood: true }
              ],
              resources: [
                { id: 6, type: 'interactive', title: 'Gradient Descent Visualizer', url: '#', features: '3D plots' },
                { id: 7, type: 'paper', title: 'Optimization for Machine Learning', url: '#', pages: 45 }
              ],
              prerequisites: ['Calculus', 'Linear Algebra'],
              progress: 100
            }
          ]
        },
        { 
          id: 3, 
          title: 'Convolutional Neural Networks', 
          completed: false, 
          duration: '4 hours',
          description: 'Explore specialized neural network architectures designed for processing grid-like data such as images.',
          topics: [
            {
              id: 4,
              title: 'Convolution Operations',
              objectives: [
                { id: 10, text: 'Understand mathematical convolution', completed: false },
                { id: 11, text: 'Implement 2D convolution filters', completed: false },
                { id: 12, text: 'Analyze feature extraction process', completed: false }
              ],
              keyConcepts: [
                { id: 10, concept: 'Kernels/Filters', description: 'Small matrices for feature detection', understood: false },
                { id: 11, concept: 'Stride and Padding', description: 'Parameters controlling convolution output size', understood: false },
                { id: 12, concept: 'Feature Maps', description: 'Output of convolution operations', understood: false }
              ],
              resources: [
                { id: 8, type: 'video', title: 'CNN Fundamentals', url: '#', duration: '30 min' },
                { id: 9, type: 'tool', title: 'CNN Playground', url: '#', features: 'Interactive' }
              ],
              prerequisites: ['Neural Network Basics', 'Image Processing Basics'],
              progress: 0
            }
          ]
        },
        { 
          id: 4, 
          title: 'Recurrent Neural Networks', 
          completed: false, 
          duration: '3 hours',
          description: 'Learn about neural networks designed for sequential data processing and temporal pattern recognition.',
          topics: [
            {
              id: 5,
              title: 'Sequential Processing',
              objectives: [
                { id: 13, text: 'Understand memory in neural networks', completed: false },
                { id: 14, text: 'Implement basic RNN cell', completed: false },
                { id: 15, text: 'Handle variable-length sequences', completed: false }
              ],
              keyConcepts: [
                { id: 13, concept: 'Hidden State', description: 'Memory mechanism in RNNs', understood: false },
                { id: 14, concept: 'Temporal Dependencies', description: 'Learning patterns across time steps', understood: false },
                { id: 15, concept: 'Vanishing Gradients', description: 'Training challenges in deep temporal networks', understood: false }
              ],
              resources: [
                { id: 10, type: 'course', title: 'RNN Deep Dive', url: '#', lessons: 8 },
                { id: 11, type: 'dataset', title: 'Sequential Data Samples', url: '#', size: '10MB' }
              ],
              prerequisites: ['Backpropagation', 'Time Series Basics'],
              progress: 0
            }
          ]
        }
      ]

      
      const mockNotes = [
        { id: 1, title: 'Neural Network Basics', content: 'Key concepts about perceptrons and activation functions...', tags: ['basics', 'theory'], createdAt: '2024-01-15' },
        { id: 2, title: 'Gradient Descent', content: 'Understanding how gradient descent optimizes neural networks...', tags: ['optimization', 'algorithms'], createdAt: '2024-01-16' }
      ]
      
      const mockAssignments = [
        { id: 1, title: 'Build a Simple Perceptron', description: 'Create a basic perceptron from scratch', dueDate: '2024-02-01', priority: 'high', completed: false },
        { id: 2, title: 'CNN Image Classification', description: 'Implement image classification using CNNs', dueDate: '2024-02-15', priority: 'medium', completed: false }
      ]
      
      setSubject(mockSubject)
      setModules(mockModules)
      setNotes(mockNotes)
      setAssignments(mockAssignments)
      setLoading(false)
    }, 1000)
  }, [id])

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'BookOpen' },
    { id: 'modules', label: 'Modules', icon: 'List', count: modules.length },
    { id: 'notes', label: 'Notes', icon: 'FileText', count: notes.length },
    { id: 'assignments', label: 'Assignments', icon: 'CheckSquare', count: assignments.length }
  ]

  const handleAddModule = (e) => {
    e.preventDefault()
    if (!moduleForm.title.trim()) {
      toast.error('Please enter a module title')
      return
    }

    const newModule = {
      id: Date.now(),
      title: moduleForm.title,
      description: moduleForm.description,
      duration: moduleForm.duration || '1 hour',
      completed: false
    }

    setModules(prev => [...prev, newModule])
    setModuleForm({ title: '', description: '', duration: '' })
    setShowAddModuleForm(false)
    toast.success('Module added successfully!')
  }

  const handleToggleModule = (moduleId) => {
    setModules(prev => prev.map(module => 
      module.id === moduleId ? { ...module, completed: !module.completed } : module
    ))
    toast.success('Module status updated!')
  }

  const handleToggleModuleExpansion = (moduleId) => {
    setExpandedModules(prev => {
      const newSet = new Set(prev)
      if (newSet.has(moduleId)) {
        newSet.delete(moduleId)
      } else {
        newSet.add(moduleId)
      }
      return newSet
    })
  }


  const handleAddNote = (e) => {
    e.preventDefault()
    if (!noteForm.title.trim() || !noteForm.content.trim()) {
      toast.error('Please enter both title and content')
      return
    }

    const newNote = {
      id: Date.now(),
      title: noteForm.title,
      content: noteForm.content,
      tags: noteForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      createdAt: new Date().toISOString().split('T')[0]
    }

    setNotes(prev => [...prev, newNote])
    setNoteForm({ title: '', content: '', tags: '' })
    setShowAddNoteForm(false)
    toast.success('Note added successfully!')
  }

  const handleAddAssignment = (e) => {
    e.preventDefault()
    if (!assignmentForm.title.trim()) {
      toast.error('Please enter an assignment title')
      return
    }

    const newAssignment = {
      id: Date.now(),
      title: assignmentForm.title,
      description: assignmentForm.description,
      dueDate: assignmentForm.dueDate,
      priority: assignmentForm.priority,
      completed: false
    }

    setAssignments(prev => [...prev, newAssignment])
    setAssignmentForm({ title: '', description: '', dueDate: '', priority: 'medium' })
    setShowAddAssignmentForm(false)
    toast.success('Assignment added successfully!')
  }

  const handleToggleAssignment = (assignmentId) => {
    setAssignments(prev => prev.map(assignment => 
      assignment.id === assignmentId ? { ...assignment, completed: !assignment.completed } : assignment
    ))
    toast.success('Assignment status updated!')
  }

  const CircularProgress = ({ progress, size = 120 }) => {
    const radius = (size - 8) / 2
    const circumference = radius * 2 * Math.PI
    const strokeDasharray = `${(progress / 100) * circumference} ${circumference}`

    return (
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90" width={size} height={size}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth="8"
            className="text-slate-200 dark:text-slate-700"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth="8"
            strokeDasharray={strokeDasharray}
            className="text-primary transition-all duration-1000 ease-out"
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-slate-700 dark:text-slate-300">
            {progress}%
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Complete
          </span>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading subject details...</p>
        </div>
      </div>
    )
  }

  if (!subject) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <ApperIcon name="AlertCircle" className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">Subject Not Found</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-4">The requested subject could not be found.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-primary text-white px-6 py-2 rounded-xl font-medium hover:bg-primary-dark transition-colors"
          >
            Return to Home
          </button>
        </div>
      </div>
    )
  }

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Subject Header */}
      <div className="learning-card p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-4 mb-6">
              <div className={`w-16 h-16 ${subject.color} rounded-2xl flex items-center justify-center`}>
                <ApperIcon name="BookOpen" className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">{subject.title}</h1>
                <p className="text-slate-600 dark:text-slate-400 text-lg">{subject.description}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4">
                <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{subject.modules}</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Total Modules</div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4">
                <div className="text-2xl font-bold text-green-600">{subject.completedModules}</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Completed</div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4">
                <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{notes.length}</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Notes Taken</div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4">
                <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{assignments.length}</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Assignments</div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center">
            <CircularProgress progress={subject.progress} />
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="learning-card p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-slate-600 dark:text-slate-400">Completed "Neural Network Basics" module</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-slate-600 dark:text-slate-400">Added new note on "Gradient Descent"</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span className="text-slate-600 dark:text-slate-400">Assignment "Build Perceptron" due soon</span>
            </div>
          </div>
        </div>
        
        <div className="learning-card p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Study Timeline</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-slate-400">Enrolled</span>
              <span className="font-medium text-slate-900 dark:text-slate-100">{subject.enrolledDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-slate-400">Estimated Completion</span>
              <span className="font-medium text-slate-900 dark:text-slate-100">{subject.estimatedCompletion}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-slate-400">Current Progress</span>
              <span className="font-medium text-primary">{subject.progress}% Complete</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderModules = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">Course Modules</h3>
          <p className="text-slate-600 dark:text-slate-400">Track your progress through each module</p>
        </div>
        <motion.button
          onClick={() => setShowAddModuleForm(!showAddModuleForm)}
          className="flex items-center space-x-2 bg-gradient-to-r from-primary to-secondary text-white px-4 py-2 rounded-xl font-medium hover:shadow-lg transition-all duration-300"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <ApperIcon name="Plus" className="w-4 h-4" />
          <span>Add Module</span>
        </motion.button>
      </div>

      <AnimatePresence>
        {showAddModuleForm && (
          <motion.form
            onSubmit={handleAddModule}
            className="learning-card p-6 space-y-4"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Module Title
                </label>
                <input
                  type="text"
                  value={moduleForm.title}
                  onChange={(e) => setModuleForm(prev => ({ ...prev, title: e.target.value }))}
                  className="learning-input"
                  placeholder="Enter module title"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Duration
                </label>
                <input
                  type="text"
                  value={moduleForm.duration}
                  onChange={(e) => setModuleForm(prev => ({ ...prev, duration: e.target.value }))}
                  className="learning-input"
                  placeholder="e.g., 2 hours"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Description
              </label>
              <textarea
                value={moduleForm.description}
                onChange={(e) => setModuleForm(prev => ({ ...prev, description: e.target.value }))}
                className="learning-input h-20 resize-none"
                placeholder="Describe what this module covers"
              />
            </div>
            <div className="flex space-x-3">
              <button
                type="submit"
                className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded-xl font-medium hover:bg-primary-dark transition-colors"
              >
                <ApperIcon name="Check" className="w-4 h-4" />
                <span>Add Module</span>
              </button>
              <button
                type="button"
                onClick={() => setShowAddModuleForm(false)}
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
        {modules.map((module, index) => (
          <motion.div
            key={module.id}
            className="learning-card p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 flex-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleToggleModule(module.id)
                  }}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors flex-shrink-0 ${  
                    module.completed 
                      ? 'bg-green-500 border-green-500 text-white' 
                      : 'border-slate-300 dark:border-slate-600 hover:border-green-500'
                  }`}
                >
                  {module.completed && <ApperIcon name="Check" className="w-4 h-4" />}
                </button>
                <div 
                  className="flex-1 cursor-pointer" 
                  onClick={() => handleToggleModuleExpansion(module.id)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className={`text-lg font-semibold ${module.completed ? 'text-slate-500 dark:text-slate-400 line-through' : 'text-slate-900 dark:text-slate-100'}`}>
                        {module.title}
                      </h4>
                      {module.description && !expandedModules.has(module.id) && (
                        <p className="text-slate-600 dark:text-slate-400 text-sm truncate">{module.description}</p>
                      )}
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-sm text-slate-600 dark:text-slate-400">
                        {module.duration}
                      </div>
                      {module.completed && (
                        <div className="bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-2 py-1 rounded-lg text-xs font-medium">
                          Completed
                        </div>
                      )}
                      <motion.div
                        animate={{ rotate: expandedModules.has(module.id) ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ApperIcon 
                          name="ChevronDown" 
                          className="w-5 h-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300" 
                        />
                      </motion.div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <AnimatePresence>
              {expandedModules.has(module.id) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700"
                >
                  <div className="space-y-6">
                    {/* Module Overview */}
                    <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl p-4">
                      <h5 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">Module Overview</h5>
                      <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-3">
                        {module.description || 'No description available for this module.'}
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="bg-white dark:bg-slate-800 rounded-lg p-3">
                          <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Duration</div>
                          <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">{module.duration}</div>
                        </div>
                        <div className="bg-white dark:bg-slate-800 rounded-lg p-3">
                          <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Topics</div>
                          <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">{module.topics?.length || 0}</div>
                        </div>
                        <div className="bg-white dark:bg-slate-800 rounded-lg p-3">
                          <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Progress</div>
                          <div className={`text-sm font-semibold ${
                            module.completed 
                              ? 'text-green-600 dark:text-green-400' 
                              : 'text-orange-600 dark:text-orange-400'
                          }`}>
                            {module.completed ? '100%' : `${Math.round((module.topics?.reduce((acc, topic) => acc + topic.progress, 0) || 0) / (module.topics?.length || 1))}%`}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Topics Section */}
                    {module.topics && module.topics.length > 0 && (
                      <div>
                        <h5 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center">
                          <ApperIcon name="Book" className="w-5 h-5 mr-2 text-primary" />
                          Learning Topics
                        </h5>
                        <div className="space-y-4">
                          {module.topics.map((topic, topicIndex) => (
                            <div key={topic.id} className="bg-slate-50 dark:bg-slate-800 rounded-xl p-5">
                              <div className="flex items-center justify-between mb-4">
                                <h6 className="text-md font-semibold text-slate-900 dark:text-slate-100">{topic.title}</h6>
                                <div className="flex items-center space-x-2">
                                  <div className="w-16 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                    <div 
                                      className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
                                      style={{ width: `${topic.progress}%` }}
                                    />
                                  </div>
                                  <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{topic.progress}%</span>
                                </div>
                              </div>

                              {/* Prerequisites */}
                              {topic.prerequisites && topic.prerequisites.length > 0 && (
                                <div className="mb-4">
                                  <h7 className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 block">Prerequisites</h7>
                                  <div className="flex flex-wrap gap-1">
                                    {topic.prerequisites.map((prereq, i) => (
                                      <span key={i} className="px-2 py-1 bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 text-xs font-medium rounded">
                                        {prereq}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Learning Objectives */}
                              <div className="mb-4">
                                <h7 className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-3 block flex items-center">
                                  <ApperIcon name="Target" className="w-4 h-4 mr-1" />
                                  Learning Objectives
                                </h7>
                                <div className="space-y-2">
                                  {topic.objectives.map((objective) => (
                                    <div key={objective.id} className="flex items-center space-x-3">
                                      <button
                                        className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                                          objective.completed
                                            ? 'bg-green-500 border-green-500 text-white'
                                            : 'border-slate-300 dark:border-slate-600 hover:border-green-500'
                                        }`}
                                      >
                                        {objective.completed && <ApperIcon name="Check" className="w-3 h-3" />}
                                      </button>
                                      <span className={`text-sm ${
                                        objective.completed 
                                          ? 'text-slate-500 dark:text-slate-400 line-through' 
                                          : 'text-slate-700 dark:text-slate-300'
                                      }`}>
                                        {objective.text}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Key Concepts */}
                              <div className="mb-4">
                                <h7 className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-3 block flex items-center">
                                  <ApperIcon name="Lightbulb" className="w-4 h-4 mr-1" />
                                  Key Concepts
                                </h7>
                                <div className="grid grid-cols-1 gap-2">
                                  {topic.keyConcepts.map((concept) => (
                                    <div key={concept.id} className="bg-white dark:bg-slate-700 rounded-lg p-3">
                                      <div className="flex items-center justify-between mb-1">
                                        <span className="text-sm font-medium text-slate-900 dark:text-slate-100">{concept.concept}</span>
                                        <button className={`w-4 h-4 rounded-full border-2 ${
                                          concept.understood
                                            ? 'bg-blue-500 border-blue-500'
                                            : 'border-slate-300 dark:border-slate-600 hover:border-blue-500'
                                        }`}>
                                          {concept.understood && <ApperIcon name="Check" className="w-3 h-3 text-white" />}
                                        </button>
                                      </div>
                                      <p className="text-xs text-slate-600 dark:text-slate-400">{concept.description}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Learning Resources */}
                              <div>
                                <h7 className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-3 block flex items-center">
                                  <ApperIcon name="ExternalLink" className="w-4 h-4 mr-1" />
                                  Learning Resources
                                </h7>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                  {topic.resources.map((resource) => (
                                    <div key={resource.id} className="bg-white dark:bg-slate-700 rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer">
                                      <div className="flex items-center space-x-2 mb-1">
                                        <ApperIcon 
                                          name={
                                            resource.type === 'video' ? 'Play' :
                                            resource.type === 'article' ? 'FileText' :
                                            resource.type === 'exercise' ? 'Code' :
                                            resource.type === 'interactive' ? 'Monitor' :
                                            resource.type === 'simulation' ? 'Zap' :
                                            resource.type === 'paper' ? 'BookOpen' :
                                            resource.type === 'tool' ? 'Tool' :
                                            resource.type === 'course' ? 'GraduationCap' :
                                            resource.type === 'dataset' ? 'Database' :
                                            'Link'
                                          }
                                          className={`w-4 h-4 ${
                                            resource.type === 'video' ? 'text-red-500' :
                                            resource.type === 'article' ? 'text-blue-500' :
                                            resource.type === 'exercise' ? 'text-green-500' :
                                            resource.type === 'interactive' ? 'text-purple-500' :
                                            resource.type === 'paper' ? 'text-orange-500' :
                                            'text-slate-500'
                                          }`}
                                        />
                                        <span className="text-sm font-medium text-slate-900 dark:text-slate-100 capitalize">{resource.type}</span>
                                      </div>
                                      <h8 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1">{resource.title}</h8>
                                      <div className="flex items-center justify-between">
                                        <span className="text-xs text-slate-600 dark:text-slate-400">
                                          {resource.duration || resource.readTime || resource.pages ? 
                                            `${resource.duration || resource.readTime || resource.pages + ' pages'}` :
                                            resource.difficulty || resource.features || resource.lessons ? 
                                            `${resource.difficulty || resource.features || resource.lessons + ' lessons'}` :
                                            resource.size || 'Available'
                                          }
                                        </span>
                                        <ApperIcon name="ExternalLink" className="w-3 h-3 text-slate-400" />
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                      <motion.button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleToggleModule(module.id)
                          toast.success(`Module marked as ${module.completed ? 'incomplete' : 'complete'}!`)
                        }}
                        className={`w-full py-3 px-4 rounded-xl font-medium transition-all duration-300 ${
                          module.completed
                            ? 'bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 hover:bg-orange-200 dark:hover:bg-orange-900/30'
                            : 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/30'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center justify-center space-x-2">
                          <ApperIcon name={module.completed ? 'RotateCcw' : 'CheckCircle'} className="w-4 h-4" />
                          <span>{module.completed ? 'Mark as Incomplete' : 'Mark as Complete'}</span>
                        </div>
                      </motion.button>
                    </div>
                  </div>

                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

    </div>
  )

  const renderNotes = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">Study Notes</h3>
          <p className="text-slate-600 dark:text-slate-400">Keep track of important concepts and insights</p>
        </div>
        <motion.button
          onClick={() => setShowAddNoteForm(!showAddNoteForm)}
          className="flex items-center space-x-2 bg-gradient-to-r from-primary to-secondary text-white px-4 py-2 rounded-xl font-medium hover:shadow-lg transition-all duration-300"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <ApperIcon name="Plus" className="w-4 h-4" />
          <span>Add Note</span>
        </motion.button>
      </div>

      <AnimatePresence>
        {showAddNoteForm && (
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
                  value={noteForm.title}
                  onChange={(e) => setNoteForm(prev => ({ ...prev, title: e.target.value }))}
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
                  value={noteForm.tags}
                  onChange={(e) => setNoteForm(prev => ({ ...prev, tags: e.target.value }))}
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
                value={noteForm.content}
                onChange={(e) => setNoteForm(prev => ({ ...prev, content: e.target.value }))}
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
                onClick={() => setShowAddNoteForm(false)}
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
            
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-4">
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

  const renderAssignments = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">Assignments</h3>
          <p className="text-slate-600 dark:text-slate-400">Track your assignments and deadlines</p>
        </div>
        <motion.button
          onClick={() => setShowAddAssignmentForm(!showAddAssignmentForm)}
          className="flex items-center space-x-2 bg-gradient-to-r from-primary to-secondary text-white px-4 py-2 rounded-xl font-medium hover:shadow-lg transition-all duration-300"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <ApperIcon name="Plus" className="w-4 h-4" />
          <span>Add Assignment</span>
        </motion.button>
      </div>

      <AnimatePresence>
        {showAddAssignmentForm && (
          <motion.form
            onSubmit={handleAddAssignment}
            className="learning-card p-6 space-y-4"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Assignment Title
                </label>
                <input
                  type="text"
                  value={assignmentForm.title}
                  onChange={(e) => setAssignmentForm(prev => ({ ...prev, title: e.target.value }))}
                  className="learning-input"
                  placeholder="Enter assignment title"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Due Date
                </label>
                <input
                  type="date"
                  value={assignmentForm.dueDate}
                  onChange={(e) => setAssignmentForm(prev => ({ ...prev, dueDate: e.target.value }))}
                  className="learning-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Priority
                </label>
                <select
                  value={assignmentForm.priority}
                  onChange={(e) => setAssignmentForm(prev => ({ ...prev, priority: e.target.value }))}
                  className="learning-input"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Description
              </label>
              <textarea
                value={assignmentForm.description}
                onChange={(e) => setAssignmentForm(prev => ({ ...prev, description: e.target.value }))}
                className="learning-input h-20 resize-none"
                placeholder="Describe the assignment requirements"
              />
            </div>
            <div className="flex space-x-3">
              <button
                type="submit"
                className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded-xl font-medium hover:bg-primary-dark transition-colors"
              >
                <ApperIcon name="Check" className="w-4 h-4" />
                <span>Add Assignment</span>
              </button>
              <button
                type="button"
                onClick={() => setShowAddAssignmentForm(false)}
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
        {assignments.map((assignment, index) => (
          <motion.div
            key={assignment.id}
            className="learning-card p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => handleToggleAssignment(assignment.id)}
                  className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                    assignment.completed 
                      ? 'bg-green-500 border-green-500 text-white' 
                      : 'border-slate-300 dark:border-slate-600 hover:border-green-500'
                  }`}
                >
                  {assignment.completed && <ApperIcon name="Check" className="w-4 h-4" />}
                </button>
                <div>
                  <h4 className={`text-lg font-semibold ${assignment.completed ? 'text-slate-500 dark:text-slate-400 line-through' : 'text-slate-900 dark:text-slate-100'}`}>
                    {assignment.title}
                  </h4>
                  {assignment.description && (
                    <p className="text-slate-600 dark:text-slate-400 text-sm">{assignment.description}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-4">
                {assignment.dueDate && (
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    Due: {assignment.dueDate}
                  </div>
                )}
                <div className={`px-2 py-1 rounded-lg text-xs font-medium ${
                  assignment.priority === 'high' ? 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400' :
                  assignment.priority === 'medium' ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400' :
                  'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                }`}>
                  {assignment.priority}
                </div>
                {assignment.completed && (
                  <div className="bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-2 py-1 rounded-lg text-xs font-medium">
                    Completed
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <motion.button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ApperIcon name="ArrowLeft" className="w-5 h-5" />
            <span>Back to Subjects</span>
          </motion.button>
          
          <div className="text-center">
            <h1 className="text-2xl font-bold gradient-text">LearnOS</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">Personal Learning Operating System</p>
          </div>
          
          <div className="w-24"></div> {/* Spacer for center alignment */}
        </div>

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
                  {tab.count !== undefined && (
                    <span className="bg-slate-200 dark:bg-slate-600 text-xs px-2 py-0.5 rounded-full">
                      {tab.count}
                    </span>
                  )}
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
              {activeTab === 'overview' && renderOverview()}
              {activeTab === 'modules' && renderModules()}
              {activeTab === 'notes' && renderNotes()}
              {activeTab === 'assignments' && renderAssignments()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}