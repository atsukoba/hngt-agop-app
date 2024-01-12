"use client";

import { buildRandomPrompts } from "@/prompts/builder";
import {
  labelsJaLabelMapAtom,
  promptDialogMessageAtom,
  resultBoxesHistoryAtom,
} from "@/utils/states";
import { InferenceBox } from "@/utils/types";
import { labels } from "@/yolo/label";
import { useAtomValue, useSetAtom } from "jotai/react";
import { useEffect, useRef } from "react";

export default function DetectStatus({ width = 200 }: { width: number }) {
  const resultBoxesHistory = useAtomValue(resultBoxesHistoryAtom);
  const jaLabel = useAtomValue(labelsJaLabelMapAtom);
  const setPromptDialogMessage = useSetAtom(promptDialogMessageAtom);

  // history results
  const anchorRef = useRef<HTMLDivElement>(null);

  const issueNewPrompt = (boxes: InferenceBox[]) => {
    const inputLabels = boxes.map((box) => jaLabel[labels[box.labelIndex]]);
    const prompt = buildRandomPrompts(inputLabels);
    setPromptDialogMessage(prompt);
  };

  useEffect(() => {
    if (resultBoxesHistory.length) {
      anchorRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [resultBoxesHistory]);

  return (
    <section
      className={`absolute top-0 right-0 h-screen overflow-y-scroll flex flex-col items-center p-4 gap-2`}
      style={{
        width: `${width}px`,
      }}
    >
      <div className="h-8"></div>
      {resultBoxesHistory.map(
        (boxes, i) =>
          boxes.length !== 0 && (
            <div
              className="card-compact w-full bg-base-100 bg-opacity-50 shadow-md rounded-md animate-in fade-in-20"
              key={`detected_labels_${i}`}
            >
              <div className="card-body">
                {boxes.map((box, j) => (
                  <div
                    key={`detected_label_${labels[box.labelIndex]}_${j}`}
                    className="flex flex-col gap-1 align-text-bottom"
                  >
                    <div className="badge badge-outline gap-2">
                      {/* {labelsIconMap[label]} */}
                      <p className="text-xs font-mono">
                        {labels[box.labelIndex]}
                      </p>
                    </div>
                    <span className="text-xs font-sans">
                      →{jaLabel[labels[box.labelIndex]]}
                    </span>
                  </div>
                ))}
                {boxes.length > 1 && (
                  <div className="card-actions justify-end">
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={(e) => {
                        issueNewPrompt(boxes);
                      }}
                    >
                      Prompt
                    </button>
                  </div>
                )}
              </div>
            </div>
          )
      )}
      <div className="w-full h-[64px]" ref={anchorRef}></div>
    </section>
  );
}
