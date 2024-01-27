// https://discord.js.org/docs/packages/discord.js/main

export const postDIscordWebhook = async (
  webhookUrl: string,
  message: string,
  base64ImageUrl: string | undefined = undefined
) => {
  const res = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      content: message,
      embeds: [
        {
          image: {
            url: base64ImageUrl,
          },
        },
      ],
    }),
  });
  return await res.json();
};
