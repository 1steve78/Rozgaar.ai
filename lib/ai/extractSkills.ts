import { env } from '@/lib/env';

export async function extractSkills(description: string): Promise<string[]> {
  if (!description) return [];

  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'mistralai/mistral-7b-instruct',
      messages: [
        {
          role: 'user',
          content: `
Extract technical skills from this job description.
Return ONLY a JSON array of lowercase skill names.

${description}
`,
        },
      ],
    }),
  });

  const json = await res.json();

  try {
    return JSON.parse(json.choices[0].message.content);
  } catch {
    return [];
  }
}
