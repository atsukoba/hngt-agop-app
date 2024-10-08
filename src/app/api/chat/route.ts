import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";

export const runtime = "edge";

export async function POST(req: Request) {
  const { prompt, modelName } = await req.json();
  // get Bearer token from the request
  const token = req.headers.get("authorization")?.split(" ")[1];

  if (token?.length === 0) {
    return new Response("Authorization key failure", { status: 401 });
  }

  const model = new OpenAI({
    apiKey: token,
  });

  // Ask OpenAI for a streaming completion given the prompt
  const response = await model.completions.create({
    model: modelName,
    max_tokens: 2000,
    stream: true,
    prompt,
  });

  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response);

  // Respond with the stream
  return new StreamingTextResponse(stream);
}
