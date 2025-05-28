class AchievementService {
  constructor() {
    // Initialize client as null - will be created when needed
    this.client = null;
    this.tableName = 'achievement';
  }

  // Safe initialization of ApperClient
  initializeClient() {
    if (!this.client) {
      // Check if ApperSDK is available
      if (typeof window !== 'undefined' && window.ApperSDK && window.ApperSDK.ApperClient) {
        const { ApperClient } = window.ApperSDK;
        this.client = new ApperClient({
          apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
          apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
        });
      } else {
        throw new Error('Apper SDK is not available. Make sure the SDK script is loaded.');
      }
    }
    return this.client;
  }


  // Get all fields for achievement table
  getAllFields() {
    return [
      'Name',
      'Tags', 
      'Owner',
      'CreatedOn',
      'CreatedBy',
      'ModifiedOn', 
      'ModifiedBy',
      'achievementLevel',
      'isPublic',
      'relatedCourses',
      'description',
      'awardedBy'
    ];
  }

  // Get only updateable fields for create/update operations
  getUpdateableFields() {
    return [
      'Name',
      'Tags',
      'Owner', 
      'achievementLevel',
      'isPublic',
      'relatedCourses',
      'description',
      'awardedBy'
    ];
  }

  async fetchAchievements(filters = {}, pagingInfo = { limit: 20, offset: 0 }) {
    try {
      // Initialize client safely
      const client = this.initializeClient();
      
      const params = {
        fields: this.getAllFields(),
        where: [],
        pagingInfo
      };


      // Add filters if provided
      if (filters.achievementLevel) {
        params.where.push({
          fieldName: 'achievementLevel',
          operator: 'ExactMatch',
          values: [filters.achievementLevel]
        });
      }

      if (filters.isPublic !== undefined) {
        params.where.push({
          fieldName: 'isPublic',
          operator: 'ExactMatch',
          values: [filters.isPublic ? 'True' : 'False']
        });
      }

      if (filters.searchTerm) {
        params.where.push({
          fieldName: 'Name',
          operator: 'Contains',
          values: [filters.searchTerm]
        });
      }

      // Add ordering
      params.orderBy = [{
        fieldName: 'CreatedOn',
        SortType: 'DESC'
      }];

      const response = await client.fetchRecords(this.tableName, params);

      
      // Handle empty or non-existent data
      if (!response || !response.data) {
        return {
          data: [],
          success: true,
          totalCount: 0
        };
      }

      return {
        data: Array.isArray(response.data) ? response.data : [response.data],
        success: true,
        totalCount: response.totalCount || response.data.length
      };
    } catch (error) {
      console.error('Error fetching achievements:', error);
      return {
        data: [],
        success: false,
        error: error.message || 'Failed to fetch achievements'
      };
    }
  }

  // Get a single achievement by ID
  async getAchievementById(achievementId) {
    try {
      // Initialize client safely
      const client = this.initializeClient();
      
      const params = {
        fields: this.getAllFields()
      };

      const response = await client.getRecordById(this.tableName, achievementId, params);

      
      // Handle non-existent data
      if (!response || !response.data) {
        return {
          data: null,
          success: false,
          error: 'Achievement not found'
        };
      }

      return {
        data: response.data,
        success: true
      };
    } catch (error) {
      console.error(`Error fetching achievement with ID ${achievementId}:`, error);
      return {
        data: null,
        success: false,
        error: error.message || 'Failed to fetch achievement'
      };
    }
  }

  // Create new achievements
  async createAchievements(achievementsData) {
    try {
      // Initialize client safely
      const client = this.initializeClient();
      
      // Ensure achievementsData is an array
      const achievements = Array.isArray(achievementsData) ? achievementsData : [achievementsData];
      
      // Filter to only include updateable fields and format data properly
      const updateableFields = this.getUpdateableFields();
      const records = achievements.map(achievement => {
        const record = {};
        
        updateableFields.forEach(field => {
          if (achievement[field] !== undefined) {
            // Format data according to field types
            if (field === 'isPublic') {
              // Convert boolean to checkbox format
              record[field] = achievement[field] ? 'True' : 'False';
            } else if (field === 'Tags' || field === 'relatedCourses') {
              // Handle comma-separated values for Tag and MultiPicklist fields
              if (Array.isArray(achievement[field])) {
                record[field] = achievement[field].join(',');
              } else if (typeof achievement[field] === 'string') {
                record[field] = achievement[field];
              } else {
                record[field] = '';
              }
            } else {
              record[field] = achievement[field];
            }
          }
        });
        
        return record;
      });

      const params = {
        records: records
      };

      const response = await client.createRecord(this.tableName, params);

      
      // Handle bulk creation response
      if (response && response.success && response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.warn(`Failed to create ${failedRecords.length} achievements`);
          failedRecords.forEach(record => {
            if (record.errors) {
              record.errors.forEach(error => {
                console.error(`Field: ${error.fieldLabel}, Error: ${error.message}`);
              });
            } else if (record.message) {
              console.error(`Error: ${record.message}`);
            }
          });
        }
        
        return {
          data: successfulRecords.map(result => result.data),
          success: true,
          createdCount: successfulRecords.length,
          failedCount: failedRecords.length,
          errors: failedRecords
        };
      } else {
        return {
          data: [],
          success: false,
          error: 'Failed to create achievements'
        };
      }
    } catch (error) {
      console.error('Error creating achievements:', error);
      return {
        data: [],
        success: false,
        error: error.message || 'Failed to create achievements'
      };
    }
  }

  // Update existing achievements
  async updateAchievements(achievementsData) {
    try {
      // Initialize client safely
      const client = this.initializeClient();
      
      // Ensure achievementsData is an array
      const achievements = Array.isArray(achievementsData) ? achievementsData : [achievementsData];
      
      // Filter to only include updateable fields plus Id and format data properly
      const updateableFields = this.getUpdateableFields();
      const records = achievements.map(achievement => {
        const record = {
          Id: achievement.Id || achievement.id
        };
        
        updateableFields.forEach(field => {
          if (achievement[field] !== undefined) {
            // Format data according to field types
            if (field === 'isPublic') {
              // Convert boolean to checkbox format
              record[field] = achievement[field] ? 'True' : 'False';
            } else if (field === 'Tags' || field === 'relatedCourses') {
              // Handle comma-separated values for Tag and MultiPicklist fields
              if (Array.isArray(achievement[field])) {
                record[field] = achievement[field].join(',');
              } else if (typeof achievement[field] === 'string') {
                record[field] = achievement[field];
              } else {
                record[field] = '';
              }
            } else {
              record[field] = achievement[field];
            }
          }
        });
        
        return record;
      });

      const params = {
        records: records
      };

      const response = await client.updateRecord(this.tableName, params);

      
      // Handle bulk update response
      if (response && response.success && response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.warn(`Failed to update ${failedUpdates.length} achievements`);
          failedUpdates.forEach(record => {
            console.error(`Error: ${record.message || 'Record does not exist'}`);
          });
        }
        
        return {
          data: successfulUpdates.map(result => result.data),
          success: true,
          updatedCount: successfulUpdates.length,
          failedCount: failedUpdates.length,
          errors: failedUpdates
        };
      } else {
        return {
          data: [],
          success: false,
          error: 'Failed to update achievements'
        };
      }
    } catch (error) {
      console.error('Error updating achievements:', error);
      return {
        data: [],
        success: false,
        error: error.message || 'Failed to update achievements'
      };
    }
  }

  // Delete achievements by IDs
  async deleteAchievements(achievementIds) {
    try {
      // Initialize client safely
      const client = this.initializeClient();
      
      // Ensure achievementIds is an array
      const ids = Array.isArray(achievementIds) ? achievementIds : [achievementIds];
      
      const params = {
        RecordIds: ids
      };

      const response = await client.deleteRecord(this.tableName, params);

      
      // Handle bulk deletion response
      if (response && response.success && response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.warn(`Failed to delete ${failedDeletions.length} achievements`);
          failedDeletions.forEach(record => {
            console.error(`Error: ${record.message || 'Record does not exist'}`);
          });
        }
        
        return {
          success: true,
          deletedCount: successfulDeletions.length,
          failedCount: failedDeletions.length,
          errors: failedDeletions
        };
      } else {
        return {
          success: false,
          error: 'Failed to delete achievements'
        };
      }
    } catch (error) {
      console.error('Error deleting achievements:', error);
      return {
        success: false,
        error: error.message || 'Failed to delete achievements'
      };
    }
  }
}

export default new AchievementService();