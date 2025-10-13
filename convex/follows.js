import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Toggle follow/unfollow a user
export const toggleFollow = mutation({
  args: { followingId: v.id("users") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Must be logged in to follow users");
    }

    const follower = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("tokenIdentifier"), identity.tokenIdentifier))
      .unique();

    if (!follower) {
      throw new Error("User not found");
    }

    // Can't follow yourself
    if (follower._id === args.followingId) {
      throw new Error("You cannot follow yourself");
    }

    // Check if already following
    const existingFollow = await ctx.db
      .query("follows")
      .filter((q) =>
        q.and(
          q.eq(q.field("followerId"), follower._id),
          q.eq(q.field("followingId"), args.followingId)
        )
      )
      .unique();

    if (existingFollow) {
      // Unfollow
      await ctx.db.delete(existingFollow._id);
      return { following: false };
    } else {
      // Follow
      await ctx.db.insert("follows", {
        followerId: follower._id,
        followingId: args.followingId,
        createdAt: Date.now(),
      });
      return { following: true };
    }
  },
});

// Check if current user is following a specific user
export const isFollowing = query({
  args: { followingId: v.optional(v.id("users")) },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return false;
    }

    const follower = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("tokenIdentifier"), identity.tokenIdentifier))
      .unique();

    if (!follower) {
      return false;
    }

    const follow = await ctx.db
      .query("follows")
      .filter((q) =>
        q.and(
          q.eq(q.field("followerId"), follower._id),
          q.eq(q.field("followingId"), args.followingId)
        )
      )
      .unique();

    return !!follow;
  },
});

// Get follower count for a user
export const getFollowerCount = query({
  args: { userId: v.optional(v.id("users")) },
  handler: async (ctx, args) => {
    const follows = await ctx.db
      .query("follows")
      .filter((q) => q.eq(q.field("followingId"), args.userId))
      .collect();

    return follows.length;
  },
});

// Get followers of current user
export const getMyFollowers = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    const currentUser = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("tokenIdentifier"), identity.tokenIdentifier))
      .unique();

    if (!currentUser) {
      return [];
    }

    const limit = args.limit || 20;

    // Get followers
    const follows = await ctx.db
      .query("follows")
      .filter((q) => q.eq(q.field("followingId"), currentUser._id))
      .order("desc")
      .take(limit);

    // Get user details for each follower
    const followers = await Promise.all(
      follows.map(async (follow) => {
        const user = await ctx.db.get(follow.followerId);
        if (!user) return null;

        // Check if current user follows them back
        const followsBack = await ctx.db
          .query("follows")
          .filter((q) =>
            q.and(
              q.eq(q.field("followerId"), currentUser._id),
              q.eq(q.field("followingId"), user._id)
            )
          )
          .unique();

        // Get recent posts count
        const recentPosts = await ctx.db
          .query("posts")
          .filter((q) =>
            q.and(
              q.eq(q.field("authorId"), user._id),
              q.eq(q.field("status"), "published")
            )
          )
          .order("desc")
          .take(3);

        return {
          _id: user._id,
          name: user.name,
          username: user.username,
          imageUrl: user.imageUrl,
          followedAt: follow.createdAt,
          followsBack: !!followsBack,
          postCount: recentPosts.length,
          lastPostAt:
            recentPosts.length > 0 ? recentPosts[0].publishedAt : null,
        };
      })
    );

    return followers.filter((user) => user !== null);
  },
});

// Get users that current user is following (more detailed version)
export const getMyFollowing = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    const currentUser = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("tokenIdentifier"), identity.tokenIdentifier))
      .unique();

    if (!currentUser) {
      return [];
    }

    const limit = args.limit || 20;

    // Get following
    const follows = await ctx.db
      .query("follows")
      .filter((q) => q.eq(q.field("followerId"), currentUser._id))
      .order("desc")
      .take(limit);

    // Get user details for each following
    const following = await Promise.all(
      follows.map(async (follow) => {
        const user = await ctx.db.get(follow.followingId);
        if (!user) return null;

        // Get follower count
        const followerCount = await ctx.db
          .query("follows")
          .filter((q) => q.eq(q.field("followingId"), user._id))
          .collect();

        // Get recent posts
        const recentPosts = await ctx.db
          .query("posts")
          .filter((q) =>
            q.and(
              q.eq(q.field("authorId"), user._id),
              q.eq(q.field("status"), "published")
            )
          )
          .order("desc")
          .take(3);

        return {
          _id: user._id,
          name: user.name,
          username: user.username,
          imageUrl: user.imageUrl,
          followedAt: follow.createdAt,
          followerCount: followerCount.length,
          postCount: recentPosts.length,
          lastPostAt:
            recentPosts.length > 0 ? recentPosts[0].publishedAt : null,
          recentPosts: recentPosts.map((post) => ({
            _id: post._id,
            title: post.title,
            publishedAt: post.publishedAt,
            viewCount: post.viewCount,
            likeCount: post.likeCount,
          })),
        };
      })
    );

    return following.filter((user) => user !== null);
  },
});
