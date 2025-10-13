import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Toggle like on a post
export const toggleLike = mutation({
  args: {
    postId: v.id("posts"),
    userId: v.optional(v.id("users")), // Optional for anonymous likes
  },
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.postId);

    if (!post || post.status !== "published") {
      throw new Error("Post not found or not published");
    }

    let userId = args.userId;

    // If no userId provided, try to get from auth
    if (!userId) {
      const identity = await ctx.auth.getUserIdentity();
      if (identity) {
        const user = await ctx.db
          .query("users")
          .filter((q) =>
            q.eq(q.field("tokenIdentifier"), identity.tokenIdentifier)
          )
          .unique();
        userId = user?._id;
      }
    }

    // Check if already liked
    let existingLike;
    if (userId) {
      existingLike = await ctx.db
        .query("likes")
        .filter((q) =>
          q.and(
            q.eq(q.field("postId"), args.postId),
            q.eq(q.field("userId"), userId)
          )
        )
        .unique();
    }

    if (existingLike) {
      // Unlike - remove the like
      await ctx.db.delete(existingLike._id);

      // Decrement like count
      await ctx.db.patch(args.postId, {
        likeCount: Math.max(0, post.likeCount - 1),
      });

      return { liked: false, likeCount: Math.max(0, post.likeCount - 1) };
    } else {
      // Like - add the like
      await ctx.db.insert("likes", {
        postId: args.postId,
        userId: userId,
        createdAt: Date.now(),
      });

      // Increment like count
      await ctx.db.patch(args.postId, {
        likeCount: post.likeCount + 1,
      });

      return { liked: true, likeCount: post.likeCount + 1 };
    }
  },
});

// Check if user has liked a post
export const hasUserLiked = query({
  args: {
    postId: v.id("posts"),
    userId: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    let userId = args.userId;

    // If no userId provided, try to get from auth
    if (!userId) {
      const identity = await ctx.auth.getUserIdentity();
      if (!identity) {
        return false;
      }

      const user = await ctx.db
        .query("users")
        .filter((q) =>
          q.eq(q.field("tokenIdentifier"), identity.tokenIdentifier)
        )
        .unique();

      if (!user) {
        return false;
      }

      userId = user._id;
    }

    const like = await ctx.db
      .query("likes")
      .filter((q) =>
        q.and(
          q.eq(q.field("postId"), args.postId),
          q.eq(q.field("userId"), userId)
        )
      )
      .unique();

    return !!like;
  },
});