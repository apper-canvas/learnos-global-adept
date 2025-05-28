// Module Service - handles all CRUD operations for modules

const { ApperClient } = window.ApperSDK

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
})

const tableName = 'module'

// All fields for fetch operations
const allFields = [
  'Id', 'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy',
  'title', 'description', 'duration', 'completed', 'learning_topics', 'subject'
]

// Only updateable fields for create/update operations
const updateableFields = [
  'Name', 'Tags', 'Owner', 'title', 'description', 'duration', 'completed', 'learning_topics', 'subject'
]

export const moduleService = {
  async fetchModules(params = {}) {
    try {
      const fetchParams = {
        fields: allFields,
        orderBy: [{ fieldName: 'CreatedOn', SortType: 'ASC' }],
        ...params
      }
      
      const response = await apperClient.fetchRecords(tableName, fetchParams)
      return response?.data || []
    } catch (error) {
      console.error('Error fetching modules:', error)
      throw error
    }
  },

  async getModuleById(id) {
    try {
      const params = { fields: allFields }
      const response = await apperClient.getRecordById(tableName, id, params)
      return response?.data || null
    } catch (error) {
      console.error(`Error fetching module with ID ${id}:`, error)
      throw error
    }
  },

  async createModule(moduleData) {
    try {
      // Filter to only include updateable fields
      const filteredData = {}
      updateableFields.forEach(field => {
        if (moduleData[field] !== undefined) {
          filteredData[field] = moduleData[field]
        }
      })

      // Format checkbox field as comma-separated string
      if (Array.isArray(filteredData.completed)) {
        filteredData.completed = filteredData.completed.join(',')
      } else if (typeof filteredData.completed === 'boolean') {
        filteredData.completed = filteredData.completed ? 'true' : 'false'
      }

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
        throw new Error(response?.results?.[0]?.message || 'Failed to create module')
      }
    } catch (error) {
      console.error('Error creating module:', error)
      throw error
    }
  },

  async updateModule(id, moduleData) {
    try {
      // Filter to only include updateable fields plus ID
      const filteredData = { Id: id }
      updateableFields.forEach(field => {
        if (moduleData[field] !== undefined) {
          filteredData[field] = moduleData[field]
        }
      })

      // Format checkbox field as comma-separated string
      if (Array.isArray(filteredData.completed)) {
        filteredData.completed = filteredData.completed.join(',')
      } else if (typeof filteredData.completed === 'boolean') {
        filteredData.completed = filteredData.completed ? 'true' : 'false'
      }

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
        throw new Error(response?.results?.[0]?.message || 'Failed to update module')
      }
    } catch (error) {
      console.error('Error updating module:', error)
      throw error
    }
  },

  async deleteModule(id) {
    try {
      const params = { RecordIds: [id] }
      const response = await apperClient.deleteRecord(tableName, params)
      
      if (response?.success && response?.results?.[0]?.success) {
        return true
      } else {
        throw new Error(response?.results?.[0]?.message || 'Failed to delete module')
      }
    } catch (error) {
      console.error('Error deleting module:', error)
      throw error
    }
  },

  async fetchModulesBySubject(subjectId) {
    try {
      const params = {
        fields: allFields,
        where: [{
          fieldName: 'subject',
          operator: 'EqualTo',
          values: [subjectId.toString()]
        }],
        orderBy: [{ fieldName: 'CreatedOn', SortType: 'ASC' }]
      }
      
      const response = await apperClient.fetchRecords(tableName, params)
      return response?.data || []
    } catch (error) {
      console.error('Error fetching modules by subject:', error)
      throw error
    }
  }
}
