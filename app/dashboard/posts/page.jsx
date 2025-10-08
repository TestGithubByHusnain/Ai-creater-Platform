"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusCircle, Search, Filter, FileText } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { useConvexQuery, useConvexMutation } from "@/hooks/use-convex-query";
import { toast } from "sonner";
import Link from "next/link";
import PostCard from "@/components/post-card";

export default function PostsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  // Data fetching
  const { data: posts, isLoading } = useConvexQuery(api.posts.getUserPosts);
  const deletePost = useConvexMutation(api.posts.deletePost);

  // Filter and sort posts
  const filteredPosts = React.useMemo(() => {
    if (!posts) return [];

    let filtered = posts.filter((post) => {
      // Search filter
      const matchesSearch = post.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      // Status filter
      const matchesStatus =
        statusFilter === "all" || post.status === statusFilter;

      return matchesSearch && matchesStatus;
    });

    // Sort posts
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return b.createdAt - a.createdAt;
        case "oldest":
          return a.createdAt - b.createdAt;
        case "mostViews":
          return b.viewCount - a.viewCount;
        case "mostLikes":
          return b.likeCount - a.likeCount;
        case "alphabetical":
          return a.title.localeCompare(b.title);
        default:
          return b.createdAt - a.createdAt;
      }
    });

    return filtered;
  }, [posts, searchQuery, statusFilter, sortBy]);

  // Handle post actions
  const handleEditPost = (post) => {
    router.push(`/dashboard/posts/edit/${post._id}`);
  };

  const handleDeletePost = async (post) => {
    if (!window.confirm("Are you sure you want to delete this post?")) {
      return;
    }

    try {
      await deletePost.mutate({ id: post._id });
      toast.success("Post deleted successfully");
    } catch (error) {
      toast.error("Failed to delete post");
    }
  };

  const handleDuplicatePost = (post) => {
    // TODO: Implement post duplication
    toast.info("Duplication feature coming soon!");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400 mx-auto"></div>
          <p className="text-slate-400 mt-4">Loading your posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 lg:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold gradient-text-primary">My Posts</h1>
          <p className="text-slate-400 mt-2">
            Manage and track your content performance
          </p>
        </div>

        <Link href="/dashboard/create">
          <Button variant="primary">
            <PlusCircle className="h-4 w-4 mr-2" />
            Create New Post
          </Button>
        </Link>
      </div>

      {/* Filters and Search */}
      <Card className="card-glass">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-slate-800 border-slate-600"
              />
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-40 bg-slate-800 border-slate-600">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-40 bg-slate-800 border-slate-600">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="mostViews">Most Views</SelectItem>
                <SelectItem value="mostLikes">Most Likes</SelectItem>
                <SelectItem value="alphabetical">A-Z</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Posts Grid */}
      {filteredPosts.length === 0 ? (
        <Card className="card-glass">
          <CardContent className="p-12 text-center">
            <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">
              {searchQuery || statusFilter !== "all"
                ? "No posts found"
                : "No posts yet"}
            </h3>
            <p className="text-slate-400 mb-6">
              {searchQuery || statusFilter !== "all"
                ? "Try adjusting your search or filters"
                : "Create your first post to get started"}
            </p>
            {!searchQuery && statusFilter === "all" && (
              <Link href="/dashboard/create">
                <Button variant="primary">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Create Your First Post
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              showActions={true}
              showAuthor={false}
              onEdit={handleEditPost}
              onDelete={handleDeletePost}
              onDuplicate={handleDuplicatePost}
            />
          ))}
        </div>
      )}
    </div>
  );
}