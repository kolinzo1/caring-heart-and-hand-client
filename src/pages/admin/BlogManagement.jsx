import React, { useState, useEffect } from 'react';
import { useToast } from '../../hooks/useToast';
import { blogService } from '../../services/api/blogService';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '../../components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../../components/ui/dialog';
import { 
  PenTool, 
  Trash2, 
  Eye, 
  Plus,
  Filter,
  Search,
  FileText,
  Tag,
  Calendar 
} from 'lucide-react';

const BlogManagement = () => {
  const { addToast } = useToast();
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: '',
    tags: [],
    status: 'draft',
    meta_description: '',
    featured_image: ''
  });
  
  useEffect(() => {
    fetchPosts();
    fetchCategories();
  }, []);

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const data = await blogService.getAdminPosts();
      setPosts(data.posts);
    } catch (error) {
      addToast({
        title: 'Error',
        description: 'Failed to fetch blog posts',
        variant: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await blogService.getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPost) {
        await blogService.updatePost(editingPost.id, formData);
      } else {
        await blogService.createPost(formData);
      }
      fetchPosts();
      setShowModal(false);
      setEditingPost(null);
      addToast({
        title: 'Success',
        description: editingPost ? 'Post updated successfully' : 'Post created successfully',
        variant: 'success'
      });
    } catch (error) {
      addToast({
        title: 'Error',
        description: 'Failed to save post',
        variant: 'error'
      });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await blogService.deletePost(id);
        fetchPosts();
        addToast({
          title: 'Success',
          description: 'Post deleted successfully',
          variant: 'success'
        });
      } catch (error) {
        addToast({
          title: 'Error',
          description: 'Failed to delete post',
          variant: 'error'
        });
      }
    }
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      content: post.content,
      excerpt: post.excerpt,
      category: post.category,
      tags: post.tags ? JSON.parse(post.tags) : [],
      status: post.status,
      meta_description: post.meta_description,
      featured_image: post.featured_image
    });
    setShowModal(true);
  };

  const handleAddNew = () => {
    setEditingPost(null);
    setFormData({
      title: '',
      content: '',
      excerpt: '',
      category: '',
      tags: [],
      status: 'draft',
      meta_description: '',
      featured_image: ''
    });
    setShowModal(true);
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || post.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeColor = (status) => {
    const colors = {
      draft: 'bg-yellow-100 text-yellow-800',
      published: 'bg-green-100 text-green-800',
      archived: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || colors.draft;
  };

  return (
    <div className="p-6 bg-gray-400">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Blog Management</h1>
        <Button onClick={handleAddNew} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          New Post
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-48"
        >
          <option value="all">All Status</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </Select>
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        {filteredPosts.map((post) => (
          <Card key={post.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg mb-1">{post.title}</h3>
                  <div className="flex gap-4 text-sm text-gray-500">
                    <span className="flex items-center">
                      <Tag className="w-4 h-4 mr-1" />
                      {post.category || 'Uncategorized'}
                    </span>
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(post.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${getStatusBadgeColor(post.status)}`}>
                  {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                </span>
              </div>

              <div className="mt-4 text-gray-600 line-clamp-2">{post.excerpt}</div>

              <div className="flex justify-between items-center mt-4 pt-4 border-t">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(post)}>
                    <PenTool className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-500 hover:text-red-600"
                    onClick={() => handleDelete(post.id)}
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(`/blog/${post.slug}`, '_blank')}
                >
                  <Eye className="w-4 h-4 mr-1" />
                  View
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add/Edit Post Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal} >
        <DialogContent className="sm:max-w-[800px] bg-gray-300">
          <DialogHeader>
            <DialogTitle>
              {editingPost ? 'Edit Post' : 'Create New Post'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title *</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Content *</label>
              <Textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={10}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Excerpt</label>
              <Textarea
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => 
                    setFormData({ ...formData, category: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.name}>
                        {category.name}
                      </SelectItem>                    
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => 
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Meta Description</label>
              <Textarea
                value={formData.meta_description}
                onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                rows={2}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {editingPost ? 'Update Post' : 'Create Post'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BlogManagement;