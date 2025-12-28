import { ArrowRight, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

const blogPreviews = [
  {
    title: "The 30% Problem: Where Your Team's Time Actually Goes",
    excerpt: "We looked at the research. The amount of time knowledge workers spend on automatable tasks is honestly surprising.",
    category: "Industry",
  },
  {
    title: "What Actually Happens When You Talk to an AI",
    excerpt: "The milliseconds between your question and the response involve some fascinating tech.",
    category: "Innovation",
  },
  {
    title: "From Shanghai Cafés to Enterprise AI",
    excerpt: "Two emlyon students turned a casual chat into a global AI platform. Here's our story.",
    category: "Company",
  },
];

export function BlogSection() {
  return (
    <section className="py-16 md:py-24 px-4 bg-gradient-to-b from-background via-muted/30 to-background">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10 md:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary mb-4">
            <BookOpen className="w-4 h-4" />
            <span className="text-sm font-medium">From Our Blog</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
            Insights on{" "}
            <span className="bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent">
              Enterprise AI
            </span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm md:text-base">
            Real perspectives on automation, technology trends, and building AETHER. 
            No jargon, just honest takes.
          </p>
        </div>

        {/* Blog Cards */}
        <div className="grid md:grid-cols-3 gap-4 md:gap-6 mb-10">
          {blogPreviews.map((post, index) => (
            <Link 
              key={index}
              to="/blog"
              className="group p-5 md:p-6 rounded-2xl border border-border bg-card hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
            >
              <span className="inline-block px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary mb-3">
                {post.category}
              </span>
              <h3 className="text-base md:text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                {post.title}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {post.excerpt}
              </p>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link 
            to="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:scale-[1.02] group"
          >
            <span>Explore the Blog</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}