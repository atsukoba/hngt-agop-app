"use client";

import {
  currentCameraAtom,
  currentCamerasAtom,
  isCameraOn,
} from "@/utils/states";
import { useAtom } from "jotai/react";
import { useRouter } from "next/navigation";
import PromptDisplay from "@/app/v8/components/PromptDisplay";

export default function AppFooter() {
  const router = useRouter();

  const [cameras, setCameras] = useAtom(currentCamerasAtom);
  const [camera, setCamera] = useAtom(currentCameraAtom);
  const [cameraOn, setCameraOn] = useAtom(isCameraOn);

  return (
    <div className="app__footer absolute left-0 bottom-0 px-4 py-2 w-full h-16 flex flex-row justify-between gap-4 bg-black bg-opacity-50">
      <div className="flex flex-row justify-start gap-4">
        <div className="w-24">
          <button
            onClick={(_) => {
              setCameraOn(false);
              router.push("/v8/settings");
            }}
            className="btn btn-primary"
          >
            <div
              className="tooltip tooltip-right"
              data-tip={"Go to settings page"}
            >
              <span
                className="icon-[mdi--cog] w-8 h-8"
                style={{ verticalAlign: "-0.3em" }}
              ></span>
            </div>
          </button>
        </div>
        <select
          className="select select-accent w-full max-w-sm"
          onChange={(e) =>
            setCamera(cameras[e.target.value as unknown as number])
          }
        >
          {cameras.map((c, i) => (
            <option key={i} value={i}>
              {c.label}
            </option>
          ))}
        </select>
      </div>
      <PromptDisplay className="flex-grow flex flex-col justify-center align-middle" />
    </div>
  );
}
