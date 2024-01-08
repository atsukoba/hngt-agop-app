"use client";

import { labelsJaLabelMapAtom, resultLabelHistoryAtom } from "@/utils/states";
import { useAtomValue } from "jotai/react";
import { useRef } from "react";

export default function DetectStatus({ width = 200 }: { width: number }) {
  const resultLabelHistory = useAtomValue(resultLabelHistoryAtom);
  const jaLabel = useAtomValue(labelsJaLabelMapAtom);

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
      className={`absolute top-0 right-0 h-screen overflow-y-auto flex flex-col items-center p-4 gap-2`}
      style={{
        width: `${width}px`,
      }}
    >
      {resultLabelHistory.map((labels, i) => (
        <div
          className="card-compact w-full bg-base-100 bg-opacity-30 shadow-md rounded-md"
          key={`detected_labels_${i}`}
        >
          <div className="card-body animate-in fade-in-5">
            {labels.map((label, j) => (
              <div
                key={`detected_label_${label}_${j}`}
                className="flex flex-col gap-1 align-text-bottom"
              >
                <div className="badge badge-outline gap-2">
                  {/* {labelsIconMap[label]} */}
                  <p className="text-xs font-mono">{label}</p>
                </div>
                <span className="text-xs font-sans">→{jaLabel[label]}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
      <div ref={anchorRef}></div>
    </section>
  );
}
