import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { Calendar, Clock, User, ArrowRight, Tag, TrendingUp, Sparkles, GraduationCap, Globe, Zap, Brain, Workflow, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const featuredPost = {
  id: "founders-story",
  title: "From Shanghai Cafés to Enterprise AI: The AETHER Story",
  excerpt: "How two emlyon business school students turned a late-night conversation in Shanghai into a global enterprise AI platform. The story of Youriy and Maxime Maître.",
  image: "https://images.unsplash.com/photo-1474181487882-5abf3f0ba6c2?w=800&h=400&fit=crop",
  author: "AETHER Team",
  date: "December 20, 2024",
  readTime: "8 min read",
  category: "Company",
  featured: true,
  fullContent: `It all started in the spring of 2024, in the bustling streets of Shanghai.

Youriy and Maxime Maître had never met before landing in China. Both were second-year students at emlyon business school, embarking on an exchange program that would change their lives forever.

"We met at a welcome dinner for international students," recalls Youriy. "I was complaining about how my previous internship made me spend hours on repetitive data entry tasks. Maxime looked at me and said, 'What if AI could do all of that?'"

That conversation sparked something. Over the following weeks, the two students found themselves meeting regularly at coffee shops around Jing'an district, sketching out ideas on napkins and laptops.

Shanghai: The Perfect Incubator

"Shanghai is a city where you feel like anything is possible," explains Maxime. "The energy, the pace of innovation – it's infectious. We were surrounded by tech companies pushing boundaries, and we thought: why not us?"

The city's vibrant startup ecosystem provided the perfect backdrop. While their classmates explored the Bund and Yu Garden, Youriy and Maxime spent their weekends in co-working spaces, absorbing everything they could about machine learning, enterprise software, and automation.

The first prototype of AETHER was built in a small apartment in Pudong, with the iconic Shanghai skyline as their backdrop. Late nights fueled by baozi and endless cups of tea, they coded the foundation of what would become an enterprise AI platform.

From Zero to One

"We didn't have much funding," admits Youriy. "But we had conviction. We knew that enterprises were wasting millions of hours on tasks that AI could handle in seconds."

The breakthrough came when they demonstrated their MVP to a logistics company in Pudong. The CEO, impressed by what two French students had built, became their first beta customer.

By the end of their exchange program, they had a working product and three beta clients – all Chinese companies impressed by what they had built in just a few months.

The Road Ahead

Today, AETHER serves over 100 enterprises across 8 countries. But Youriy and Maxime never forgot their roots.

"We still have a team in Shanghai," says Maxime with a smile. "And every time we visit, we go back to that first coffee shop in Jing'an. It reminds us why we started."

The AETHER journey is far from over. With ambitious plans for 2025 – including new AI capabilities, global expansion, and innovative partnerships – the two founders are just getting started.

"We want to make enterprise AI accessible to everyone," concludes Youriy. "Not just the Fortune 500, but every business that wants to work smarter. That's the AETHER mission."`
};

const posts = [
  {
    id: "salesforce-integration",
    title: "Upcoming: Native Salesforce Integration",
    excerpt: "We're building a deep Salesforce integration that will transform how you manage customer relationships. Automatic lead scoring, deal insights, and AI-powered pipeline management.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=300&fit=crop",
    author: "Maxime Maître",
    date: "December 18, 2024",
    readTime: "5 min read",
    category: "Product",
    icon: TrendingUp,
    fullContent: `We're excited to announce that AETHER's native Salesforce integration is in active development and will launch in Q1 2025.

What to Expect

Our Salesforce integration goes far beyond simple data sync. We're building an intelligent layer that will:

• Automatically score and qualify leads based on behavioral patterns and historical data
• Provide real-time deal insights with win probability predictions
• Generate AI-powered next-best-action recommendations for your sales team
• Sync bi-directionally with full data integrity and conflict resolution

Deep Integration, Not Just a Connector

Unlike traditional integrations that simply move data between systems, AETHER will actually understand your Salesforce data. Our AI will analyze patterns across your opportunities, contacts, and activities to provide actionable insights.

Imagine knowing which deals are at risk before they show warning signs, or automatically prioritizing your daily tasks based on deal impact and urgency.

Beta Program

We're opening a beta program for early adopters in January 2025. If you're a Salesforce customer interested in being among the first to experience this integration, reach out to our team at integrations@aether-ai.com.

The future of CRM is intelligent, and we're building it.`
  },
  {
    id: "ai-voice-agents",
    title: "The Future of Voice: AI Agents That Call For You",
    excerpt: "Imagine an AI that can schedule meetings, follow up with leads, and even conduct initial interviews – all by phone. We're making it happen.",
    image: "https://images.unsplash.com/photo-1590650153855-d9e808231d41?w=600&h=300&fit=crop",
    author: "Youriy",
    date: "December 15, 2024",
    readTime: "6 min read",
    category: "Innovation",
    icon: Brain,
    fullContent: `Voice AI is entering a new era, and AETHER is at the forefront.

We've been quietly building voice agent capabilities that will fundamentally change how businesses handle phone-based communications.

What Are AI Voice Agents?

AI voice agents are sophisticated systems that can conduct natural phone conversations. Unlike IVR systems of the past, these agents understand context, handle interruptions, and respond naturally.

Our voice agents can:
• Schedule and reschedule meetings with natural conversation
• Conduct initial candidate screenings for HR teams
• Follow up with leads and qualify their interest
• Handle customer service inquiries with empathy and accuracy

The Technology Behind It

We're leveraging the latest advances in speech recognition, natural language processing, and voice synthesis. Our agents don't just follow scripts – they understand intent and adapt their responses accordingly.

The key breakthrough is in latency. Our voice agents respond in under 500ms, making conversations feel natural rather than robotic.

Coming in 2025

Voice agents will be available as part of AETHER HR and AETHER Sales modules in mid-2025. We're currently running private pilots with select enterprise customers.

If you're interested in being part of our pilot program, let us know.`
  },
  {
    id: "slack-microsoft-teams",
    title: "Coming Soon: Slack & Microsoft Teams Integration",
    excerpt: "Control AETHER directly from your favorite collaboration tools. Trigger workflows, ask questions, and get insights without leaving Slack or Teams.",
    image: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&h=300&fit=crop",
    author: "AETHER Team",
    date: "December 12, 2024",
    readTime: "4 min read",
    category: "Product",
    icon: Workflow,
    fullContent: `Your workflows shouldn't require you to switch between apps. That's why we're bringing AETHER directly into Slack and Microsoft Teams.

What You'll Be Able to Do

With our upcoming integration, you'll be able to:

Trigger Workflows from Chat
Simply type a command or message the AETHER bot to trigger any workflow. "/aether analyze-document" or "@AETHER run sales-report" – it's that simple.

Ask Questions in Natural Language
"What's the status of the Johnson deal?" or "Show me documents processed this week" – AETHER Brain will respond directly in your chat.

Get Real-Time Notifications
Receive alerts about completed workflows, anomalies detected, or tasks requiring your attention – all in your preferred channel.

Approve Actions
Review and approve workflow actions without leaving your conversation. Perfect for compliance-sensitive operations.

Enterprise-Ready

Both integrations will support:
• SSO authentication
• Channel-based permissions
• Audit logging
• Data residency compliance

Launch Timeline

Slack integration: February 2025
Microsoft Teams integration: March 2025

Sign up for our early access list to be among the first to try it.`
  },
  {
    id: "enterprise-ai-trends-2025",
    title: "Enterprise AI in 2025: 5 Trends That Will Define the Year",
    excerpt: "From multimodal AI to autonomous agents, we explore the key trends that will shape enterprise AI adoption in the coming year.",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=300&fit=crop",
    author: "Maxime Maître",
    date: "December 10, 2024",
    readTime: "7 min read",
    category: "Industry",
    icon: Globe,
    fullContent: `As we approach 2025, the enterprise AI landscape is evolving rapidly. Here are five trends we believe will define the year ahead.

1. Autonomous Agents Go Mainstream

2024 was the year of AI assistants. 2025 will be the year of AI agents – systems that can take action, not just provide information.

Enterprises will deploy agents that can:
• Execute multi-step workflows independently
• Make decisions within defined parameters
• Learn and improve from feedback

AETHER is already building these capabilities into every module.

2. Multimodal AI Becomes Standard

The distinction between text, image, and voice AI will blur. Enterprises will expect AI systems that can process any input format seamlessly.

Document processing will understand layouts, not just text. Customer service will handle voice, chat, and email through unified AI.

3. AI Governance Takes Center Stage

With great power comes great responsibility. 2025 will see a major focus on:
• AI audit trails and explainability
• Compliance frameworks for AI decisions
• Ethical AI guidelines becoming mandatory

We're building governance tools directly into AETHER Compliance.

4. Vertical AI Solutions Surge

Generic AI tools will give way to industry-specific solutions. Healthcare AI, Legal AI, Financial AI – each with deep domain knowledge and specialized workflows.

5. Human-AI Collaboration Matures

The most successful deployments won't be about replacing humans – they'll be about augmenting them. AI will handle the routine, freeing humans for the complex and creative.

At AETHER, we're building for this future. Every feature we ship is designed to enhance human capability, not replace it.`
  },
  {
    id: "hubspot-integration",
    title: "HubSpot Integration: Marketing Automation Meets AI",
    excerpt: "Our upcoming HubSpot integration will bring AI-powered insights to your marketing workflows. Predict campaign performance before you launch.",
    image: "https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=600&h=300&fit=crop",
    author: "Youriy",
    date: "December 8, 2024",
    readTime: "5 min read",
    category: "Product",
    icon: Zap,
    fullContent: `HubSpot is the backbone of marketing operations for thousands of companies. We're bringing AETHER's AI capabilities directly into your HubSpot workflows.

AI-Powered Campaign Intelligence

Before you launch a campaign, AETHER will:
• Predict performance based on historical data and market trends
• Suggest optimal send times and audience segments
• Identify potential issues with your content or targeting
• A/B test variations automatically

Lead Intelligence

Our integration will enhance HubSpot's lead management with:
• AI scoring that goes beyond form fills and page views
• Intent signals from across the web
• Automatic enrichment with company and contact data
• Predictive lead-to-customer conversion rates

Content Optimization

AETHER will analyze your content and suggest:
• Headlines that drive higher engagement
• CTAs optimized for conversion
• Personalization opportunities
• SEO improvements

Coming Q2 2025

The HubSpot integration is scheduled for Q2 2025. We're building it in close collaboration with HubSpot partners to ensure deep, native functionality.

Interested in early access? Let us know.`
  },
  {
    id: "sap-oracle-erp",
    title: "SAP & Oracle ERP: Bridging the Gap with AI",
    excerpt: "Legacy ERP systems don't have to be silos. Learn how AETHER is building bridges to SAP and Oracle for seamless enterprise automation.",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=300&fit=crop",
    author: "AETHER Team",
    date: "December 5, 2024",
    readTime: "6 min read",
    category: "Enterprise",
    icon: Sparkles,
    fullContent: `Enterprise resource planning systems are the backbone of large organizations. But they've historically been isolated from modern AI capabilities. We're changing that.

The ERP Challenge

SAP and Oracle systems contain decades of business-critical data, but extracting insights and automating processes often requires expensive customization or middleware.

Many enterprises find themselves in a frustrating situation:
• Valuable data locked in complex systems
• Manual processes bridging ERP to modern tools
• Limited AI capabilities within legacy systems

AETHER's Approach

We're building native connectors for SAP S/4HANA, Oracle Cloud ERP, and legacy versions of both systems.

Our integration will enable:

Intelligent Data Extraction
AETHER will understand your ERP data structures and automatically extract insights. No more manual report building.

Automated Workflows
Trigger AETHER workflows from ERP events. New purchase order? Automatically validate, route for approval, and update inventory predictions.

AI-Enhanced Analytics
Apply AETHER's AI capabilities to your ERP data. Predict supply chain disruptions, optimize inventory levels, forecast revenue with unprecedented accuracy.

Bi-directional Sync
Changes in AETHER can flow back to your ERP with full audit trails and compliance controls.

Enterprise Ready

We understand the stakes are high with ERP systems. Our integrations will feature:
• Extensive testing and validation
• Rollback capabilities
• Read-only modes for initial deployment
• Full audit logging

Timeline

SAP integration: Beta in Q2 2025, GA in Q3 2025
Oracle integration: Beta in Q3 2025, GA in Q4 2025

Contact our enterprise team to discuss your specific requirements.`
  }
];

const categories = ["All", "Company", "Product", "Innovation", "Industry", "Enterprise"];

export default function Blog() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [expandedPost, setExpandedPost] = useState<string | null>(null);

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
            <div className="flex flex-col sm:flex-row gap-3">
              <input 
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2.5 md:py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm md:text-base"
              />
              <button className="px-5 md:px-6 py-2.5 md:py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors text-sm md:text-base">
                Subscribe
              </button>
            </div>
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