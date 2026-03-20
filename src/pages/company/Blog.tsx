import { Clock, User, ArrowRight, ChevronUp, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

const posts = [
  {
    id: "why-enterprises-waste-time",
    title: "The 30% Problem: Where Your Team's Time Actually Goes",
    excerpt: "We looked at the research. The amount of time knowledge workers spend on automatable tasks is honestly surprising.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=300&fit=crop",
    author: "AETHER Team",
    date: "December 18, 2025",
    readTime: "5 min read",
    category: "Industry",
    fullContent: `McKinsey found that knowledge workers spend about 30% of their time on repetitive tasks that could be automated. That's 12 hours a week, per person.

Where does all that time go?

The breakdown is pretty telling:
→ Moving data between systems: 8%
→ Hunting for information across tools: 7%  
→ Building and formatting reports: 6%
→ Sorting through emails: 5%
→ Coordinating meetings and schedules: 4%

For a 100-person company with average salaries around €60k, that adds up to €1.8 million yearly on work that doesn't move the needle.

So why isn't everyone automating?

Turns out, it's complicated. Deloitte found only 13% of companies have actually scaled automation beyond pilot projects.

The blockers people mention most:
→ Legacy systems are a nightmare to integrate (67%)
→ Nobody on the team knows how to do it (54%)
→ Hard to prove ROI to get budget (48%)

What's different now?

AI has gotten good enough to handle tasks that need judgment, not just simple if-then rules. That 30% isn't inevitable anymore. The companies figuring this out first will have a real edge.`
  },
  {
    id: "ai-voice-agents",
    title: "What Actually Happens When You Talk to an AI",
    excerpt: "The milliseconds between your question and the response involve some fascinating tech. Here's a plain-language breakdown.",
    image: "https://images.unsplash.com/photo-1590650153855-d9e808231d41?w=600&h=300&fit=crop",
    author: "AETHER Team",
    date: "December 15, 2025",
    readTime: "6 min read",
    category: "Innovation",
    fullContent: `Voice AI has gotten remarkably good, but most people have no idea what happens under the hood. Let's break it down.

The journey from your voice to a response:

1. Capturing audio (0-50ms)
Your voice becomes a digital waveform. Modern systems sample at 16kHz or higher to catch all the details.

2. Turning sound into text (50-200ms)
Speech recognition models convert those sound waves into words. Accuracy is now above 95% in most situations.

3. Understanding what you meant (100-300ms)
The system figures out your intent, pulls out relevant details, and considers what you said before.

4. Generating a response (200-500ms)
Based on what it understood, the system might query databases, call APIs, or generate text with a language model.

5. Making it sound human (100-200ms)
Text-to-speech turns the response into natural-sounding audio.

Why timing matters so much

Natural conversation has pauses of 200-500ms. For AI to feel conversational, total latency needs to stay under a second.`
  },
  {
    id: "enterprise-ai-trends-2025",
    title: "5 Enterprise AI Trends Worth Paying Attention To",
    excerpt: "From AI agents going live to governance spending exploding, here's what the data shows about where things are heading.",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=300&fit=crop",
    author: "AETHER Team",
    date: "December 10, 2025",
    readTime: "7 min read",
    category: "Industry",
    fullContent: `Things are moving fast in enterprise AI. Here are five trends that actually have data behind them.

1. AI agents are leaving the lab
Gartner predicts 33% of enterprise software will include agentic AI by 2028.

2. Multimodal is now the default
IDC says 67% of new enterprise AI projects last year were multimodal.

3. Governance is suddenly a priority
Spending on AI governance tools jumped 340% in 2024.

4. ROI measurement is getting serious
Companies with mature measurement frameworks see 2.5x better returns.

5. Humans + AI beats either alone
Human-AI teams outperform either alone by 30% on complex work.`
  },
  {
    id: "document-processing-evolution",
    title: "From Basic OCR to AI That Actually Understands Documents",
    excerpt: "Document processing has come a long way. Here's the evolution from simple text extraction to genuine comprehension.",
    image: "https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=600&h=300&fit=crop",
    author: "AETHER Team",
    date: "December 8, 2025",
    readTime: "5 min read",
    category: "Innovation",
    fullContent: `Document processing has evolved through distinct generations.

Generation 1: OCR (1990s-2000s). Accuracy hovered around 85-90%.
Generation 2: Template-based (2010s). Every new document type needed a new template.
Generation 3: Machine learning (2018-2022). Accuracy jumped above 95%.
Generation 4: LLM-powered (2023+). Now document processing can understand relationships, handle unseen types, and spot anomalies.

The real-world difference: traditional invoice processing takes 15-30 minutes. AI-powered: 2-5 minutes. That's 80% less time.`
  },
  {
    id: "shanghai-startup-ecosystem",
    title: "What Building a Startup in Shanghai Taught Us",
    excerpt: "From Putuo co-working spaces to Jing'an tech meetups, lessons from launching AETHER in one of the world's most dynamic cities.",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=300&fit=crop",
    author: "AETHER Team",
    date: "December 5, 2025",
    readTime: "6 min read",
    category: "Company",
    fullContent: `Shanghai didn't just happen to be where AETHER started, it shaped how we think about building products.

The pace is real. Companies ship in weeks what would take months elsewhere. Our first prototype took 6 weeks, built from a small Putuo apartment.

The scene is surprisingly global. Shanghai's tech community is incredibly international. Meetups in Jing'an draw founders and engineers from everywhere.

AETHER doesn't feel like typical enterprise software because we didn't build it like that. Ship fast, iterate faster, global from day one.`
  }
];

const categories = ["All", "Company", "Innovation", "Industry"];

export default function Blog() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [expandedPost, setExpandedPost] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);

  const handleSubscribe = async () => {
    if (!email || !email.includes("@")) {
      toast({ title: "Invalid email", description: "Please enter a valid email address.", variant: "destructive" });
      return;
    }
    setIsSubscribing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubscribing(false);
    setIsSubscribed(true);
    setEmail("");
    toast({ title: "Subscribed!", description: "You'll receive our latest updates in your inbox." });
  };

  const filteredPosts = selectedCategory === "All" ? posts : posts.filter(p => p.category === selectedCategory);

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="pt-16 pb-10 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs font-medium tracking-[0.2em] uppercase text-muted-foreground mb-5">Insights & Updates</p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground tracking-tight leading-[1.08]">The AETHER Blog</h1>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Enterprise AI insights, product updates, and the future of intelligent automation.
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-4 px-4 sm:px-6 border-b border-border">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-2 justify-center flex-wrap">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all active:scale-[0.97] ${
                  selectedCategory === category
                    ? "bg-foreground text-background"
                    : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-12 sm:py-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {filteredPosts.map((post) => (
            <article 
              key={post.id}
              className="rounded-2xl overflow-hidden border border-border bg-card transition-all duration-300 hover:shadow-lg hover:shadow-foreground/[0.03] hover:border-foreground/10"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
                <div className="relative aspect-video md:aspect-auto overflow-hidden">
                  <img src={post.image} alt={post.title} className="absolute inset-0 w-full h-full object-cover" />
                </div>
                <div className="md:col-span-2 p-5 sm:p-7">
                  <p className="text-xs font-medium tracking-[0.15em] uppercase text-muted-foreground mb-2">{post.category}</p>
                  <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2 leading-snug">{post.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{post.excerpt}</p>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground/70">
                      <div className="flex items-center gap-1.5"><User className="w-3 h-3" /><span>{post.author}</span></div>
                      <span className="hidden sm:inline">{post.date}</span>
                      <div className="flex items-center gap-1.5"><Clock className="w-3 h-3" /><span>{post.readTime}</span></div>
                    </div>
                    <button 
                      onClick={() => setExpandedPost(expandedPost === post.id ? null : post.id)}
                      className="flex items-center gap-1.5 text-foreground font-medium text-sm hover:gap-2.5 transition-all active:scale-[0.97]"
                    >
                      {expandedPost === post.id ? "Close" : "Read"}
                      {expandedPost === post.id ? <ChevronUp className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  {expandedPost === post.id && (
                    <div className="mt-5 pt-5 border-t border-border">
                      {post.fullContent.split('\n\n').map((paragraph, i) => (
                        <p key={i} className="text-sm text-muted-foreground mb-3 leading-relaxed">{paragraph}</p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 bg-secondary/40">
        <div className="max-w-lg mx-auto text-center">
          <p className="text-xs font-medium tracking-[0.2em] uppercase text-muted-foreground mb-4">Stay Updated</p>
          <h2 className="text-2xl sm:text-3xl font-semibold text-foreground tracking-tight mb-3">Get insights delivered</h2>
          <p className="text-sm text-muted-foreground mb-6">Enterprise AI trends, product updates, and industry analysis. No spam.</p>
          {isSubscribed ? (
            <p className="text-sm font-medium text-foreground">Thanks for subscribing! ✓</p>
          ) : (
            <div className="flex flex-col sm:flex-row gap-3 max-w-sm mx-auto">
              <input 
                type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com" disabled={isSubscribing}
                className="flex-1 px-4 py-2.5 text-sm rounded-full border border-border bg-background text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-foreground/10"
              />
              <button onClick={handleSubscribe} disabled={isSubscribing}
                className="px-6 py-2.5 text-sm font-medium text-background bg-foreground rounded-full hover:bg-foreground/90 transition-all active:scale-[0.97] disabled:opacity-50">
                {isSubscribing ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Subscribe"}
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
