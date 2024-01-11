export const fetchGenerate = async (
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
