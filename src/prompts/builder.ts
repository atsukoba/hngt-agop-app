import {
  LLMContentType,
  PositionDesc,
  getRandomLLMContentType,
  getRandomThemePrompt,
} from "./templates";

export const buildRandomPrompts = (inputLabels: string[]) => {
  // randomly select 2 objects from results
  return getRandomThemePrompt(
    inputLabels[0],
    inputLabels[1],
    PositionDesc.beside,
    getRandomLLMContentType()
  );
};

/**
 * GPT-4 mode, the response is used as part of a prompt for the next completion
 * @param response
 * @returns
 */
export const buildPreviousResponseAsPrompt = (response: string) => {
  return response !== undefined && response.length > 0
    ? "先程あなたが「" +
        response
          .split("\n")
          .map((line) => line.split("[en]")[0])
          .join("") +
        "」と言っていたことも踏まえ、比較したりしながら表現してください。"
    : "";
};
