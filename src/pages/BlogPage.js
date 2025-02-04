import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useToast } from "../hooks/useToast";
import { Skeleton } from "../components/ui/LoadingStates/Skeleton";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";

const BlogPage = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { addToast } = useToast();

  const POSTS_PER_PAGE = 6;

  useEffect(() => {
    fetchPosts();
  }, [currentPage]);

  const fetchPosts = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call with timeout
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock data - replace with actual API call
      const mockPosts = [
        {
          id: 1,
          title: "Understanding Home Care Services",
          excerpt:
            "Learn about the different types of home care services and how they can benefit you or your loved ones.",
          date: "January 15, 2024",
          category: "Care Guide",
          readTime: "5 min read",
        },
        {
          id: 2,
          title: "Tips for Choosing a Home Care Provider",
          excerpt:
            "Important factors to consider when selecting a home care service provider for your family member.",
          date: "January 10, 2024",
          category: "Advice",
          readTime: "4 min read",
        },
        {
          id: 3,
          title: "The Benefits of Respite Care",
          excerpt:
            "How respite care can support both caregivers and care recipients in maintaining a healthy balance.",
          date: "January 5, 2024",
          category: "Care Tips",
          readTime: "6 min read",
        },
        // Add more mock posts here
      ];

      setPosts(mockPosts);
      setTotalPages(Math.ceil(mockPosts.length / POSTS_PER_PAGE));
    } catch (error) {
      setError("Failed to fetch blog posts. Please try again later.");
      addToast({
        title: "Error",
        description: "Failed to load blog posts. Please refresh the page.",
        variant: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, index) => (
        <Card key={index} className="flex flex-col h-full">
          <CardHeader>
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-16 mb-4" />
            <Skeleton className="h-4 w-1/2" />
          </CardContent>
          <CardFooter className="mt-auto">
            <Skeleton className="h-4 w-24" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );

  const ErrorDisplay = () => (
    <div className="text-center py-12">
      <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
      <h3 className="text-xl font-semibold mb-2">Error Loading Posts</h3>
      <p className="text-gray-600 mb-4">{error}</p>
      <Button onClick={fetchPosts} variant="outline">
        Try Again
      </Button>
    </div>
  );

  const getCategoryColor = (category) => {
    const colors = {
      "Care Guide": "bg-blue-100 text-blue-800",
      Advice: "bg-green-100 text-green-800",
      "Care Tips": "bg-purple-100 text-purple-800",
      default: "bg-gray-100 text-gray-800",
    };
    return colors[category] || colors.default;
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Our Blog</h1>
        <p className="text-xl text-gray-600">
          Insights and resources for caregivers and families
        </p>
      </div>

      {isLoading ? (
        <LoadingSkeleton />
      ) : error ? (
        <ErrorDisplay />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Card
                key={post.id}
                className="flex flex-col h-full hover:shadow-lg transition-shadow duration-200"
              >
                <CardHeader>
                  <div className="flex justify-between items-start mb-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(
                        post.category
                      )}`}
                    >
                      {post.category}
                    </span>
                    <span className="text-sm text-gray-500">
                      {post.readTime}
                    </span>
                  </div>
                  <h2 className="text-xl font-semibold mb-2 hover:text-primary transition-colors">
                    <Link to={`/blog/${post.id}`}>{post.title}</Link>
                  </h2>
                  <p className="text-sm text-gray-500">{post.date}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{post.excerpt}</p>
                </CardContent>
                <CardFooter className="mt-auto">
                  <Link
                    to={`/blog/${post.id}`}
                    className="text-primary hover:text-primary/80 font-medium inline-flex items-center"
                  >
                    Read more
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-12 space-x-2">
              <Button
                variant="outline"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </Button>
              <div className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </div>
              <Button
                variant="outline"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BlogPage;
