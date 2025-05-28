// Subject Service - handles all CRUD operations for subjects

const { ApperClient } = window.ApperSDK

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
})

const tableName = 'subject'

// All fields for fetch operations
const allFields = [
  'Id', 'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy',
  'title', 'description', 'progress', 'color', 'modules', 'completed_modules', 
  'enrolled_date', 'estimated_completion'
]

// Only updateable fields for create/update operations
const updateableFields = [
  'Name', 'Tags', 'Owner', 'title', 'description', 'progress', 'color', 
  'modules', 'completed_modules', 'enrolled_date', 'estimated_completion'
]

export const subjectService = {
  async fetchSubjects(params = {}) {
    try {
      const fetchParams = {
        fields: allFields,
        orderBy: [{ fieldName: 'CreatedOn', SortType: 'DESC' }],
        ...params
      }
      
      const response = await apperClient.fetchRecords(tableName, fetchParams)
      return response?.data || []
    } catch (error) {
      console.error('Error fetching subjects:', error)
      throw error
    }
  },

  async getSubjectById(id) {
    try {
      const params = { fields: allFields }
      const response = await apperClient.getRecordById(tableName, id, params)
      return response?.data || null
    } catch (error) {
      console.error(`Error fetching subject with ID ${id}:`, error)
      throw error
    }
  },

  async createSubject(subjectData) {
    try {
      // Filter to only include updateable fields
      const filteredData = {}
      updateableFields.forEach(field => {
        if (subjectData[field] !== undefined) {
          filteredData[field] = subjectData[field]
        }
      })

      const params = {
        records: [filteredData]
      }

      const response = await apperClient.createRecord(tableName, params)
      
      if (response?.success && response?.results?.[0]?.success) {
        return response.results[0].data
      } else {
        throw new Error(response?.results?.[0]?.message || 'Failed to create subject')
      }
    } catch (error) {
      console.error('Error creating subject:', error)
      throw error
    }
  },

  async updateSubject(id, subjectData) {
    try {
      // Filter to only include updateable fields plus ID
      const filteredData = { Id: id }
      updateableFields.forEach(field => {
        if (subjectData[field] !== undefined) {
          filteredData[field] = subjectData[field]
        }
      })

      const params = {
        records: [filteredData]
      }

      const response = await apperClient.updateRecord(tableName, params)
      
      if (response?.success && response?.results?.[0]?.success) {
        return response.results[0].data
      } else {
        throw new Error(response?.results?.[0]?.message || 'Failed to update subject')
      }
    } catch (error) {
      console.error('Error updating subject:', error)
      throw error
    }
  },

  async deleteSubject(id) {
    try {
      const params = { RecordIds: [id] }
      const response = await apperClient.deleteRecord(tableName, params)
      
      if (response?.success && response?.results?.[0]?.success) {
        return true
      } else {
        throw new Error(response?.results?.[0]?.message || 'Failed to delete subject')
      }
    } catch (error) {
      console.error('Error deleting subject:', error)
      throw error
    }
  }
}
