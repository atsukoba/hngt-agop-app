import { PromptTemplate } from "@langchain/core/prompts";

export const validateObjectTemplate = (template: string, nObjects: number) => {
  if (template.length === 0) {
    return false;
  }
  if (nObjects === 1) {
    if (!template.includes("{object}")) {
      return false;
    }
  }
  if (nObjects === 2) {
    if (!template.includes("{object1}") || !template.includes("{object2}")) {
      return false;
    }
  }
  if (nObjects >= 3) {
    if (
      !(
        template.includes("{object1}") &&
        template.includes("{object2}") &&
        template.includes("{object3}")
      )
    ) {
      return false;
    }
  }
  return true;
};

const prompt = new PromptTemplate({
  inputVariables: ["product"],
  template: "{product}を作る日本語の新会社名をを1つ提案してください",
});

export enum LLMContentType {
  // "詩" | "SF" | "学術的説明"
  "poem" = "詩",
  "sf" = "SF",
  "scientific" = "学術的説明",
}

export const getRandomLLMContentType = () => {
  const values = Object.values(LLMContentType);
  const index = Math.floor(Math.random() * values.length);
  return values[index];
};

export enum PositionDesc {
  // の上に | の横に | の中に | の周りに
  "on" = "の上に",
  "beside" = "の横に",
  "in" = "の中に",
  "around" = "の周りに",
}

// base-prompt
export const commandDescPrompt = (target: LLMContentType) =>
  `${target}を書いてください`;

/**
 * object - templates
 */
export const chimeraDescPrompt = (
  object_1: string,
  object_2: string,
  pos: PositionDesc,
  target: LLMContentType
) => `${object_1}と${object_2} のキメラについての${commandDescPrompt(target)}`;

export const objectDescPrompt = (
  object_1: string,
  object_2: string,
  pos: PositionDesc,
  target: LLMContentType
) =>
  `${object_1}${pos}${object_2}が置かれている庭の置物について${commandDescPrompt(
    target
  )}`;

export const prosthesis = (
  object_1: string,
  object_2: string,
  pos: PositionDesc,
  target: LLMContentType
) =>
  `${object_1}${pos}${object_2}がくっついている義肢について${commandDescPrompt(
    target
  )}`;

export const getRandomThemePrompt = (
  object_1: string,
  object_2: string,
  pos: PositionDesc,
  target: LLMContentType
) => {
  // get random one from chimera, object, prosthesis
  const func = [chimeraDescPrompt, objectDescPrompt, prosthesis][
    Math.floor(Math.random() * 3)
  ];
  return func(object_1, object_2, pos, target);
};
