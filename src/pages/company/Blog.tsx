import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { Calendar, Clock, ArrowRight, Tag } from "lucide-react";
import { Link } from "react-router-dom";

const featuredPost = {
  title: "The Future of Enterprise AI: 5 Trends Shaping 2025",
  excerpt: "From agentic workflows to multimodal AI, discover the key trends that will define enterprise automation in the coming year.",
  image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop",
  author: "Sophie Dubois",
  authorRole: "CTO",
  date: "December 20, 2024",
  readTime: "8 min read",
  category: "Industry Insights"
};

const posts = [
  {
    title: "How AETHER Reduced Document Processing Time by 85% for a Fortune 500 Bank",
    excerpt: "A deep dive into our implementation of intelligent document automation for financial services.",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=250&fit=crop",
    author: "Pierre Moreau",
    date: "December 15, 2024",
    readTime: "6 min read",
    category: "Case Study"
  },
  {
    title: "Building Reliable AI Agents: Lessons from Production",
    excerpt: "What we've learned deploying AI agents at scale for enterprise customers.",
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=400&h=250&fit=crop",
    author: "Thomas Bernard",
    date: "December 10, 2024",
    readTime: "10 min read",
    category: "Engineering"
  },
  {
    title: "The ROI of AI Automation: A Framework for Enterprise Leaders",
    excerpt: "How to measure and maximize the return on your AI automation investments.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop",
    author: "Marie Laurent",
    date: "December 5, 2024",
    readTime: "7 min read",
    category: "Business"
  },
  {
    title: "Introducing AETHER Brain: Your AI-Powered Knowledge Base",
    excerpt: "Announcing our new tool that transforms documents into an intelligent, searchable knowledge base.",
    image: "https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?w=400&h=250&fit=crop",
    author: "Alexandre Martin",
    date: "November 28, 2024",
    readTime: "5 min read",
    category: "Product"
  },
  {
    title: "Compliance in the Age of AI: What You Need to Know",
    excerpt: "Navigating regulatory requirements when implementing AI automation in your organization.",
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&h=250&fit=crop",
    author: "Camille Petit",
    date: "November 20, 2024",
    readTime: "9 min read",
    category: "Compliance"
  },
  {
    title: "From Manual to Magical: Automating HR Workflows with AI",
    excerpt: "How modern HR teams are using AI to streamline recruiting, onboarding, and employee management.",
    image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=400&h=250&fit=crop",
    author: "Sophie Dubois",
    date: "November 15, 2024",
    readTime: "6 min read",
    category: "HR"
  }
];

const categories = ["All", "Product", "Engineering", "Case Study", "Business", "Industry Insights", "Compliance", "HR"];

export default function Blog() {
  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />
      
      <main className="pt-20">
        {/* Hero */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              AETHER{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Blog
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Insights on AI, automation, and the future of enterprise software.
            </p>
          </div>
        </section>

        {/* Categories */}
        <section className="px-4 pb-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((category, index) => (
                <button
                  key={category}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    index === 0 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Post */}
        <section className="py-8 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="rounded-2xl overflow-hidden border border-border bg-card hover:shadow-xl transition-shadow cursor-pointer group">
              <div className="grid md:grid-cols-2">
                <div className="aspect-video md:aspect-auto">
                  <img 
                    src={featuredPost.image} 
                    alt={featuredPost.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-8 flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                      {featuredPost.category}
                    </span>
                    <span className="text-muted-foreground text-sm">Featured</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors">
                    {featuredPost.title}
                  </h2>
                  <p className="text-muted-foreground mb-6">{featuredPost.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-sm">
                        <div className="font-medium text-foreground">{featuredPost.author}</div>
                        <div className="text-muted-foreground">{featuredPost.authorRole}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {featuredPost.date}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {featuredPost.readTime}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* All Posts */}
        <section className="py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-foreground mb-8">Latest Articles</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <article 
                  key={post.title} 
                  className="rounded-xl overflow-hidden border border-border bg-card hover:shadow-lg transition-shadow cursor-pointer group"
                >
                  <div className="aspect-video overflow-hidden">
                    <img 
                      src={post.image} 
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Tag className="w-3 h-3 text-primary" />
                      <span className="text-xs font-medium text-primary">{post.category}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{post.excerpt}</p>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{post.author}</span>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {post.readTime}
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">Subscribe to our newsletter</h2>
            <p className="text-muted-foreground mb-6">
              Get the latest insights on AI and automation delivered to your inbox.
            </p>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-lg border border-border bg-background text-foreground"
              />
              <button className="px-6 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
