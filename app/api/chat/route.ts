import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users, skills as skillsTable, usersSkills } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { createSupabaseServer } from '@/supabase/server';
import { checkChatLimit } from '@/lib/rateLimiter';
import { trackActivity } from '@/lib/analytics';

// Knowledge base for RAG
const KNOWLEDGE_BASE = [
  {
    skill: 'javascript',
    content: `JavaScript is a versatile programming language essential for web development. 
    Skills needed: ES6+, async/await, DOM manipulation, frameworks like React/Vue/Angular.
    Career paths: Frontend Developer, Full-stack Developer, Node.js Developer.
    Learning path: Start with basics (variables, functions), then DOM, then frameworks.
    Time to proficiency: 3-6 months for basics, 1-2 years for mastery.`,
    category: 'programming'
  },
  {
    skill: 'python',
    content: `Python is ideal for beginners and professionals in data science, AI/ML, and backend development.
    Skills needed: Data structures, OOP, libraries (NumPy, Pandas, Django/Flask).
    Career paths: Data Scientist, ML Engineer, Backend Developer, DevOps Engineer.
    Learning path: Python basics → Data structures → Libraries → Frameworks → Projects.
    Time to proficiency: 2-4 months for basics, 6-12 months for specialization.`,
    category: 'programming'
  },
  {
    skill: 'react',
    content: `React is the most popular frontend library for building user interfaces.
    Prerequisites: Strong JavaScript/ES6 knowledge, HTML/CSS.
    Skills needed: JSX, Hooks, State Management (Redux/Context), Component lifecycle.
    Career paths: Frontend Developer, React Developer, Full-stack Developer.
    Learning path: JavaScript → React basics → Hooks → State management → Advanced patterns.
    Time to proficiency: 2-3 months with JS knowledge.`,
    category: 'frontend'
  },
  {
    skill: 'ui/ux',
    content: `UI/UX Design focuses on creating user-centered digital experiences.
    Skills needed: Figma/Adobe XD, Design systems, User research, Wireframing, Prototyping.
    Career paths: UI Designer, UX Designer, Product Designer, Design System Architect.
    Learning path: Design principles → Tools (Figma) → User research → Prototyping → Portfolio.
    Time to proficiency: 4-8 months for portfolio-ready skills.`,
    category: 'design'
  },
  {
    skill: 'machine learning',
    content: `Machine Learning enables systems to learn from data without explicit programming.
    Prerequisites: Python, Statistics, Linear Algebra, Calculus.
    Skills needed: Scikit-learn, TensorFlow/PyTorch, Data preprocessing, Model evaluation.
    Career paths: ML Engineer, Data Scientist, AI Researcher, MLOps Engineer.
    Learning path: Math foundations → Python → ML algorithms → Deep learning → Projects.
    Time to proficiency: 6-12 months with programming background.`,
    category: 'ai'
  },
  {
    skill: 'node',
    content: `Node.js enables server-side JavaScript for building scalable backend applications.
    Prerequisites: JavaScript/ES6 knowledge.
    Skills needed: Express.js, RESTful APIs, Databases (MongoDB/PostgreSQL), Authentication.
    Career paths: Backend Developer, Full-stack Developer, API Developer.
    Learning path: JavaScript → Node.js basics → Express → Databases → Authentication.
    Time to proficiency: 2-4 months with JS knowledge.`,
    category: 'backend'
  },
  {
    skill: 'typescript',
    content: `TypeScript adds static typing to JavaScript for better code quality and developer experience.
    Prerequisites: Strong JavaScript knowledge.
    Skills needed: Type annotations, Interfaces, Generics, Advanced types.
    Career paths: Frontend Developer, Full-stack Developer, TypeScript specialist.
    Learning path: JavaScript mastery → TypeScript basics → Advanced types → Framework integration.
    Time to proficiency: 1-2 months with JS knowledge.`,
    category: 'programming'
  },
  {
    category: 'career-advice',
    content: `Job market trends 2024: High demand for AI/ML engineers, React developers, and cloud engineers.
    Growing fields: Generative AI, DevOps, Cybersecurity, Data Engineering.
    Most valuable skills: Python, JavaScript/TypeScript, Cloud (AWS/Azure/GCP), Docker/Kubernetes.
    For freshers: Focus on 1-2 core skills deeply rather than many skills superficially.
    Portfolio projects are crucial - GitHub activity and deployed projects matter more than certificates.`
  },
  {
    category: 'interview-prep',
    content: `Interview preparation tips for tech roles:
    1. Data Structures & Algorithms: Practice on LeetCode, HackerRank (aim for 100-200 problems).
    2. System Design: For senior roles, study scalability, databases, caching.
    3. Behavioral: Use STAR method, prepare stories about projects and challenges.
    4. Technical: Build projects showcasing your skills, deploy them live.
    5. Resume: Keep it 1-page, focus on impact metrics, use action verbs.
    Timeline: 2-3 months of focused preparation for most tech interviews.`
  },
  {
    category: 'learning-resources',
    content: `Learning resources quality ranking:
    Tier 1 (Best): Official documentation, University courses (MIT OCW, Stanford), Books by experts.
    Tier 2 (Good): Udemy/Coursera top-rated courses, FreeCodeCamp, The Odin Project.
    Tier 3 (Supplementary): YouTube tutorials, Medium articles, Reddit communities.
    For freshers: Combine structured courses with hands-on projects.
    Free vs Paid: Many excellent free resources exist - paid courses offer structure and certificates.`
  },
];

/**
 * Simple keyword-based retrieval for RAG (lightweight alternative to vector search)
 */
function retrieveRelevantContext(query: string, topK: number = 3): string[] {
  const queryLower = query.toLowerCase();
  const keywords = queryLower.split(/\s+/).filter(w => w.length > 3);
  
  // Score each document based on keyword matches
  const scored = KNOWLEDGE_BASE.map(doc => {
    const contentLower = (doc.content || '').toLowerCase();
    const skillLower = (doc.skill || '').toLowerCase();
    const categoryLower = (doc.category || '').toLowerCase();
    
    let score = 0;
    keywords.forEach(keyword => {
      if (skillLower.includes(keyword)) score += 10;
      if (categoryLower.includes(keyword)) score += 5;
      if (contentLower.includes(keyword)) score += 1;
    });
    
    return { doc, score };
  });
  
  // Sort by score and return top K
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .filter(item => item.score > 0)
    .map(item => item.doc.content || '');
}

/**
 * Get RAG-enhanced response using NVIDIA API
 */
async function getRAGResponse(
  userMessage: string,
  userSkills: Array<{ skillName: string; proficiency: number | null }>
): Promise<{ reply: string; sources?: string[] }> {
  try {
    const apiKey = process.env.NVIDIA_API_KEY;
    
    if (!apiKey) {
      console.warn('⚠️ NVIDIA_API_KEY not found - RAG disabled');
      return { reply: '' };
    }

    // Retrieve relevant context from knowledge base
    const relevantDocs = retrieveRelevantContext(userMessage);
    const contextText = relevantDocs.join('\n\n---\n\n');

    console.log('🔍 Retrieved documents:', relevantDocs.length);

    // Format user skills context
    const userSkillsContext = userSkills.length > 0
      ? userSkills.map(s => `${s.skillName} (proficiency: ${s.proficiency || 'not set'})`).join(', ')
      : 'No skills tracked yet - complete beginner';

    // Build the RAG prompt
    const systemPrompt = `You are an expert career advisor and skill development coach for rozgaar.ai, helping freshers and early professionals.

User's Current Skills: ${userSkillsContext}

Context from knowledge base:
${contextText}

Your role:
1. Provide personalized, actionable career and learning advice
2. Recommend specific learning paths based on user's goals and current skills
3. Suggest realistic timelines and milestones
4. Be encouraging but realistic about effort required
5. Reference current job market trends when relevant

Guidelines:
- Keep responses concise (2-4 paragraphs max)
- Focus on actionable next steps
- Be specific about resources and timelines
- Consider the user's existing skill level
- If the context doesn't contain relevant info, use your general knowledge`;

    console.log('🤖 Calling NVIDIA API with RAG...');

    const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'meta/llama-3.1-8b-instruct',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: userMessage
          }
        ],
        temperature: 0.7,
        max_tokens: 400,
        top_p: 0.9,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ NVIDIA API error:', response.status, errorText);
      return { reply: '' };
    }

    const data = await response.json();
    const aiReply = data.choices?.[0]?.message?.content || '';
    
    console.log('✅ NVIDIA RAG response generated');

    return {
      reply: aiReply,
      sources: relevantDocs.length > 0 ? ['knowledge_base'] : undefined
    };

  } catch (error) {
    console.error('❌ RAG response failed:', error);
    return { reply: '' };
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    const message = typeof body?.message === 'string' ? body.message.trim() : '';
    const requestedUserId = typeof body?.userId === 'string' ? body.userId : '';

    const supabase = await createSupabaseServer();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const effectiveUserId = user?.id || requestedUserId;
    const hasValidUserId = isUuid(effectiveUserId);

    console.log('📩 Chat API Request:', { 
      message: message.substring(0, 50), 
      userId: hasValidUserId ? 'valid' : 'invalid' 
    });

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    if (hasValidUserId) {
      try {
        await checkChatLimit(effectiveUserId);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Rate limit reached';
        return NextResponse.json({ error: message }, { status: 429 });
      }

      trackActivity(effectiveUserId, 'chat_message', {
        messageLength: message.length,
      }).catch(() => null);
    }

    const lowerMessage = message.toLowerCase();
    
    // Fetch user's existing skills
    const userSkills = hasValidUserId
      ? await db
          .select({
            skillId: skillsTable.id,
            skillName: skillsTable.name,
            proficiency: usersSkills.proficiency,
          })
          .from(usersSkills)
          .innerJoin(skillsTable, eq(usersSkills.skillId, skillsTable.id))
          .where(eq(usersSkills.userId, effectiveUserId))
          .orderBy(desc(usersSkills.createdAt))
      : [];

    console.log('📚 User skills:', userSkills.length);

    // Get RAG-enhanced AI response
    const { reply: aiResponse, sources } = await getRAGResponse(message, userSkills);

    // Check if user wants to add a skill
    if (
      lowerMessage.includes('learning') ||
      lowerMessage.includes('want to learn') ||
      lowerMessage.includes('learn') ||
      lowerMessage.includes('add') ||
      lowerMessage.includes('study')
    ) {
      if (!hasValidUserId) {
        return NextResponse.json({
          reply: aiResponse || 'Please log in to save skills to your profile. I can still help answer your questions!',
          skills: [],
        });
      }

      const skillMatch = extractSkill(message);
      console.log('🎯 Extracted skill:', skillMatch);

      if (skillMatch) {
        try {
          await db.insert(users).values({ id: effectiveUserId }).onConflictDoNothing();

          const existingSkill = await db
            .select()
            .from(skillsTable)
            .where(eq(skillsTable.name, skillMatch))
            .limit(1);

          let skillId: string;
          if (existingSkill.length === 0) {
            const created = await db
              .insert(skillsTable)
              .values({ name: skillMatch })
              .returning();
            skillId = created[0].id;
            console.log('✨ Created new skill:', skillMatch);
          } else {
            skillId = existingSkill[0].id;
            console.log('📌 Using existing skill:', skillMatch);
          }

          await db
            .insert(usersSkills)
            .values({
              userId: effectiveUserId,
              skillId,
              proficiency: 3,
            })
            .onConflictDoUpdate({
              target: [usersSkills.userId, usersSkills.skillId],
              set: { proficiency: 3 },
            });

          console.log('✅ Skill added to user profile');

          const newSkill = {
            skillId,
            skillName: skillMatch,
            proficiency: 3,
          };

          const recs = await getRecommendations(skillMatch);
          
          return NextResponse.json({
            reply: aiResponse || `Great! I've added "${skillMatch}" to your learning journey. Here are some resources to get started:`,
            skill: newSkill,
            skills: [newSkill, ...userSkills],
            recommendations: recs,
          });
        } catch (dbError) {
          console.error('❌ Database error:', dbError);
          return NextResponse.json({
            reply: aiResponse || "I encountered an error saving the skill, but I can still help you learn!",
            skills: userSkills,
          });
        }
      }
    }

    // Get user's skills
    if (lowerMessage.includes('my skills') || lowerMessage.includes('what am i learning')) {
      if (!hasValidUserId) {
        return NextResponse.json({
          reply: aiResponse || 'Please log in to view your saved skills.',
          skills: [],
        });
      }

      return NextResponse.json({
        reply: aiResponse || (userSkills.length > 0 
          ? "Here are your current skills:" 
          : "You haven't added any skills yet. Tell me what you want to learn!"),
        skills: userSkills,
      });
    }

    // Get recommendations
    if (lowerMessage.includes('resources') || lowerMessage.includes('recommend')) {
      if (!hasValidUserId) {
        return NextResponse.json({
          reply: aiResponse || 'I can suggest resources! What skill would you like to learn?',
          skills: [],
        });
      }

      if (userSkills.length > 0) {
        const recs = await getRecommendations(userSkills[0].skillName);
        return NextResponse.json({
          reply: aiResponse || `Here are some resources for ${userSkills[0].skillName}:`,
          skills: userSkills,
          recommendations: recs,
        });
      }

      return NextResponse.json({
        reply: aiResponse || "Tell me what you want to learn and I'll recommend some great resources!",
        skills: [],
      });
    }

    // Default response with RAG
    const finalReply = aiResponse || (
      userSkills.length > 0
        ? `I can help you track your learning journey. You're currently learning ${userSkills
            .slice(0, 3)
            .map((s) => s.skillName)
            .join(', ')}. What would you like to know?`
        : "I can help you track your learning journey! Tell me what you want to learn, or ask about your current skills."
    );

    console.log('💬 Sending response:', { 
      hasAIResponse: !!aiResponse,
      skillsCount: userSkills.length 
    });

    return NextResponse.json({
      reply: finalReply,
      skills: userSkills,
    });

  } catch (error) {
    console.error('❌ Chatbot error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process message',
        reply: 'Sorry, I encountered an error. Please try again.'
      },
      { status: 500 }
    );
  }
}

function extractSkill(message: string): string | null {
  const patterns = [
    /(?:want to learn|learning|learn|studying|study|add)\s+([a-z0-9+#.\- ]{2,50})/i,
    /(?:help (?:me )?with|resources for|teach me)\s+([a-z0-9+#.\- ]{2,50})/i,
  ];

  for (const pattern of patterns) {
    const match = message.match(pattern);
    if (match) {
      const rawSkill = match[1]
        .replace(/\b(with|for|to|and|my|skills?|please|now)\b.*$/i, '')
        .trim()
        .toLowerCase();

      if (rawSkill && rawSkill.length >= 2) {
        return rawSkill.replace(/\s+/g, ' ');
      }
    }
  }
  return null;
}

function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

async function getRecommendations(skillName: string) {
  const mockData: Record<string, any[]> = {
    javascript: [
      { 
        type: 'youtube', 
        title: 'JavaScript Tutorial for Beginners', 
        url: 'https://www.youtube.com/watch?v=W6NZfCO5SIk', 
        description: 'Complete JS course covering fundamentals to advanced concepts',
        duration: '8 Hours',
        platform: 'YouTube'
      },
      { 
        type: 'course', 
        title: 'The Complete JavaScript Course 2024', 
        url: 'https://www.udemy.com/course/the-complete-javascript-course/', 
        description: 'Master JavaScript with projects, challenges and theory',
        duration: '12 Hours',
        platform: 'Udemy',
        difficulty: 'Medium'
      },
      { 
        type: 'book', 
        title: 'Eloquent JavaScript', 
        url: 'https://eloquentjavascript.net/', 
        description: 'Free online book covering modern JavaScript programming',
        platform: 'Online Book'
      },
      { 
        type: 'tool', 
        title: 'VSCode', 
        url: 'https://code.visualstudio.com/', 
        description: 'Popular code editor with JavaScript IntelliSense',
        platform: 'Microsoft'
      },
    ],
    python: [
      { 
        type: 'youtube', 
        title: 'Python for Beginners', 
        url: 'https://www.youtube.com/watch?v=rfscVS0vtbw', 
        description: 'Complete Python tutorial from basics to advanced',
        duration: '6 Hours',
        platform: 'YouTube'
      },
      { 
        type: 'course', 
        title: '100 Days of Code: Python', 
        url: 'https://www.udemy.com/course/100-days-of-code/', 
        description: 'Build 100 projects in 100 days to master Python',
        duration: '60 Hours',
        platform: 'Udemy',
        difficulty: 'Hard'
      },
      { 
        type: 'book', 
        title: 'Python Crash Course', 
        url: 'https://nostarch.com/python-crash-course-3rd-edition', 
        description: 'Best-selling Python book with hands-on projects',
        platform: 'No Starch Press'
      },
      { 
        type: 'tool', 
        title: 'PyCharm', 
        url: 'https://www.jetbrains.com/pycharm/', 
        description: 'Professional Python IDE with intelligent code completion',
        platform: 'JetBrains'
      },
    ],
    react: [
      {
        type: 'youtube',
        title: 'React Course - Beginner to Advanced',
        url: 'https://www.youtube.com/watch?v=bMknfKXIFA8',
        description: 'Full React course covering hooks, context, and more',
        duration: '12 Hours',
        platform: 'YouTube'
      },
      {
        type: 'course',
        title: 'React - The Complete Guide 2024',
        url: 'https://www.udemy.com/course/react-the-complete-guide/',
        description: 'Master React with hooks, router, Redux and more',
        duration: '48 Hours',
        platform: 'Udemy',
        difficulty: 'Medium'
      },
      {
        type: 'book',
        title: 'Learning React',
        url: 'https://www.oreilly.com/library/view/learning-react-2nd/9781492051718/',
        description: 'Modern patterns for developing React applications',
        platform: "O'Reilly"
      },
    ],
    typescript: [
      {
        type: 'youtube',
        title: 'TypeScript Course for Beginners',
        url: 'https://www.youtube.com/watch?v=BwuLxPH8IDs',
        description: 'Learn TypeScript from scratch with practical examples',
        duration: '8 Hours',
        platform: 'YouTube'
      },
      {
        type: 'course',
        title: 'Understanding TypeScript',
        url: 'https://www.udemy.com/course/understanding-typescript/',
        description: 'Complete guide to TypeScript with real-world projects',
        duration: '15 Hours',
        platform: 'Udemy',
        difficulty: 'Medium'
      },
    ],
    'product design': [
      { 
        type: 'course', 
        title: 'Mastering Design Systems', 
        url: 'https://www.interaction-design.org/', 
        description: 'Learn to create scalable design systems',
        duration: '12 Hours',
        platform: 'Interaction Design Foundation'
      },
      { 
        type: 'course', 
        title: 'Framer Motion for Designers', 
        url: 'https://www.frontendmasters.com/', 
        description: 'Create beautiful animations and interactions',
        platform: 'Frontend Masters',
        difficulty: 'Hard'
      },
      {
        type: 'tool',
        title: 'Figma',
        url: 'https://www.figma.com/',
        description: 'Collaborative interface design tool',
        platform: 'Figma'
      },
    ],
    'ui/ux': [
      {
        type: 'course',
        title: 'Google UX Design Certificate',
        url: 'https://www.coursera.org/professional-certificates/google-ux-design',
        description: 'Professional UX design course by Google',
        duration: '6 Months',
        platform: 'Coursera',
        difficulty: 'Medium'
      },
      {
        type: 'youtube',
        title: 'UI/UX Design Tutorial',
        url: 'https://www.youtube.com/watch?v=c9Wg6Cb_YlU',
        description: 'Complete UI/UX design course for beginners',
        duration: '4 Hours',
        platform: 'YouTube'
      },
    ],
    node: [
      {
        type: 'youtube',
        title: 'Node.js Tutorial for Beginners',
        url: 'https://www.youtube.com/watch?v=TlB_eWDSMt4',
        description: 'Complete Node.js course from basics to advanced',
        duration: '3 Hours',
        platform: 'YouTube'
      },
      {
        type: 'course',
        title: 'The Complete Node.js Developer Course',
        url: 'https://www.udemy.com/course/the-complete-nodejs-developer-course-2/',
        description: 'Build real-world applications with Node.js',
        duration: '35 Hours',
        platform: 'Udemy',
        difficulty: 'Medium'
      },
    ],
    'machine learning': [
      {
        type: 'course',
        title: 'Machine Learning by Andrew Ng',
        url: 'https://www.coursera.org/learn/machine-learning',
        description: 'Foundational machine learning course',
        duration: '11 Weeks',
        platform: 'Coursera',
        difficulty: 'Hard'
      },
      {
        type: 'youtube',
        title: 'Machine Learning Course - Python',
        url: 'https://www.youtube.com/watch?v=7eh4d6sabA0',
        description: 'Practical ML course with Python implementation',
        duration: '4 Hours',
        platform: 'YouTube'
      },
    ],
  };

  const skillLower = skillName.toLowerCase();
  const recommendations = mockData[skillLower];
  
  if (!recommendations || recommendations.length === 0) {
    return [{
      type: 'course',
      title: `Learn ${skillName}`,
      url: `https://www.google.com/search?q=learn+${encodeURIComponent(skillName)}+tutorial`,
      description: `Find curated resources to master ${skillName}`,
      platform: 'Web Search'
    }];
  }
  
  return recommendations;
}
