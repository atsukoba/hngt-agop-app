// https://discord.js.org/docs/packages/discord.js/main

/**
 * @description Post a message to a discord webhook
 *
 * @param webhookUrl
 * @param message
 * @param base64Image
 * @returns
 */
export const postDIscordWebhook = async (
  webhookUrl: string,
  message: string,
  base64Image: string | undefined = undefined
) => {
  /**
   * https://discord.com/developers/docs/resources/webhook
   */
  if (!webhookUrl) {
    return;
  }
  const baseBody = {
    username: "AGOP AI App",
  };
  const formData = new FormData();
  if (base64Image !== undefined) {
    // decode base64 to blob
    const image = await fetch(base64Image).then((res) => res.blob());
    const imageFile = new File([image], "filename.jpeg");
    formData.append("file", imageFile, "image.jpg");
    formData.append(
      "payload_json",
      JSON.stringify({
        ...baseBody,
        content: message,
        embeds: [
          {
            image: {
              url: "attachment://image.jpg",
            },
          },
        ],
      })
    );
  } else {
    formData.append(
      "payload_json",
      JSON.stringify({
        ...baseBody,
        content: message,
      })
    );
  }
  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: formData,
    });
    return await res.json();
  } catch {
    console.error("Failed to post to discord webhook:", webhookUrl);
  }
};
