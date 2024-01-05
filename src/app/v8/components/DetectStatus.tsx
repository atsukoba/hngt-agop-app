"use client";

import { inferenceCountAtom, resultLabelHistoryAtom } from "@/utils/states";
import { labelsIconMap } from "@/yolo/label";
import { useAtom } from "jotai/react";
import { useEffect, useRef } from "react";

export default function DetectStatus({ width = 200 }: { width: number }) {
  const [inferenceCount, setInferenceCount] = useAtom(inferenceCountAtom);
  const [resultLabelHistory, setResultLabelHistory] = useAtom(
    resultLabelHistoryAtom
  );
  // history results
  const anchorRef = useRef<HTMLDivElement>(null);

  // useEffect(() => {
  //   if (resultLabelHistory.length) {
  //     anchorRef.current?.scrollIntoView({
  //       behavior: "smooth",
  //       block: "end",
  //     });
  //   }
  // }, [resultLabelHistory]);

  return (
    <section
      className={`absolute top-0 right-0 w-px[${width}] h-screen overflow-y-auto flex flex-col items-center p-4 gap-2`}
    >
      {resultLabelHistory.map((labels, i) => (
        <div
          className="card-compact w-full bg-base-100 bg-opacity-30 shadow-md rounded-md"
          key={i}
        >
          <div className="card-body animate-in fade-in-5 animate-out fade-out-5">
            {labels.map((label, j) => (
              <p key={j} className="text-xs text-teal-50">
                {labelsIconMap[label]}
                {label}
              </p>
            ))}
          </div>
        </div>
      ))}
      <div ref={anchorRef}></div>
    </section>
  );
}
