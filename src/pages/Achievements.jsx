import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '../components/ApperIcon'
import AchievementService from '../services/AchievementService'

export default function Achievements() {
  const [achievements, setAchievements] = useState([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState(null)
  
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'
  const [filterLevel, setFilterLevel] = useState('') // 'Beginner', 'Intermediate', 'Advanced', or ''
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingAchievement, setEditingAchievement] = useState(null)
  
  const [formData, setFormData] = useState({
    Name: '',
    Tags: '',
    achievementLevel: 'Beginner',
    isPublic: false,
    relatedCourses: '',
    description: '',
    awardedBy: ''
  })

  // Load achievements on component mount
  useEffect(() => {
    fetchAchievements()
  }, [])

  // Re-fetch when filter changes
  useEffect(() => {
    fetchAchievements()
  }, [filterLevel])

  const fetchAchievements = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const filters = {}
      if (filterLevel) {
        filters.achievementLevel = filterLevel
      }
      
      const result = await AchievementService.fetchAchievements(filters)
      
      if (result.success) {
        setAchievements(result.data || [])
      } else {
        setError(result.error || 'Failed to fetch achievements')
        setAchievements([])
        toast.error(result.error || 'Failed to fetch achievements')
      }
    } catch (err) {
      console.error('Error fetching achievements:', err)
      setError('Failed to fetch achievements')
      setAchievements([])
      toast.error('Failed to fetch achievements')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateAchievement = async (e) => {
    e.preventDefault()
    
    if (!formData.Name?.trim()) {
      toast.error('Please enter an achievement name')
      return
    }

    try {
      setCreating(true)
      
      // Format the data for creation
      const achievementData = {
        Name: formData.Name.trim(),
        Tags: formData.Tags.trim(),
        achievementLevel: formData.achievementLevel,
        isPublic: formData.isPublic,
        relatedCourses: formData.relatedCourses.trim(),
        description: formData.description.trim(),
        awardedBy: formData.awardedBy.trim()
      }
      
      const result = await AchievementService.createAchievements(achievementData)
      
      if (result.success && result.createdCount > 0) {
        toast.success('Achievement created successfully!')
        setFormData({
          Name: '',
          Tags: '',
          achievementLevel: 'Beginner',
          isPublic: false,
          relatedCourses: '',
          description: '',
          awardedBy: ''
        })
        setShowAddForm(false)
        await fetchAchievements() // Refresh the list
      } else {
        toast.error(result.error || 'Failed to create achievement')
      }
    } catch (err) {
      console.error('Error creating achievement:', err)
      toast.error('Failed to create achievement')
    } finally {
      setCreating(false)
    }
  }

  const handleEditAchievement = (achievement) => {
    setEditingAchievement(achievement)
    setFormData({
      Name: achievement.Name || '',
      Tags: achievement.Tags || '',
      achievementLevel: achievement.achievementLevel || 'Beginner',
      isPublic: achievement.isPublic === 'True' || achievement.isPublic === true,
      relatedCourses: achievement.relatedCourses || '',
      description: achievement.description || '',
      awardedBy: achievement.awardedBy || ''
    })
    setShowAddForm(true)
  }

  const handleUpdateAchievement = async (e) => {
    e.preventDefault()
    
    if (!formData.Name?.trim()) {
      toast.error('Please enter an achievement name')
      return
    }

    if (!editingAchievement?.Id) {
      toast.error('Invalid achievement selected for editing')
      return
    }

    try {
      setUpdating(true)
      
      // Format the data for update
      const achievementData = {
        Id: editingAchievement.Id,
        Name: formData.Name.trim(),
        Tags: formData.Tags.trim(),
        achievementLevel: formData.achievementLevel,
        isPublic: formData.isPublic,
        relatedCourses: formData.relatedCourses.trim(),
        description: formData.description.trim(),
        awardedBy: formData.awardedBy.trim()
      }
      
      const result = await AchievementService.updateAchievements(achievementData)
      
      if (result.success && result.updatedCount > 0) {
        toast.success('Achievement updated successfully!')
        setFormData({
          Name: '',
          Tags: '',
          achievementLevel: 'Beginner',
          isPublic: false,
          relatedCourses: '',
          description: '',
          awardedBy: ''
        })
        setEditingAchievement(null)
        setShowAddForm(false)
        await fetchAchievements() // Refresh the list
      } else {
        toast.error(result.error || 'Failed to update achievement')
      }
    } catch (err) {
      console.error('Error updating achievement:', err)
      toast.error('Failed to update achievement')
    } finally {
      setUpdating(false)
    }
  }

  const handleDeleteAchievement = async (achievementId) => {
    if (!window.confirm('Are you sure you want to delete this achievement? This action cannot be undone.')) {
      return
    }

    try {
      setDeleting(true)
      
      const result = await AchievementService.deleteAchievements(achievementId)
      
      if (result.success && result.deletedCount > 0) {
        toast.success('Achievement deleted successfully!')
        await fetchAchievements() // Refresh the list
      } else {
        toast.error(result.error || 'Failed to delete achievement')
      }
    } catch (err) {
      console.error('Error deleting achievement:', err)
      toast.error('Failed to delete achievement')
    } finally {
      setDeleting(false)
    }
  }

  const handleCancelEdit = () => {
    setEditingAchievement(null)
    setShowAddForm(false)
    setFormData({
      Name: '',
      Tags: '',
      achievementLevel: 'Beginner',
      isPublic: false,
      relatedCourses: '',
      description: '',
      awardedBy: ''
    })
  }

  const formatTags = (tags) => {
    if (!tags) return []
    return typeof tags === 'string' ? tags.split(',').map(tag => tag.trim()).filter(tag => tag) : []
  }

  const formatRelatedCourses = (courses) => {
    if (!courses) return []
    return typeof courses === 'string' ? courses.split(',').map(course => course.trim()).filter(course => course) : []
  }

  const getLevelColor = (level) => {
    switch (level) {
      case 'Beginner': return 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400'
      case 'Intermediate': return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400'
      case 'Advanced': return 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400'
      default: return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400'
    }
  }

  const renderAchievementCard = (achievement, index) => (
    <motion.div
      key={achievement.Id}
      className="learning-card p-6 group hover:shadow-lg transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
            <ApperIcon name="Award" className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              {achievement.Name}
            </h3>
            <div className={`px-2 py-1 rounded-lg text-xs font-medium inline-block ${getLevelColor(achievement.achievementLevel)}`}>
              {achievement.achievementLevel}
            </div>
          </div>
        </div>
        
        <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => handleEditAchievement(achievement)}
            className="p-2 neu-button rounded-lg text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20"
            disabled={updating}
          >
            <ApperIcon name="Edit" className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDeleteAchievement(achievement.Id)}
            className="p-2 neu-button rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
            disabled={deleting}
          >
            <ApperIcon name="Trash2" className="w-4 h-4" />
          </button>
        </div>
      </div>

      {achievement.description && (
        <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
          {achievement.description}
        </p>
      )}

      {achievement.awardedBy && (
        <div className="mb-4">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Awarded by:</span>
          <span className="text-sm text-slate-700 dark:text-slate-300 ml-2">{achievement.awardedBy}</span>
        </div>
      )}

      <div className="space-y-3">
        {formatTags(achievement.Tags).length > 0 && (
          <div>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-2">Tags:</span>
            <div className="flex flex-wrap gap-1">
              {formatTags(achievement.Tags).map((tag, i) => (
                <span key={i} className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded-lg">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {formatRelatedCourses(achievement.relatedCourses).length > 0 && (
          <div>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-2">Related Courses:</span>
            <div className="flex flex-wrap gap-1">
              {formatRelatedCourses(achievement.relatedCourses).map((course, i) => (
                <span key={i} className="px-2 py-1 bg-secondary/10 text-secondary text-xs font-medium rounded-lg">
                  {course}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-center space-x-2">
            <ApperIcon name={achievement.isPublic === 'True' ? 'Globe' : 'Lock'} className="w-4 h-4 text-slate-400" />
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {achievement.isPublic === 'True' ? 'Public' : 'Private'}
            </span>
          </div>
          {achievement.CreatedOn && (
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {new Date(achievement.CreatedOn).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  )

  const renderAchievementList = (achievement, index) => (
    <motion.div
      key={achievement.Id}
      className="learning-card p-4 group hover:shadow-lg transition-all duration-300"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-1">
          <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
            <ApperIcon name="Award" className="w-5 h-5 text-white" />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-1">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                {achievement.Name}
              </h3>
              <div className={`px-2 py-1 rounded-lg text-xs font-medium ${getLevelColor(achievement.achievementLevel)}`}>
                {achievement.achievementLevel}
              </div>
              <div className="flex items-center space-x-1">
                <ApperIcon name={achievement.isPublic === 'True' ? 'Globe' : 'Lock'} className="w-3 h-3 text-slate-400" />
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {achievement.isPublic === 'True' ? 'Public' : 'Private'}
                </span>
              </div>
            </div>
            
            {achievement.description && (
              <p className="text-slate-600 dark:text-slate-400 text-sm mb-2 line-clamp-2">
                {achievement.description}
              </p>
            )}
            
            <div className="flex items-center space-x-4 text-xs text-slate-500 dark:text-slate-400">
              {achievement.awardedBy && (
                <span>Awarded by: {achievement.awardedBy}</span>
              )}
              {achievement.CreatedOn && (
                <span>{new Date(achievement.CreatedOn).toLocaleDateString()}</span>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => handleEditAchievement(achievement)}
            className="p-2 neu-button rounded-lg text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20"
            disabled={updating}
          >
            <ApperIcon name="Edit" className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDeleteAchievement(achievement.Id)}
            className="p-2 neu-button rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
            disabled={deleting}
          >
            <ApperIcon name="Trash2" className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading achievements...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold gradient-text mb-2">Achievements</h1>
          <p className="text-slate-600 dark:text-slate-400">Track your learning milestones and accomplishments</p>
        </div>

        <div className="learning-card p-6 lg:p-8">
          {/* Controls */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
              {/* View Mode Toggle */}
              <div className="flex space-x-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg font-medium transition-all duration-300 ${
                    viewMode === 'grid'
                      ? 'bg-white dark:bg-slate-700 text-primary shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <ApperIcon name="Grid" className="w-4 h-4" />
                  <span>Grid</span>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg font-medium transition-all duration-300 ${
                    viewMode === 'list'
                      ? 'bg-white dark:bg-slate-700 text-primary shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <ApperIcon name="List" className="w-4 h-4" />
                  <span>List</span>
                </button>
              </div>

              {/* Level Filter */}
              <select
                value={filterLevel}
                onChange={(e) => setFilterLevel(e.target.value)}
                className="learning-input py-2 min-w-[150px]"
              >
                <option value="">All Levels</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            {/* Add Achievement Button */}
            <motion.button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center space-x-2 bg-gradient-to-r from-primary to-secondary text-white px-4 py-2 rounded-xl font-medium hover:shadow-lg transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <ApperIcon name="Plus" className="w-4 h-4" />
              <span>Add Achievement</span>
            </motion.button>
          </div>

          {/* Add/Edit Achievement Form */}
          <AnimatePresence>
            {showAddForm && (
              <motion.form
                onSubmit={editingAchievement ? handleUpdateAchievement : handleCreateAchievement}
                className="learning-card p-6 space-y-6 mb-8"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                    {editingAchievement ? 'Edit Achievement' : 'Add New Achievement'}
                  </h3>
                  {editingAchievement && (
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                    >
                      <ApperIcon name="X" className="w-5 h-5" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Achievement Name *
                    </label>
                    <input
                      type="text"
                      value={formData.Name}
                      onChange={(e) => setFormData(prev => ({ ...prev, Name: e.target.value }))}
                      className="learning-input"
                      placeholder="Enter achievement name"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Achievement Level
                    </label>
                    <select
                      value={formData.achievementLevel}
                      onChange={(e) => setFormData(prev => ({ ...prev, achievementLevel: e.target.value }))}
                      className="learning-input"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Tags (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={formData.Tags}
                      onChange={(e) => setFormData(prev => ({ ...prev, Tags: e.target.value }))}
                      className="learning-input"
                      placeholder="e.g., programming, certification, milestone"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Awarded By
                    </label>
                    <input
                      type="text"
                      value={formData.awardedBy}
                      onChange={(e) => setFormData(prev => ({ ...prev, awardedBy: e.target.value }))}
                      className="learning-input"
                      placeholder="Institution or organization"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Related Courses (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.relatedCourses}
                    onChange={(e) => setFormData(prev => ({ ...prev, relatedCourses: e.target.value }))}
                    className="learning-input"
                    placeholder="e.g., Course1, Course2, Course3"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="learning-input h-24 resize-none"
                    placeholder="Describe this achievement and what it represents"
                  />
                </div>
                
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="isPublic"
                    checked={formData.isPublic}
                    onChange={(e) => setFormData(prev => ({ ...prev, isPublic: e.target.checked }))}
                    className="w-4 h-4 text-primary border-slate-300 rounded focus:ring-primary"
                  />
                  <label htmlFor="isPublic" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Make this achievement public
                  </label>
                </div>
                
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    disabled={creating || updating}
                    className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded-xl font-medium hover:bg-primary-dark transition-colors disabled:opacity-50"
                  >
                    {(creating || updating) && (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    )}
                    <ApperIcon name="Check" className="w-4 h-4" />
                    <span>{editingAchievement ? 'Update' : 'Create'} Achievement</span>
                  </button>
                  <button
                    type="button"
                    onClick={editingAchievement ? handleCancelEdit : () => setShowAddForm(false)}
                    className="flex items-center space-x-2 neu-button px-4 py-2 rounded-xl font-medium text-slate-600 dark:text-slate-400"
                  >
                    <ApperIcon name="X" className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Error State */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-8">
              <div className="flex items-center space-x-3">
                <ApperIcon name="AlertCircle" className="w-5 h-5 text-red-500" />
                <span className="text-red-700 dark:text-red-400">{error}</span>
                <button
                  onClick={fetchAchievements}
                  className="ml-auto text-red-700 dark:text-red-400 hover:text-red-900 dark:hover:text-red-200"
                >
                  <ApperIcon name="RefreshCw" className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Achievements Display */}
          {achievements.length === 0 ? (
            <div className="text-center py-12">
              <ApperIcon name="Award" className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">
                No achievements yet
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                {filterLevel ? `No ${filterLevel.toLowerCase()} achievements found.` : 'Start tracking your learning milestones by adding your first achievement!'}
              </p>
              {!filterLevel && (
                <button
                  onClick={() => setShowAddForm(true)}
                  className="bg-primary text-white px-4 py-2 rounded-xl font-medium hover:bg-primary-dark transition-colors"
                >
                  Add Your First Achievement
                </button>
              )}
            </div>
          ) : (
            <div className={`${
              viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
                : 'space-y-4'
            }`}>
              {achievements.map((achievement, index) => 
                viewMode === 'grid' 
                  ? renderAchievementCard(achievement, index)
                  : renderAchievementList(achievement, index)
              )}
            </div>
          )}

          {/* Footer Stats */}
          {achievements.length > 0 && (
            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4">
                  <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{achievements.length}</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Total Achievements</div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4">
                  <div className="text-2xl font-bold text-green-600">
                    {achievements.filter(a => a.achievementLevel === 'Beginner').length}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Beginner</div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4">
                  <div className="text-2xl font-bold text-yellow-600">
                    {achievements.filter(a => a.achievementLevel === 'Intermediate').length}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Intermediate</div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4">
                  <div className="text-2xl font-bold text-red-600">
                    {achievements.filter(a => a.achievementLevel === 'Advanced').length}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Advanced</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}