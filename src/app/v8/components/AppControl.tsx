"use client";

import {
  currentCameraAtom,
  currentCamerasAtom,
  isCameraOn,
} from "@/utils/states";
import { useAtom } from "jotai/react";
import { useRouter } from "next/navigation";

export default function AppControl() {
  const router = useRouter();

  const [cameras, setCameras] = useAtom(currentCamerasAtom);
  const [camera, setCamera] = useAtom(currentCameraAtom);
  const [cameraOn, setCameraOn] = useAtom(isCameraOn);

  return (
    <div className="absolute left-4 bottom-4 flex flex-row justify-start gap-4">
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
  );
}
