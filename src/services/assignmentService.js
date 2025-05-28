// Assignment Service - handles all CRUD operations for assignments

const { ApperClient } = window.ApperSDK

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
})

const tableName = 'assignment1'

// All fields for fetch operations
const allFields = [
  'Id', 'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy',
  'title', 'description', 'due_date', 'priority', 'completed', 'subject'
]

// Only updateable fields for create/update operations
const updateableFields = [
  'Name', 'Tags', 'Owner', 'title', 'description', 'due_date', 'priority', 'completed', 'subject'
]

export const assignmentService = {
  async fetchAssignments(params = {}) {
    try {
      const fetchParams = {
        fields: allFields,
        orderBy: [{ fieldName: 'due_date', SortType: 'ASC' }],
        ...params
      }
      
      const response = await apperClient.fetchRecords(tableName, fetchParams)
      return response?.data || []
    } catch (error) {
      console.error('Error fetching assignments:', error)
      throw error
    }
  },

  async getAssignmentById(id) {
    try {
      const params = { fields: allFields }
      const response = await apperClient.getRecordById(tableName, id, params)
      return response?.data || null
    } catch (error) {
      console.error(`Error fetching assignment with ID ${id}:`, error)
      throw error
    }
  },

  async createAssignment(assignmentData) {
    try {
      // Filter to only include updateable fields
      const filteredData = {}
      updateableFields.forEach(field => {
        if (assignmentData[field] !== undefined) {
          filteredData[field] = assignmentData[field]
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
        throw new Error(response?.results?.[0]?.message || 'Failed to create assignment')
      }
    } catch (error) {
      console.error('Error creating assignment:', error)
      throw error
    }
  },

  async updateAssignment(id, assignmentData) {
    try {
      // Filter to only include updateable fields plus ID
      const filteredData = { Id: id }
      updateableFields.forEach(field => {
        if (assignmentData[field] !== undefined) {
          filteredData[field] = assignmentData[field]
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
        throw new Error(response?.results?.[0]?.message || 'Failed to update assignment')
      }
    } catch (error) {
      console.error('Error updating assignment:', error)
      throw error
    }
  },

  async deleteAssignment(id) {
    try {
      const params = { RecordIds: [id] }
      const response = await apperClient.deleteRecord(tableName, params)
      
      if (response?.success && response?.results?.[0]?.success) {
        return true
      } else {
        throw new Error(response?.results?.[0]?.message || 'Failed to delete assignment')
      }
    } catch (error) {
      console.error('Error deleting assignment:', error)
      throw error
    }
  },

  async fetchAssignmentsBySubject(subjectId) {
    try {
      const params = {
        fields: allFields,
        where: [{
          fieldName: 'subject',
          operator: 'EqualTo',
          values: [subjectId.toString()]
        }],
        orderBy: [{ fieldName: 'due_date', SortType: 'ASC' }]
      }
      
      const response = await apperClient.fetchRecords(tableName, params)
      return response?.data || []
    } catch (error) {
      console.error('Error fetching assignments by subject:', error)
      throw error
    }
  }
}
