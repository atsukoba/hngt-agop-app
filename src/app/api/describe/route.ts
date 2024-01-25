import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";

export const runtime = "edge";

export async function POST(req: Request) {
  const { prompt, base64Image } = await req.json();
  // get Bearer token from the request
  const token = req.headers.get("authorization")?.split(" ")[1];

  if (token?.length === 0) {
    return new Response("Authorization key failure", { status: 401 });
  }

  const model = new OpenAI({
    apiKey: token,
  });

  // Ask OpenAI for a streaming completion given the prompt
  const response = await model.chat.completions
    .create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            {
              type: "image_url",
              image_url: {
                url: base64Image,
                detail: "high",
              },
            },
          ],
        },
      ],
      max_tokens: 1024,
    })
    .asResponse();
  return response;
}
