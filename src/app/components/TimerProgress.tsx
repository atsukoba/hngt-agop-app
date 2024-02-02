"use client";

import {
  currentIntervalTImeAtom,
  describeIntervalSecAtom,
} from "@/utils/states";
import { useAtomValue } from "jotai";

export default function TimerProgress() {
  const currentIntervalTIme = useAtomValue(currentIntervalTImeAtom);
  const descIntervalTime = useAtomValue(describeIntervalSecAtom);
  return (
    <div className="absolute top-0 right-0 p-4">
      <div
        className={`flex flex-col gap-2 bg-black bg-opacity-50 rounded-lg p-4 ${
          currentIntervalTIme == 0 ? "text-error" : "text-accent"
        }`}
      >
        <p className="font-bold">Next Shot</p>
        <div
          className="radial-progress"
          style={
            {
              "--value": Math.floor(
                100 * (currentIntervalTIme / descIntervalTime)
              ),
              "--size": "5rem",
            } as any
          }
          role="progressbar"
        >
          <span className="countdown font-mono text-2xl">
            <span style={{ "--value": currentIntervalTIme } as any}></span>
          </span>
        </div>
      </div>
    </div>
  );
}
