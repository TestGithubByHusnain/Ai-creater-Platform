import {
  Users,
  BarChart3,
  Mail,
  PenTool,
  Eye,
  Calendar,
  Shield,
  Target,
  TrendingUp,
  Settings,
  Search,
  ImageIcon,
} from "lucide-react";

export const features = [
  {
    icon: PenTool,
    title: "AI Writing Assistant",
    desc: "Get smart suggestions for titles, content, and SEO optimization",
    color: "from-purple-500 to-blue-500",
  },
  {
    icon: Users,
    title: "Community Building",
    desc: "Grow your audience with followers, comments, and engagement tools",
    color: "from-green-500 to-yellow-500",
  },
  {
    icon: BarChart3,
    title: "Analytics & Insights",
    desc: "Track performance with detailed view counts and engagement metrics",
    color: "from-yellow-500 to-orange-500",
  },
  {
    icon: Calendar,
    title: "Content Scheduling",
    desc: "Plan and schedule your content with real-time updates",
    color: "from-orange-500 to-red-500",
  },
  {
    icon: ImageIcon,
    title: "AI Image Transformations",
    desc: "Transform images with background removal, smart crop, and text overlays",
    color: "from-red-500 to-purple-500",
  },
  {
    icon: Search,
    title: "Content Discovery",
    desc: "Explore trending content and discover new creators in your feed",
    color: "from-emerald-500 to-green-500",
  },
];

export const socialProofStats = [
  { metric: "50K+", label: "Active Creators", icon: Users },
  { metric: "2M+", label: "Published Posts", icon: PenTool },
  { metric: "10M+", label: "Monthly Readers", icon: Eye },
  { metric: "99.9%", label: "Uptime", icon: Shield },
];

export const testimonials = [
  {
    name: "Sarah Chen",
    role: "Tech Blogger",
    company: "@TechInsights",
    imageId: "1580489944761-15a19d654956",
    content:
      "Creatr transformed how I create content. The AI writing assistant saves me hours every week.",
    rating: 5,
  },
  {
    name: "Marcus Johnson",
    role: "Newsletter Creator",
    company: "@MarketingWeekly",
    imageId: "1507003211169-0a1dd7228f2d",
    content:
      "The email newsletter features are incredible. My subscriber growth increased by 300% in just 3 months.",
    rating: 5,
  },
  {
    name: "Elena Rodriguez",
    role: "Content Strategist",
    company: "@CreativeSpace",
    imageId: "1544005313-94ddf0286df2",
    content:
      "Best investment I've made for my content business. The analytics help me understand what my audience loves.",
    rating: 5,
  },
];

export const platformTabs = [
  {
    title: "Content Creation",
    icon: PenTool,
    description:
      "AI-powered writing tools that help you create engaging content faster than ever before.",
    features: [
      "Smart title suggestions",
      "Content optimization",
      "SEO recommendations",
      "Plagiarism detection",
    ],
  },
  {
    title: "Audience Growth",
    icon: TrendingUp,
    description:
      "Build and engage your community with powerful audience management tools.",
    features: [
      "Follower analytics",
      "Engagement tracking",
      "Community insights",
      "Growth recommendations",
    ],
  },
  {
    title: "Content Management",
    icon: Settings,
    description:
      "Organize and manage your content with comprehensive tools and analytics.",
    features: [
      "Draft system",
      "Post scheduling",
      "Content analytics",
      "Media management",
    ],
  },
];