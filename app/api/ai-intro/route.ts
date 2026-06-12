// app/api/ai-intro/route.ts
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    // Parse the client and match profiles sent from the frontend
    const { client, match } = await req.json();

    // Construct a highly specific, context-rich prompt
    const prompt = `
      You are an elite, discreet luxury matchmaker at The Date Crew, an exclusive Indian matchmaking service.
      Write a warm, highly personalized email introducing ${client.firstName} and ${match.firstName} to each other.
      
      Client Details:
      - Demographics: ${client.firstName} ${client.lastName}, ${client.age}, from ${client.city}.
      - Career: ${client.designation} at ${client.company} (Studied ${client.specialization} at ${client.ugCollege}).
      - Background: ${client.religion}, ${client.caste}, ${client.familyType} family.
      - Lifestyle: Diet: ${client.dietaryPreference}, Drinking: ${client.drinking}, Wants Kids: ${client.wantKids}.
      - Bio: "${client.aboutMe}"

      Match Details:
      - Demographics: ${match.firstName} ${match.lastName}, ${match.age}, from ${match.city}.
      - Career: ${match.designation} at ${match.company} (Studied ${match.specialization} at ${match.ugCollege}).
      - Background: ${match.religion}, ${match.caste}, ${match.familyType} family.
      - Lifestyle: Diet: ${match.dietaryPreference}, Drinking: ${match.drinking}, Wants Kids: ${match.wantKids}.
      - Bio: "${match.aboutMe}"
      
      INSTRUCTIONS & TONE:
      1. Address both individuals warmly in the opening (e.g., "Dear ${client.firstName} and ${match.firstName},").
      2. Selective Connection: Identify and highlight the 2 or 3 strongest points of compatibility (e.g., aligning career ambitions, shared family values, or complementary hobbies from their bios). 
      3. Narrative Flow: DO NOT sound like a robot listing off their stats, degrees, or dietary habits. Weave the connection points naturally into a sophisticated narrative.
      4. Tone: Elite, polished, and encouraging. Frame this as a highly curated introduction. Talk like a 50 year old Matchmaker
      5. Strict maximum of 250 words. Do not include subject lines or bracketed placeholders—just the raw email body. Also break into paragraphs.
    `;

    // Fetch call to Groq's API using the blazing fast Llama 3 model
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to generate AI intro');
    }

    // Return the generated text back to the frontend
    return NextResponse.json({ emailText: data.choices[0].message.content });
    
  } catch (error) {
    console.error("AI Generation Error:", error);
    return NextResponse.json({ error: "Failed to generate AI intro" }, { status: 500 });
  }
}