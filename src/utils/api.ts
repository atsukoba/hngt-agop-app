// wait function
export const wait = (ms: number) => new Promise((res) => setTimeout(res, ms));

const fetchGenerate = async (
  prompt: string,
  token: string,
  modelName: string = "gpt-3.5-turbo-instruct"
) => {
  return await fetch("/api/generate", {
    method: "POST",
    body: JSON.stringify({ prompt, modelName }),
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateLlmResponse = async (
  prompt: string,
  token: string,
  updateCallback: any,
  modelName: string = "gpt-3.5-turbo-instruct"
) => {
  updateCallback("");
  const res = await fetchGenerate(prompt, token, modelName);
  // parse readable stream with server event
  const reader = res.body?.getReader();
  let text = "";
  while (true) {
    if (!reader) break;
    const { done, value } = await reader.read();
    if (done) break;
    const decodedText = new TextDecoder().decode(value);
    text += decodedText;
    updateCallback(text);
  }
  return text;
};
