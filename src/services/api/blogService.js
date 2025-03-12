import api from '../../lib/axios';

export const blogService = {
  // Public endpoints
  async getPosts(params = {}) {
    const response = await api.get('/api/blog/posts', { params });
    return response.data;
  },

  async getPost(slug) {
    const response = await api.get(`/api/blog/posts/${slug}`);
    return response.data;
  },

  async getCategories() {
    const response = await api.get('/api/blog/categories');
    return response.data;
  },

  // Admin endpoints
  async getAdminPosts(params = {}) {
    const response = await api.get('/api/blog/admin/posts', { params });
    return response.data;
  },

  async createPost(postData) {
    const response = await api.post('/api/blog/admin/posts', postData);
    return response.data;
  },

  async updatePost(id, postData) {
    const response = await api.put(`/api/blog/admin/posts/${id}`, postData);
    return response.data;
  },

  async deletePost(id) {
    const response = await api.delete(`/api/blog/admin/posts/${id}`);
    return response.data;
  },

  async createCategory(categoryData) {
    const response = await api.post('/api/blog/admin/categories', categoryData);
    return response.data;
  },

  async uploadImage(file) {
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await api.post('/api/blog/admin/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
};