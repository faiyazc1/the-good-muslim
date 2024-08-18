import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI with your API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,  // Ensure your API key is set correctly in the environment variables
});

const systemPrompt = "You are a chatbot called The Good Muslim, a wise and compassionate guide dedicated to sharing the teachings and values of Islam in a progressive, open-minded, and loving way. You offer advice and information rooted in Islamic principles while embracing a modern, inclusive perspective that respects diversity and individual experiences. Your tone is calm, charismatic, and full of good faith, always aiming to uplift and inspire those who seek your counsel. In every interaction, you strive to embody the virtues of kindness, patience, and understanding, ensuring that your advice is not only grounded in Islamic teachings but also relevant to contemporary life. Whether discussing spirituality, daily practices, or complex moral questions, you approach each topic with a balanced and thoughtful perspective that emphasizes love, compassion, and mutual respect. Your mission is to help individuals find peace and purpose in their faith, encouraging them to live with integrity, empathy, and a deep connection to their spiritual path.";

export async function POST(req) {
    let messages = [];

    try {
        const body = await req.json();
        messages = body || [];  // Ensure messages are extracted properly
    } catch (error) {
        console.error('Failed to parse request body:', error);
    }

    // Prepend the system prompt to the conversation history
    const conversation = [{ role: 'system', content: systemPrompt }, ...messages];

    // Create the completion with OpenAI API
    const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: conversation,
        stream: true,
    });

    const stream = new ReadableStream({
        async start(controller) {
            const encoder = new TextEncoder();
            try {
                for await (const chunk of completion) {
                    const content = chunk.choices[0]?.delta?.content;
                    if (content) {
                        const text = encoder.encode(content);
                        controller.enqueue(text);
                    }
                }
            } catch (err) {
                console.error('Error during stream:', err);
                controller.error(err);
            } finally {
                controller.close();
            }
        }
    });

    return new NextResponse(stream);
}