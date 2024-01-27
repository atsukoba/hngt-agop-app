// wait function
export const wait = (ms: number) => new Promise((res) => setTimeout(res, ms));

const fetchChat = async (
  prompt: string,
  token: string,
  modelName: string = "gpt-3.5-turbo-instruct"
) => {
  return await fetch("/api/chat", {
    method: "POST",
    body: JSON.stringify({ prompt, modelName }),
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

/**
 * @description Using the OpenAI API to get the response, and update the
 * response text state
 * @param prompt Prompt text
 * @param token OpenAI API seqret key
 * @param updateCallback: (str) => void
 * @param modelName
 * @returns
 */
export const updateChatResponse = async (
  prompt: string,
  token: string,
  updateCallback: any,
  modelName: string = "gpt-3.5-turbo-instruct"
) => {
  updateCallback("");
  const res = await fetchChat(prompt, token, modelName);
  // parse readable stream with server event
  const reader = res.body?.getReader();
  let text = "";
  while (true) {
    if (!reader) break;
    const { done, value } = await reader.read();
    if (done) break;
    const decodedText = new TextDecoder().decode(value);
    text += decodedText;
  }
  updateCallback(text);
  return text;
};

const fetchDescription = async (
  base64Image: string,
  prompt: string,
  token: string
) => {
  return await fetch("/api/describe", {
    method: "POST",
    body: JSON.stringify({ prompt, base64Image }),
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

/**
 * @description Using the OpenAI API to get the response, and update the
 * response text state
 * @param prompt Prompt text
 * @param role Prompt text
 * @param token OpenAI API seqret key
 * @param updateCallback: (str) => void
 * @param modelName
 * @returns
 */
export const updateDescribeResponse = async (
  base64Image: string,
  prompt: string,
  token: string,
  updateCallback: any
) => {
  const res = await fetchDescription(base64Image, prompt, token);
  const data = await res.json();
  // parse readable stream with server event
  console.log(data);
  const content = data.choices[0].message.content;
  updateCallback(content);
  return content;
};
