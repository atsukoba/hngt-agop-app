import { Label } from "@/yolo/label";
import { LLMContentType, PositionDesc, prosthesis } from "./templates";

export const buildPrompts = (results: Label[][]) => {
  // randomly select 2 objects from results
  const [a, b] = results
    .sort(() => Math.random() - 0.5)
    .slice(0, 2)
    .map((labels) => labels[0]);
  return prosthesis(a, b, PositionDesc.beside, LLMContentType.scientific);
};
