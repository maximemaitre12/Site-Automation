export interface TourScript {
  id: string;
  title: string;
  text: string;
  duration: number;
  agentType?: 'hr' | 'sales' | 'support' | 'brain' | 'compliance' | 'flow' | 'data';
}

export const tourScripts: TourScript[] = [
  {
    id: 'intro',
    title: 'Welcome to AETHER',
    text: "Welcome to AETHER. The revolutionary AI platform that transforms how businesses operate. Imagine having 7 specialized AI agents working 24/7, handling everything from hiring to sales, support to compliance. This isn't the future. This is now. Let me show you what's possible.",
    duration: 12000,
  },
  {
    id: 'hr',
    title: 'HR Copilot',
    text: "Meet your HR Copilot. Watch as it instantly analyzes hundreds of resumes, scoring candidates with 95% accuracy using advanced AI matching. It conducts sentiment analysis on interviews in real-time, predicting cultural fit before you even ask. Companies using our HR agent reduce hiring time by 70% and improve retention by 45%.",
    duration: 18000,
    agentType: 'hr',
  },
  {
    id: 'sales',
    title: 'Sales Copilot',
    text: "Now witness the Sales Copilot in action. It predicts deal outcomes with remarkable precision, analyzes every sales call for winning patterns, and generates personalized proposals in seconds. Our clients see 35% higher conversion rates and 2x faster deal closures. Your revenue pipeline has never been this intelligent.",
    duration: 17000,
    agentType: 'sales',
  },
  {
    id: 'support',
    title: 'Support Agent',
    text: "Experience the Support Agent that never sleeps. It resolves 72% of tickets automatically, with an average response time of just 12 seconds. Using deep learning from your entire knowledge base, it provides accurate, personalized responses that feel genuinely human. Customer satisfaction scores increase by 40%.",
    duration: 15000,
    agentType: 'support',
  },
  {
    id: 'brain',
    title: 'Brain - Knowledge Hub',
    text: "Discover Brain, your company's collective intelligence. Every document, every conversation, every insight, instantly searchable and connected. Ask any question and get answers with sources. Generate images, analyze data, search the web. It's like having a genius assistant who knows everything about your business.",
    duration: 16000,
    agentType: 'brain',
  },
  {
    id: 'compliance',
    title: 'Compliance Agent',
    text: "Say goodbye to compliance nightmares. Our Compliance Agent scans every document for GDPR violations, identifies personal data exposure, and generates audit reports automatically. Stay compliant without the headache. Risk reduction of 90%, audit preparation time cut by 80%.",
    duration: 14000,
    agentType: 'compliance',
  },
  {
    id: 'flow',
    title: 'Flow Automation',
    text: "Flow connects everything together. Build powerful automations without writing a single line of code. Trigger actions across all agents, automate repetitive workflows, and watch your productivity soar. Teams save an average of 20 hours per week with intelligent automation.",
    duration: 14000,
    agentType: 'flow',
  },
  {
    id: 'data',
    title: 'Data Platform',
    text: "Finally, the Data Platform enriches your business intelligence. Automatically gather company data, track financials, detect market opportunities, and receive real-time alerts on your prospects and clients. Turn raw data into actionable insights with AI-powered analytics.",
    duration: 14000,
    agentType: 'data',
  },
  {
    id: 'conclusion',
    title: 'Start Your Journey',
    text: "Seven AI agents. One unified platform. Thousands of hours saved. AETHER isn't just a tool, it's your competitive advantage. Join the companies already transforming their operations. Start for free today, and discover what your team can achieve when AI works for you.",
    duration: 14000,
  },
];

export const getTotalDuration = () => 
  tourScripts.reduce((acc, script) => acc + script.duration, 0);
