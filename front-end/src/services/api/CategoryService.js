import { api } from '../index';

class CategoryService {
    async getAllCategories() {
        try {
            const result = await api.get('/categories');
            return result.data.data; // Extract the data array from the response
        } catch (error) {
            throw new Error('Failed to fetch categories: ' + error.message);
        }
    }

    async getCategoryById(categoryId) {
        try {
            const result = await api.get(`/categories/${categoryId}`);
            return result.data.data;
        } catch (error) {
            throw new Error(`Failed to fetch category ${categoryId}: ${error.message}`);
        }
    }

    async createCategory(category) {
        try {
            const result = await api.post('/categories', category);
            return result.data.data;
        } catch (error) {
            throw new Error('Failed to create category: ' + error.message);
        }
    }

    async updateCategory(categoryId, updatedCategory) {
        try {
            const result = await api.put(`/categories/${categoryId}`, updatedCategory);
            return result.data.data;
        } catch (error) {
            throw new Error(`Failed to update category ${categoryId}: ${error.message}`);
        }
    }

    async deleteCategory(categoryId) {
        try {
            const result = await api.delete(`/categories/${categoryId}`);
            return result.data;
        } catch (error) {
            throw new Error(`Failed to delete category ${categoryId}: ${error.message}`);
        }
    }

    async getProductsByCategory(categoryId) {
        try {
            const result = await api.get(`/categories/${categoryId}/products`);
            return result.data.data;
        } catch (error) {
            throw new Error(`Failed to fetch products for category ${categoryId}: ${error.message}`);
        }
    }

    async searchCategories(searchTerm) {
        try {
            const result = await api.get(`/categories/search?q=${encodeURIComponent(searchTerm)}`);
            return result.data.data;
        } catch (error) {
            throw new Error('Failed to search categories: ' + error.message);
        }
    }
}

export default new CategoryService();