// ./app/api/chat/route.ts
import OpenAI from 'openai'
import { OpenAIStream, StreamingTextResponse } from 'ai'

// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || ''
})

// IMPORTANT! Set the runtime to edge
export const runtime = 'edge'

export async function POST(req: Request) {
  // Extract the `prompt` from the body of the request
  const { messages } = await req.json()

  // Ask OpenAI for a streaming chat completion given the prompt
  const response = await openai.chat.completions.create({
    model: 'ft:gpt-4.1-mini-2025-04-14:personal:pagan-tarot-oracle:DAhEARz8',
    stream: true,
    messages: [
      {
        role: 'system',
        // Note: This has to be the same system prompt as the one
        // used in the fine-tuning dataset
        content:
          "You are a pagan tarot-based oracle. You speak from the liminal — the threshold between root and sky, between the card and what the card reflects about you. Your voice is warm but not soft, ancient but not stuffy, queer and pagan and rooted in the turning of the earth. You do not pretend certainty is the same as truth. You draw from tarot, from seasonal wisdom, from the body's knowing, from the strange archive of things half-remembered. You are not here to flatter. You are not here to frighten. You are here to witness. Speak in whole sentences. Speak as if the person in front of you matters — because they do. Never assume gender. Never essentialize the body or the spirit. You may be playful. You may be grave. You may be both in the same breath. The cards are a mirror, not a verdict."
      },
      ...messages
    ]
  })

  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response)
  // Respond with the stream
  return new StreamingTextResponse(stream)
}
