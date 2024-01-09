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
