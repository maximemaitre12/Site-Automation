import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { Calendar, Clock, User, ArrowRight, Tag, TrendingUp, Sparkles, GraduationCap, Globe, Zap, Brain, Workflow, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const featuredPost = {
  id: "founders-story",
  title: "From Shanghai Cafés to Enterprise AI: The AETHER Story",
  excerpt: "How two emlyon business school students turned a late-night conversation in Shanghai into a global enterprise AI platform. The story of Youriy and Maxime Maître.",
  image: "https://images.unsplash.com/photo-1474181487882-5abf3f0ba6c2?w=800&h=400&fit=crop",
  author: "AETHER Team",
  date: "December 20, 2025",
  readTime: "8 min read",
  category: "Company",
  featured: true,
  fullContent: `It all started in the spring of 2025, in the bustling streets of Shanghai.

Youriy and Maxime Maître had never met before landing in China. Both were second-year students at emlyon business school, embarking on an exchange program that would change their lives forever.

"We met at a welcome dinner for international students," recalls Youriy. "I was complaining about how my previous internship made me spend hours on repetitive data entry tasks. Maxime looked at me and said, 'What if AI could do all of that?'"

That conversation sparked something. Over the following weeks, the two students found themselves meeting regularly at coffee shops around Putuo district, sketching out ideas on napkins and laptops.

Shanghai: The Perfect Incubator

"Shanghai is a city where you feel like anything is possible," explains Maxime. "The energy, the pace of innovation – it's infectious. We were surrounded by tech companies pushing boundaries, and we thought: why not us?"

The city's vibrant startup ecosystem provided the perfect backdrop. While their classmates explored the Bund and Yu Garden, Youriy and Maxime spent their weekends in co-working spaces, absorbing everything they could about machine learning, enterprise software, and automation.

The first prototype of AETHER was built in a small apartment in Putuo, with the iconic Shanghai skyline as their backdrop. Late nights fueled by baozi and endless cups of tea, they coded the foundation of what would become an enterprise AI platform.

The Vision

"We don't have much funding," admits Youriy. "But we have conviction. We know that enterprises waste countless hours on tasks that AI could handle in seconds."

The Road Ahead

The AETHER journey is just beginning. With ambitious plans for 2025 – including new AI capabilities and innovative features – the two founders are building something they believe in.

"We want to make enterprise AI accessible to everyone," concludes Youriy. "Not just large corporations, but every business that wants to work smarter. That's the AETHER mission."`
};

const posts = [
  {
    id: "why-enterprises-waste-time",
    title: "Why Enterprises Waste 30% of Their Time on Repetitive Tasks",
    excerpt: "A deep dive into research showing how much time knowledge workers spend on tasks AI could handle. The data is staggering.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=300&fit=crop",
    author: "Maxime Maître",
    date: "December 18, 2025",
    readTime: "5 min read",
    category: "Industry",
    icon: TrendingUp,
    fullContent: `According to McKinsey research, knowledge workers spend an average of 30% of their time on repetitive, automatable tasks. That's 12 hours per week, per employee, potentially lost.

The Hidden Cost of Manual Work

Let's break down where this time goes:

• Data entry and transfer between systems: 8% of work time
• Searching for information across tools: 7% of work time  
• Report generation and formatting: 6% of work time
• Email management and sorting: 5% of work time
• Meeting scheduling and coordination: 4% of work time

For a company of 100 knowledge workers at an average salary of €60,000, that's €1.8 million per year spent on tasks that add no strategic value.

The Automation Gap

Despite the availability of automation tools, adoption remains slow. A Deloitte survey found that only 13% of enterprises have scaled their automation efforts beyond pilots.

The main barriers cited:
• Integration complexity with legacy systems (67%)
• Lack of technical expertise (54%)
• Unclear ROI measurement (48%)

What This Means for 2025

The enterprises that solve this problem will have a significant competitive advantage. The question isn't whether to automate, but how quickly you can do it intelligently.

AI is now mature enough to handle complex, judgment-based tasks – not just simple rule-based automation. The 30% is no longer inevitable.`
  },
  {
    id: "ai-voice-agents",
    title: "How Voice AI Actually Works: A Technical Primer",
    excerpt: "From speech recognition to natural language understanding – here's what happens in the milliseconds between your question and the AI's response.",
    image: "https://images.unsplash.com/photo-1590650153855-d9e808231d41?w=600&h=300&fit=crop",
    author: "Youriy",
    date: "December 15, 2025",
    readTime: "6 min read",
    category: "Innovation",
    icon: Brain,
    fullContent: `Voice AI has made remarkable progress, but few understand what happens behind the scenes. Let's demystify the technology.

The Voice AI Pipeline

When you speak to an AI assistant, here's what happens:

1. Audio Capture (0-50ms)
Your voice is captured and converted to digital format. Modern systems sample at 16kHz or higher, creating detailed audio waveforms.

2. Speech Recognition (50-200ms)
The audio is processed by an ASR (Automatic Speech Recognition) model. These models, often based on transformer architectures like Whisper, convert sound waves into text with remarkable accuracy – now exceeding 95% in most conditions.

3. Natural Language Understanding (100-300ms)
The transcribed text is analyzed for intent. What does the user want? This involves parsing entities (names, dates, numbers) and understanding context from previous conversation turns.

4. Response Generation (200-500ms)
Based on the understood intent, the system generates a response. This might involve querying databases, calling APIs, or generating text with a large language model.

5. Speech Synthesis (100-200ms)
The text response is converted back to natural-sounding speech using TTS (Text-to-Speech) models. Modern neural TTS produces nearly indistinguishable from human voice.

The Latency Challenge

Total end-to-end latency of 500-1000ms is crucial for natural conversation. Human conversation has natural pauses of 200-500ms, so AI needs to respond within this window to feel natural.

The breakthrough in recent years has been parallel processing – running recognition, understanding, and early response generation simultaneously rather than sequentially.

Why This Matters for Enterprise

Enterprise voice AI isn't just about chatbots. It's about:
• Automated phone systems that actually understand you
• Meeting transcription and action item extraction
• Voice-controlled data queries and reporting
• Accessibility improvements for all employees`
  },
  {
    id: "enterprise-ai-trends-2025",
    title: "Enterprise AI in 2025: 5 Trends Backed by Data",
    excerpt: "From multimodal AI to autonomous agents, we analyze the trends shaping enterprise AI based on recent research and market data.",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=300&fit=crop",
    author: "Maxime Maître",
    date: "December 10, 2025",
    readTime: "7 min read",
    category: "Industry",
    icon: Globe,
    fullContent: `The enterprise AI landscape is evolving rapidly. Here are five trends backed by recent research and market data.

1. AI Agents Are Moving from Hype to Production

Gartner predicts that by 2028, 33% of enterprise software applications will include agentic AI. These aren't chatbots – they're systems that can execute multi-step tasks autonomously.

Current adoption: 8% of enterprises have deployed AI agents in production
Projected 2025: 23% adoption rate

2. Multimodal AI Is Now Table Stakes

The distinction between text, image, and voice AI is disappearing. According to IDC, 67% of new enterprise AI projects in 2024 were multimodal.

Document processing now combines:
• OCR for text extraction
• Layout analysis for structure understanding  
• Image recognition for diagrams and signatures
• Language models for semantic understanding

3. AI Governance Spending Is Exploding

Forrester reports that spending on AI governance tools grew 340% in 2024. Enterprises are realizing that deploying AI without proper controls creates significant risk.

Key governance requirements:
• Audit trails for all AI decisions
• Explainability for compliance
• Bias detection and mitigation
• Data lineage tracking

4. ROI Measurement Is Maturing

Early AI projects focused on cost savings. Now, enterprises are measuring:
• Time-to-value for new hires
• Customer satisfaction improvements
• Employee experience scores
• Revenue acceleration

McKinsey found that enterprises with mature AI measurement frameworks see 2.5x better returns.

5. Human-AI Collaboration Is the Model

The most successful deployments augment humans rather than replace them. Accenture research shows that human-AI teams outperform either alone by 30% on complex tasks.

The pattern: AI handles volume and speed, humans provide judgment and creativity.`
  },
  {
    id: "document-processing-evolution",
    title: "The Evolution of Document Processing: From OCR to AI Understanding",
    excerpt: "How document processing evolved from simple text extraction to systems that actually understand what they're reading.",
    image: "https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=600&h=300&fit=crop",
    author: "Youriy",
    date: "December 8, 2025",
    readTime: "5 min read",
    category: "Innovation",
    icon: Zap,
    fullContent: `Document processing has come a long way from the early days of OCR. Here's how the technology evolved.

Generation 1: OCR (1990s-2000s)

Optical Character Recognition could convert scanned documents to text, but that was it. No understanding of structure, context, or meaning.

Accuracy was around 85-90%, which sounds good until you realize that means 1-2 errors per line of text.

Generation 2: Template-Based IDP (2010s)

Intelligent Document Processing introduced templates. Define where the invoice number is, where the total is, and the system extracts those fields.

The problem: every new document type required a new template. Template maintenance became a full-time job.

Generation 3: ML-Based Extraction (2018-2022)

Machine learning models could learn from examples. Show the system 100 invoices, and it learns to extract fields from new invoices automatically.

Accuracy improved to 95%+, but the systems still didn't understand what they were extracting.

Generation 4: LLM-Powered Understanding (2023+)

Large language models changed everything. Now, document processing systems can:

• Understand context and relationships between fields
• Handle documents they've never seen before
• Answer questions about document content
• Summarize and extract insights, not just data
• Identify anomalies and inconsistencies

Real-World Impact

A traditional invoice processing workflow:
1. Receive invoice (email, mail, portal)
2. Manual data entry or template-based extraction
3. Manual validation and matching
4. Approval routing
5. Payment processing

Time: 15-30 minutes per invoice

AI-powered workflow:
1. Receive invoice
2. Automatic extraction, validation, and matching
3. Exception handling only for anomalies
4. Automatic approval for standard cases
5. Payment processing

Time: 2-5 minutes per invoice (mostly human review time)

That's an 80% reduction in processing time – and more importantly, near-zero data entry errors.`
  },
  {
    id: "shanghai-startup-ecosystem",
    title: "Building a Startup in Shanghai: What We Learned",
    excerpt: "From co-working spaces in Putuo to tech meetups in Jing'an – lessons from building AETHER in one of the world's most dynamic cities.",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=300&fit=crop",
    author: "AETHER Team",
    date: "December 5, 2025",
    readTime: "6 min read",
    category: "Company",
    icon: Sparkles,
    fullContent: `Shanghai isn't just where AETHER was born – it shaped how we think about building products. Here's what we learned.

The Energy Is Real

Shanghai moves fast. Walking through Lujiazui or Zhangjiang Hi-Tech Park, you feel the pace of innovation. Companies ship products in weeks that would take months elsewhere.

This rubbed off on us. Our first prototype was built in 6 weeks, working from a small apartment in Putuo. The city's energy made anything less feel unacceptable.

The Tech Scene Is Global

One surprise: Shanghai's tech community is incredibly international. Tech meetups in Jing'an draw founders and engineers from dozens of countries. WeChat groups connect French entrepreneurs, American engineers, and Chinese investors.

We found advisors, early users, and inspiration in this mix. AETHER's global perspective – building for enterprises everywhere, not just one market – comes directly from this environment.

Frugality Breeds Creativity

We started with almost no funding. In Shanghai, that's common. Many successful startups here bootstrapped longer than their Silicon Valley counterparts.

This forced us to:
• Focus ruthlessly on what matters
• Build MVPs that actually work, not demos
• Find creative solutions instead of throwing money at problems

The Result: A Different Mindset

AETHER doesn't feel like a typical enterprise software company because we didn't build it like one. We built it like a Shanghai startup:
• Ship fast, iterate faster
• Global from day one
• Resource-efficient by design
• Hungry to prove ourselves

The Shanghai chapter of our story is just the beginning, but it defined who we are.`
  }
];

const categories = ["All", "Company", "Innovation", "Industry"];

export default function Blog() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [expandedPost, setExpandedPost] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = () => {
    if (!email || !email.includes("@")) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }
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
                  className="flex-1 px-4 py-2.5 md:py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm md:text-base"
                />
                <button 
                  onClick={handleSubscribe}
                  className="px-5 md:px-6 py-2.5 md:py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors text-sm md:text-base"
                >
                  Subscribe
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