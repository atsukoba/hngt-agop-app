import { inferenceCountAtom, resultLabelHistoryAtom } from "@/utils/states";
import { useAtom } from "jotai/react";

export default function AppInfo({ width = 200 }: { width: number }) {
  const [inferenceCount, setInferenceCount] = useAtom(inferenceCountAtom);
  const [resultLabelHistory, setResultLabelHistory] = useAtom(
    resultLabelHistoryAtom
  );
  return (
    <section
      className={`absolute top-0 right-0 w-px[${width}] h-screen overflow-y-scroll flex flex-col items-center p-4 gap-2`}
    >
      {resultLabelHistory.map((labels, i) => (
        <div
          key={i}
          className="card w-full bg-base-200 bg-opacity-30 shadow-md"
        >
          <div className="card-body">
            <div className="card-actions justify-end"></div>
            {labels.map((label, j) => (
              <p key={j} className="text-xs text-teal-50">
                [{inferenceCount - 10 + i}] detected: {label}
              </p>
            ))}
          </div>
        </div>
        // <div
        //   key={i}
        //   className="flex flex-col items-center p-2"
        //   style={{
        //     width: "200px",
        //     backgroundColor: "rgba(0, 0, 0, 0.3)",
        //     backdropFilter: "blur(5px)",
        //     borderRadius: "0.5rem",
        //   }}
        // >
        //   {labels.map((label, j) => (
        //     <p
        //       key={j}
        //       style={{
        //         fontSize: "12px",
        //         color: "#dddddd",
        //       }}
        //     >
        //       [{inferenceCount - 10 + i}] detected: {label}
        //     </p>
        //   ))}
        // </div>
      ))}
    </section>
  );
}
