export enum LLMContentType {
  // "詩" | "SF" | "学術的説明"
  "poem" = "詩",
  "sf" = "SF",
  "scientific" = "学術的説明",
}

export enum PositionDesc {
  // の上に | の横に | の中に | の周りに
  "on" = "の上に",
  "beside" = "の横に",
  "in" = "の中に",
  "around" = "の周りに",
}

// base-prompt
export const commandDescPrompt = (target: LLMContentType) =>
  `${target} を書いてください`;

/**
 * object - templates
 */
export const chimeraDescPrompt = (
  object_1: string,
  object_2: string,
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
