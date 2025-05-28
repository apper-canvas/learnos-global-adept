// Goal Service - handles all CRUD operations for goals

const { ApperClient } = window.ApperSDK

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
})

const tableName = 'goal'

// All fields for fetch operations
const allFields = [
  'Id', 'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy',
  'title', 'description', 'progress', 'target_date', 'status'
]

// Only updateable fields for create/update operations
const updateableFields = [
  'Name', 'Tags', 'Owner', 'title', 'description', 'progress', 'target_date', 'status'
]

export const goalService = {
  async fetchGoals(params = {}) {
    try {
      const fetchParams = {
        fields: allFields,
        orderBy: [{ fieldName: 'target_date', SortType: 'ASC' }],
        ...params
      }
      
      const response = await apperClient.fetchRecords(tableName, fetchParams)
      return response?.data || []
    } catch (error) {
      console.error('Error fetching goals:', error)
      throw error
    }
  },

  async getGoalById(id) {
    try {
      const params = { fields: allFields }
      const response = await apperClient.getRecordById(tableName, id, params)
      return response?.data || null
    } catch (error) {
      console.error(`Error fetching goal with ID ${id}:`, error)
      throw error
    }
  },

  async createGoal(goalData) {
    try {
      // Filter to only include updateable fields
      const filteredData = {}
      updateableFields.forEach(field => {
        if (goalData[field] !== undefined) {
          filteredData[field] = goalData[field]
        }
      })

      // Format tags as comma-separated string if it's an array
      if (Array.isArray(filteredData.Tags)) {
        filteredData.Tags = filteredData.Tags.join(',')
      }

      const params = {
        records: [filteredData]
      }

      const response = await apperClient.createRecord(tableName, params)
      
      if (response?.success && response?.results?.[0]?.success) {
        return response.results[0].data
      } else {
        throw new Error(response?.results?.[0]?.message || 'Failed to create goal')
      }
    } catch (error) {
      console.error('Error creating goal:', error)
      throw error
    }
  },

  async updateGoal(id, goalData) {
    try {
      // Filter to only include updateable fields plus ID
      const filteredData = { Id: id }
      updateableFields.forEach(field => {
        if (goalData[field] !== undefined) {
          filteredData[field] = goalData[field]
        }
      })

      // Format tags as comma-separated string if it's an array
      if (Array.isArray(filteredData.Tags)) {
        filteredData.Tags = filteredData.Tags.join(',')
      }

      const params = {
        records: [filteredData]
      }

      const response = await apperClient.updateRecord(tableName, params)
      
      if (response?.success && response?.results?.[0]?.success) {
        return response.results[0].data
      } else {
        throw new Error(response?.results?.[0]?.message || 'Failed to update goal')
      }
    } catch (error) {
      console.error('Error updating goal:', error)
      throw error
    }
  },

  async deleteGoal(id) {
    try {
      const params = { RecordIds: [id] }
      const response = await apperClient.deleteRecord(tableName, params)
      
      if (response?.success && response?.results?.[0]?.success) {
        return true
      } else {
        throw new Error(response?.results?.[0]?.message || 'Failed to delete goal')
      }
    } catch (error) {
      console.error('Error deleting goal:', error)
      throw error
    }
  }
}
