import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { ChevronRight } from "lucide-react";

const BlogPostDialog = ({ post, trigger }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-3xl bg-white">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(post.category)}`}>
              {post.category}
            </span>
            <span className="text-sm text-gray-500">
              {new Date(post.created_at).toLocaleDateString()}
            </span>
          </div>
          <DialogTitle className="text-2xl font-bold">
            {post.title}
          </DialogTitle>
        </DialogHeader>
        <div className="mt-6 prose prose-blue max-w-none">
          <p className="whitespace-pre-wrap">{post.content}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const getCategoryColor = (category) => {
  const colors = {
    "Care Guide": "bg-blue-100 text-blue-800",
    "Care Tips": "bg-purple-100 text-purple-800",
    default: "bg-gray-100 text-gray-800",
  };
  return colors[category] || colors.default;
};

export default BlogPostDialog;