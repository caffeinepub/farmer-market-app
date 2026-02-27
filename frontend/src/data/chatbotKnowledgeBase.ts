export interface FAQEntry {
  id: string;
  keywords: string[];
  question: string;
  answer: string;
  category: string;
}

export const knowledgeBase: FAQEntry[] = [
  {
    id: 'resume-tips-1',
    keywords: ['resume', 'cv', 'write', 'improve', 'tips', 'format'],
    question: 'How do I write a good resume?',
    answer: `A strong resume should:
• Keep it to 1-2 pages maximum
• Use a clean, professional format with consistent fonts
• Start with a compelling summary statement
• List experience in reverse chronological order
• Quantify achievements (e.g., "Increased sales by 30%")
• Tailor your resume for each job application
• Include relevant keywords from the job description
• Proofread carefully for spelling and grammar errors`,
    category: 'Resume Writing',
  },
  {
    id: 'resume-score-1',
    keywords: ['score', 'rating', 'resume score', 'improve score', 'profile strength'],
    question: 'How is my resume score calculated?',
    answer: `Your resume score is calculated based on:
• Skills listed (up to 40 points) — more relevant skills = higher score
• Education entries (up to 20 points) — each degree/certification adds points
• Work experience entries (up to 30 points) — more experience = higher score
• Resume file uploaded (10 points) — uploading your resume PDF adds points

To improve your score: add more skills, complete your education history, add work experience, and upload your resume file.`,
    category: 'Resume Score',
  },
  {
    id: 'interview-prep-1',
    keywords: ['interview', 'prepare', 'preparation', 'questions', 'tips', 'nervous'],
    question: 'How do I prepare for a job interview?',
    answer: `Interview preparation tips:
• Research the company thoroughly before the interview
• Practice common questions: "Tell me about yourself", "Why do you want this job?"
• Prepare STAR method answers (Situation, Task, Action, Result)
• Dress professionally and arrive 10-15 minutes early
• Bring copies of your resume and a notepad
• Prepare thoughtful questions to ask the interviewer
• Follow up with a thank-you email within 24 hours
• Practice with mock interviews to build confidence`,
    category: 'Interview Preparation',
  },
  {
    id: 'career-paths-1',
    keywords: ['career', 'path', 'switch', 'change', 'transition', 'field', 'industry'],
    question: 'How do I plan my career path?',
    answer: `Career planning steps:
• Identify your strengths, interests, and values
• Research industries and roles that align with your skills
• Set short-term (1 year) and long-term (5 year) goals
• Build skills through courses, certifications, and projects
• Network with professionals in your target field
• Consider informational interviews to learn about roles
• Update your LinkedIn profile and professional portfolio
• Be open to lateral moves that build diverse experience`,
    category: 'Career Planning',
  },
  {
    id: 'skills-improvement-1',
    keywords: ['skills', 'learn', 'improve', 'courses', 'certifications', 'upskill', 'training'],
    question: 'How can I improve my skills?',
    answer: `Ways to improve your skills:
• Take online courses on Coursera, Udemy, or LinkedIn Learning
• Earn industry certifications (AWS, Google, Microsoft, etc.)
• Work on personal projects to build a portfolio
• Contribute to open-source projects (for tech roles)
• Attend workshops, webinars, and industry conferences
• Find a mentor in your field
• Read industry blogs, books, and research papers
• Practice skills daily — consistency is key`,
    category: 'Skill Development',
  },
  {
    id: 'job-search-1',
    keywords: ['job search', 'find job', 'apply', 'search', 'strategy', 'how to find'],
    question: 'What is the best job search strategy?',
    answer: `Effective job search strategies:
• Use multiple job boards (LinkedIn, Indeed, Glassdoor)
• Network — 70-80% of jobs are filled through connections
• Set up job alerts for your target roles
• Customize your resume and cover letter for each application
• Apply to 5-10 quality jobs per week rather than mass applying
• Follow up on applications after 1-2 weeks
• Build your personal brand on LinkedIn
• Attend industry events and career fairs`,
    category: 'Job Search',
  },
  {
    id: 'salary-negotiation-1',
    keywords: ['salary', 'negotiate', 'negotiation', 'pay', 'compensation', 'offer'],
    question: 'How do I negotiate my salary?',
    answer: `Salary negotiation tips:
• Research market rates using Glassdoor, PayScale, or LinkedIn Salary
• Know your worth based on skills, experience, and location
• Wait for the employer to make the first offer when possible
• Counter with a specific number, not a range
• Negotiate the total package (benefits, bonuses, remote work)
• Be professional and positive throughout the process
• Get the final offer in writing
• Don't be afraid to ask — most employers expect negotiation`,
    category: 'Salary Negotiation',
  },
  {
    id: 'networking-1',
    keywords: ['network', 'networking', 'connections', 'linkedin', 'professional', 'contacts'],
    question: 'How do I build a professional network?',
    answer: `Building your professional network:
• Optimize your LinkedIn profile with a professional photo and summary
• Connect with colleagues, classmates, and industry professionals
• Engage with content by commenting and sharing insights
• Join professional associations and online communities
• Attend industry meetups and conferences
• Offer value before asking for favors
• Follow up with new connections within 24-48 hours
• Maintain relationships by checking in periodically`,
    category: 'Networking',
  },
  {
    id: 'remote-work-1',
    keywords: ['remote', 'work from home', 'wfh', 'remote job', 'online work'],
    question: 'How do I find remote work opportunities?',
    answer: `Finding remote work:
• Filter jobs by "Remote" on job portals including this one
• Check dedicated remote job boards like Remote.co, We Work Remotely
• Highlight remote work skills: communication, self-management, tools (Slack, Zoom)
• Build a strong online portfolio and LinkedIn presence
• Consider freelancing platforms to build remote experience
• Be clear about your time zone and availability
• Demonstrate reliability and communication skills in interviews`,
    category: 'Remote Work',
  },
  {
    id: 'freshers-1',
    keywords: ['fresher', 'fresh graduate', 'no experience', 'entry level', 'first job', 'new graduate'],
    question: 'How do I get a job as a fresher with no experience?',
    answer: `Tips for freshers:
• Apply for internships to gain practical experience
• Build projects that demonstrate your skills
• Highlight academic projects, coursework, and achievements
• Get certifications relevant to your target field
• Apply for entry-level and graduate trainee positions
• Leverage your college placement cell and alumni network
• Be open to smaller companies where you can learn faster
• Focus on your potential and eagerness to learn in interviews`,
    category: 'Entry Level',
  },
];

export const suggestedQuestions = [
  'How do I write a good resume?',
  'How do I prepare for an interview?',
  'How can I improve my skills?',
  'What is the best job search strategy?',
  'How do I negotiate my salary?',
];

export const fallbackResponses = [
  `I'm not sure about that specific topic, but here are some things I can help with:
• Resume writing tips
• Interview preparation
• Career planning advice
• Skill development strategies
• Job search strategies
• Salary negotiation tips

Try asking about any of these topics!`,
  `That's a great question! While I don't have a specific answer for that, I recommend:
• Checking our job listings for relevant opportunities
• Completing your profile to get better AI recommendations
• Reaching out to professionals in your target field on LinkedIn

Is there anything else I can help you with?`,
];

export function findAnswer(query: string): string {
  const lowerQuery = query.toLowerCase();
  
  // Score each FAQ entry
  const scored = knowledgeBase.map(entry => {
    let score = 0;
    for (const keyword of entry.keywords) {
      if (lowerQuery.includes(keyword.toLowerCase())) {
        score += keyword.length; // longer keyword matches = higher score
      }
    }
    return { entry, score };
  });

  // Find best match
  const best = scored.sort((a, b) => b.score - a.score)[0];
  
  if (best && best.score > 0) {
    return best.entry.answer;
  }

  // Return random fallback
  return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
}
