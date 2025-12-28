import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { Calendar, Clock, User, ArrowRight, Tag, TrendingUp, Sparkles, GraduationCap, Globe, Zap, Brain, Workflow, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const featuredPost = {
  id: "founders-story",
  title: "From Shanghai Cafés to Enterprise AI: The AETHER Story",
  excerpt: "Two emlyon students turned a casual chat in Shanghai into a global AI platform. Here's how Youriy and Maxime started building AETHER.",
  image: "https://images.unsplash.com/photo-1474181487882-5abf3f0ba6c2?w=800&h=400&fit=crop",
  author: "AETHER Team",
  date: "December 20, 2025",
  readTime: "8 min read",
  category: "Company",
  featured: true,
  fullContent: `It started in spring 2025, somewhere in the busy streets of Shanghai.

Youriy and Maxime had never crossed paths before landing in China. Both were second-year students at emlyon, there for an exchange program that would end up changing everything.

"We met at a welcome dinner," Youriy remembers. "I was venting about my last internship—hours wasted on repetitive data entry. Maxime just looked at me and said, 'What if we could get AI to handle all that?'"

That one question stuck. Over the next few weeks, they kept meeting at coffee shops around Putuo, scribbling ideas on napkins and laptops.

**Shanghai felt like the right place for this.**

"There's this energy here," Maxime explains. "You walk around and everyone seems to be building something. We figured—why not us?"

While their classmates hit the tourist spots, they spent weekends in co-working spaces, digging into machine learning, enterprise software, and automation. The first prototype came together in a small Putuo apartment, fueled by baozi, endless tea, and the Shanghai skyline outside their window.

**No big funding story. Just conviction.**

"We don't have investors lining up," Youriy admits. "But we've seen how much time companies waste on stuff AI could do in seconds. That's the gap we're going after."

The AETHER journey is still early. There's a lot planned for 2025—new capabilities, new features. But the mission stays simple: make enterprise AI something any business can actually use, not just the giants with massive budgets.`
};

const posts = [
  {
    id: "why-enterprises-waste-time",
    title: "The 30% Problem: Where Your Team's Time Actually Goes",
    excerpt: "We looked at the research. The amount of time knowledge workers spend on automatable tasks is honestly surprising.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=300&fit=crop",
    author: "Maxime Maître",
    date: "December 18, 2025",
    readTime: "5 min read",
    category: "Industry",
    icon: TrendingUp,
    fullContent: `McKinsey found that knowledge workers spend about 30% of their time on repetitive tasks that could be automated. That's 12 hours a week, per person.

**Where does all that time go?**

The breakdown is pretty telling:
• Moving data between systems: 8%
• Hunting for information across tools: 7%  
• Building and formatting reports: 6%
• Sorting through emails: 5%
• Coordinating meetings and schedules: 4%

For a 100-person company with average salaries around €60k, that adds up to €1.8 million yearly on work that doesn't move the needle.

**So why isn't everyone automating?**

Turns out, it's complicated. Deloitte found only 13% of companies have actually scaled automation beyond pilot projects.

The blockers people mention most:
• Legacy systems are a nightmare to integrate (67%)
• Nobody on the team knows how to do it (54%)
• Hard to prove ROI to get budget (48%)

**What's different now?**

AI has gotten good enough to handle tasks that need judgment—not just simple if-then rules. That 30% isn't inevitable anymore. The companies figuring this out first will have a real edge.`
  },
  {
    id: "ai-voice-agents",
    title: "What Actually Happens When You Talk to an AI",
    excerpt: "The milliseconds between your question and the response involve some fascinating tech. Here's a plain-language breakdown.",
    image: "https://images.unsplash.com/photo-1590650153855-d9e808231d41?w=600&h=300&fit=crop",
    author: "Youriy Strashnyi",
    date: "December 15, 2025",
    readTime: "6 min read",
    category: "Innovation",
    icon: Brain,
    fullContent: `Voice AI has gotten remarkably good, but most people have no idea what happens under the hood. Let's break it down.

**The journey from your voice to a response:**

1. **Capturing audio (0-50ms)**
Your voice becomes a digital waveform. Modern systems sample at 16kHz or higher to catch all the details.

2. **Turning sound into text (50-200ms)**
Speech recognition models—often transformer-based like Whisper—convert those sound waves into words. Accuracy is now above 95% in most situations.

3. **Understanding what you meant (100-300ms)**
This is where it gets interesting. The system figures out your intent, pulls out relevant details (names, dates, numbers), and considers what you said before.

4. **Generating a response (200-500ms)**
Based on what it understood, the system might query databases, call APIs, or generate text with a language model.

5. **Making it sound human (100-200ms)**
Text-to-speech turns the response into natural-sounding audio. The best neural TTS is nearly indistinguishable from a real person.

**Why timing matters so much**

Natural conversation has pauses of 200-500ms. For AI to feel conversational, total latency needs to stay under a second. The big breakthrough recently has been running these steps in parallel rather than one after another.

**What this means for businesses**

This isn't just chatbot stuff. Think automated phone systems that actually get what you're saying, meeting transcription that pulls out action items, or voice-controlled data queries.`
  },
  {
    id: "enterprise-ai-trends-2025",
    title: "5 Enterprise AI Trends Worth Paying Attention To",
    excerpt: "From AI agents going live to governance spending exploding—here's what the data shows about where things are heading.",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=300&fit=crop",
    author: "Maxime Maître",
    date: "December 10, 2025",
    readTime: "7 min read",
    category: "Industry",
    icon: Globe,
    fullContent: `Things are moving fast in enterprise AI. Here are five trends that actually have data behind them.

**1. AI agents are leaving the lab**

Gartner predicts 33% of enterprise software will include agentic AI by 2028. These aren't chatbots—they execute multi-step tasks on their own.

Right now: 8% of companies have agents in production
By end of 2025: expected to hit 23%

**2. Multimodal is now the default**

Text, image, voice—the boundaries are blurring. IDC says 67% of new enterprise AI projects last year were multimodal.

Document processing now combines OCR, layout analysis, image recognition, and language understanding all at once.

**3. Governance is suddenly a priority**

Spending on AI governance tools jumped 340% in 2024, according to Forrester. Turns out, deploying AI without controls creates real risk.

Companies are now requiring audit trails, explainability, bias detection, and data lineage tracking.

**4. ROI measurement is getting serious**

Early AI projects focused on cost savings. Now the metrics are broader: time-to-value for new hires, customer satisfaction, employee experience, revenue acceleration.

McKinsey found that companies with mature measurement frameworks see 2.5x better returns.

**5. Humans + AI beats either alone**

The most successful deployments augment people rather than replace them. Accenture's research shows human-AI teams outperform either alone by 30% on complex work.

The pattern that works: AI handles volume and speed, humans bring judgment and creativity.`
  },
  {
    id: "document-processing-evolution",
    title: "From Basic OCR to AI That Actually Understands Documents",
    excerpt: "Document processing has come a long way. Here's the evolution from simple text extraction to genuine comprehension.",
    image: "https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=600&h=300&fit=crop",
    author: "Youriy Strashnyi",
    date: "December 8, 2025",
    readTime: "5 min read",
    category: "Innovation",
    icon: Zap,
    fullContent: `Document processing has evolved through distinct generations. Each one changed what was possible.

**Generation 1: OCR (1990s-2000s)**

Optical Character Recognition could turn scanned documents into text. That was it. No understanding of structure, context, or meaning.

Accuracy hovered around 85-90%. Sounds okay until you realize that's 1-2 errors per line.

**Generation 2: Template-based (2010s)**

You could define where the invoice number goes, where the total is, and the system would extract those fields.

The catch: every new document type needed a new template. Template maintenance became someone's entire job.

**Generation 3: Machine learning (2018-2022)**

Systems started learning from examples. Show it 100 invoices, and it figures out how to extract from new ones.

Accuracy jumped above 95%, but the systems still didn't understand what they were pulling out.

**Generation 4: LLM-powered (2023+)**

Large language models changed the game completely. Now document processing can:

• Understand how fields relate to each other
• Handle document types it's never seen before
• Answer questions about content
• Summarize and find insights, not just data
• Spot anomalies and inconsistencies

**The real-world difference**

Traditional invoice processing: receive, manually enter or template-extract, validate, route for approval, process payment. 15-30 minutes per invoice.

AI-powered: receive, automatic extraction and validation, human review only for exceptions. 2-5 minutes total.

That's 80% less time—and almost no data entry errors.`
  },
  {
    id: "shanghai-startup-ecosystem",
    title: "What Building a Startup in Shanghai Taught Us",
    excerpt: "From Putuo co-working spaces to Jing'an tech meetups—lessons from launching AETHER in one of the world's most dynamic cities.",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=300&fit=crop",
    author: "AETHER Team",
    date: "December 5, 2025",
    readTime: "6 min read",
    category: "Company",
    icon: Sparkles,
    fullContent: `Shanghai didn't just happen to be where AETHER started—it shaped how we think about building products.

**The pace is real**

Walking through Lujiazui or Zhangjiang, you feel it. Companies ship in weeks what would take months elsewhere.

That rubbed off on us. Our first prototype took 6 weeks, built from a small Putuo apartment. Anything slower felt wrong.

**The scene is surprisingly global**

One thing we didn't expect: Shanghai's tech community is incredibly international. Meetups in Jing'an draw founders and engineers from everywhere. WeChat groups connect French entrepreneurs, American engineers, Chinese investors.

We found advisors, early users, and ideas in this mix. AETHER's global perspective—building for businesses everywhere, not just one market—came directly from being here.

**No money forces creativity**

We started with almost nothing. In Shanghai, that's normal. Many successful startups here bootstrapped longer than their Silicon Valley counterparts.

This meant:
• Ruthless focus on what actually matters
• Building MVPs that work, not just demos
• Finding creative solutions instead of buying our way out

**A different mindset**

AETHER doesn't feel like typical enterprise software because we didn't build it like that. We built it like a Shanghai startup:

• Ship fast, iterate faster
• Global from day one
• Efficient by necessity
• Always hungry

The Shanghai chapter is just our beginning. But it defined who we are.`
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
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubscribing(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubscribing(false);
    setIsSubscribed(true);
    setEmail("");
    toast({
      title: "Subscribed!",
      description: "You'll receive our latest updates in your inbox.",
    });
  };

  const filteredPosts = selectedCategory === "All" 
    ? posts 
    : posts.filter(post => post.category === selectedCategory);

  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />
      
      <main className="pt-20">
        {/* Hero */}
        <section className="py-10 md:py-16 px-4 bg-gradient-to-br from-primary/5 via-background to-violet-500/5">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 md:mb-6">
              The AETHER{" "}
              <span className="bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent">
                Blog
              </span>
            </h1>
            <p className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto px-2">
              Insights on enterprise AI, product updates, and the future of automation.
            </p>
          </div>
        </section>

        {/* Category Filter */}
        <section className="py-4 md:py-8 px-4 border-b border-border overflow-x-auto">
          <div className="max-w-6xl mx-auto">
            <div className="flex gap-2 justify-start md:justify-center min-w-max md:min-w-0 pb-2 md:pb-0">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-medium transition-all whitespace-nowrap ${
                    selectedCategory === category
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
        {(selectedCategory === "All" || selectedCategory === "Company") && (
          <section className="py-16 px-4">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center gap-2 mb-6">
                <Sparkles className="w-5 h-5 text-primary" />
                <span className="text-primary font-semibold">Featured Story</span>
              </div>
              <div className="rounded-2xl overflow-hidden border border-border bg-card">
                <div className="grid md:grid-cols-2">
                  <div className="relative aspect-[4/3] md:aspect-auto">
                    <img 
                      src={featuredPost.image}
                      alt={featuredPost.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent md:bg-gradient-to-r" />
                    <div className="absolute bottom-4 left-4 md:hidden">
                      <span className="px-3 py-1 rounded-full bg-primary/90 text-primary-foreground text-xs font-medium">
                        {featuredPost.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-8 md:p-12 flex flex-col justify-center">
                    <div className="hidden md:block mb-4">
                      <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                        {featuredPost.category}
                      </span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                      {featuredPost.title}
                    </h2>
                    <p className="text-muted-foreground mb-6">{featuredPost.excerpt}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="w-4 h-4" />
                        <span>{featuredPost.author}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{featuredPost.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{featuredPost.readTime}</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => setExpandedPost(expandedPost === featuredPost.id ? null : featuredPost.id)}
                      className="flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all"
                    >
                      {expandedPost === featuredPost.id ? "Read less" : "Read full story"} 
                      {expandedPost === featuredPost.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                
                {/* Expanded Content */}
                {expandedPost === featuredPost.id && (
                  <div className="px-8 md:px-12 pb-12 border-t border-border mt-4 pt-8">
                    <div className="prose prose-lg dark:prose-invert max-w-none">
                      {featuredPost.fullContent.split('\n\n').map((paragraph, i) => (
                        <p key={i} className="text-muted-foreground mb-4">{paragraph}</p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Blog Grid */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-foreground mb-8">Latest Articles</h2>
            <div className="space-y-8">
              {filteredPosts.map((post) => (
                <article 
                  key={post.id}
                  className="rounded-xl overflow-hidden border border-border bg-card"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
                    <div className="relative aspect-video md:aspect-auto overflow-hidden">
                      <img 
                        src={post.image}
                        alt={post.title}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <div className="absolute top-3 left-3 md:top-4 md:left-4">
                        <span className="px-2 md:px-3 py-1 rounded-full bg-black/60 backdrop-blur-sm text-white text-xs font-medium">
                          {post.category}
                        </span>
                      </div>
                    </div>
                    <div className="md:col-span-2 p-4 md:p-6 lg:p-8">
                      <div className="flex items-center gap-2 mb-2 md:mb-3">
                        <post.icon className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary" />
                        <span className="text-xs font-medium text-primary uppercase tracking-wide">{post.category}</span>
                      </div>
                      <h3 className="text-lg md:text-xl font-bold text-foreground mb-2 md:mb-3">
                        {post.title}
                      </h3>
                      <p className="text-sm md:text-base text-muted-foreground mb-3 md:mb-4 line-clamp-2 md:line-clamp-none">{post.excerpt}</p>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex flex-wrap items-center gap-2 md:gap-4 text-xs md:text-sm text-muted-foreground">
                          <div className="flex items-center gap-1.5">
                            <User className="w-3 h-3" />
                            <span>{post.author}</span>
                          </div>
                          <span className="hidden sm:inline">{post.date}</span>
                          <span>{post.readTime}</span>
                        </div>
                        <button 
                          onClick={() => setExpandedPost(expandedPost === post.id ? null : post.id)}
                          className="flex items-center gap-2 text-primary font-medium text-sm hover:gap-3 transition-all"
                        >
                          {expandedPost === post.id ? "Close" : "Read more"}
                          {expandedPost === post.id ? <ChevronUp className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                        </button>
                      </div>
                      
                      {/* Expanded Content */}
                      {expandedPost === post.id && (
                        <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-border">
                          <div className="prose dark:prose-invert max-w-none">
                            {post.fullContent.split('\n\n').map((paragraph, i) => (
                              <p key={i} className="text-muted-foreground mb-3 md:mb-4 text-xs md:text-sm leading-relaxed">{paragraph}</p>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <section className="py-12 md:py-20 px-4">
          <div className="max-w-xl mx-auto text-center">
            <Sparkles className="w-10 h-10 md:w-12 md:h-12 text-primary mx-auto mb-4 md:mb-6" />
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3 md:mb-4">Stay in the Loop</h2>
            <p className="text-sm md:text-base text-muted-foreground mb-6 md:mb-8 px-2">
              Get the latest insights on enterprise AI, product updates, and industry trends delivered to your inbox.
            </p>
            {isSubscribed ? (
              <div className="flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-primary/10 text-primary">
                <Sparkles className="w-5 h-5" />
                <span className="font-medium">Thanks for subscribing!</span>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-3">
                <input 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  disabled={isSubscribing}
                  className="flex-1 px-4 py-2.5 md:py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm md:text-base disabled:opacity-50"
                />
                <button 
                  onClick={handleSubscribe}
                  disabled={isSubscribing}
                  className="px-5 md:px-6 py-2.5 md:py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors text-sm md:text-base disabled:opacity-70 flex items-center justify-center gap-2 min-w-[120px]"
                >
                  {isSubscribing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Subscribing...</span>
                    </>
                  ) : (
                    "Subscribe"
                  )}
                </button>
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-4">
              No spam, unsubscribe anytime. Read our <Link to="/legal/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
            </p>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}