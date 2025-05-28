// Note Service - handles all CRUD operations for notes

const { ApperClient } = window.ApperSDK

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
})

const tableName = 'note2'

// All fields for fetch operations
const allFields = [
  'Id', 'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy',
  'title', 'content', 'created_at', 'subject'
]

// Only updateable fields for create/update operations
const updateableFields = [
  'Name', 'Tags', 'Owner', 'title', 'content', 'created_at', 'subject'
]

export const noteService = {
  async fetchNotes(params = {}) {
    try {
      const fetchParams = {
        fields: allFields,
        orderBy: [{ fieldName: 'CreatedOn', SortType: 'DESC' }],
        ...params
      }
      
      const response = await apperClient.fetchRecords(tableName, fetchParams)
      return response?.data || []
    } catch (error) {
      console.error('Error fetching notes:', error)
      throw error
    }
  },

  async getNoteById(id) {
    try {
      const params = { fields: allFields }
      const response = await apperClient.getRecordById(tableName, id, params)
      return response?.data || null
    } catch (error) {
      console.error(`Error fetching note with ID ${id}:`, error)
      throw error
    }
  },

  async createNote(noteData) {
    try {
      // Filter to only include updateable fields
      const filteredData = {}
      updateableFields.forEach(field => {
        if (noteData[field] !== undefined) {
          filteredData[field] = noteData[field]
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
        throw new Error(response?.results?.[0]?.message || 'Failed to create note')
      }
    } catch (error) {
      console.error('Error creating note:', error)
      throw error
    }
  },

  async updateNote(id, noteData) {
    try {
      // Filter to only include updateable fields plus ID
      const filteredData = { Id: id }
      updateableFields.forEach(field => {
        if (noteData[field] !== undefined) {
          filteredData[field] = noteData[field]
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
        throw new Error(response?.results?.[0]?.message || 'Failed to update note')
      }
    } catch (error) {
      console.error('Error updating note:', error)
      throw error
    }
  },

  async deleteNote(id) {
    try {
      const params = { RecordIds: [id] }
      const response = await apperClient.deleteRecord(tableName, params)
      
      if (response?.success && response?.results?.[0]?.success) {
        return true
      } else {
        throw new Error(response?.results?.[0]?.message || 'Failed to delete note')
      }
    } catch (error) {
      console.error('Error deleting note:', error)
      throw error
    }
  },

  async fetchNotesBySubject(subjectId) {
    try {
      const params = {
        fields: allFields,
        where: [{
          fieldName: 'subject',
          operator: 'EqualTo',
          values: [subjectId.toString()]
        }],
        orderBy: [{ fieldName: 'CreatedOn', SortType: 'DESC' }]
      }
      
      const response = await apperClient.fetchRecords(tableName, params)
      return response?.data || []
    } catch (error) {
      console.error('Error fetching notes by subject:', error)
      throw error
    }
  }
}
