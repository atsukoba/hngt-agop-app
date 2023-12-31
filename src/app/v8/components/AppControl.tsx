import {
  currentCameraAtom,
  currentCamerasAtom,
  isCameraOn,
} from "@/utils/states";
import { useAtom } from "jotai/react";

export default function AppControl() {
  const [cameras, setCameras] = useAtom(currentCamerasAtom);
  const [camera, setCamera] = useAtom(currentCameraAtom);
  const [cameraOn, setCameraOn] = useAtom(isCameraOn);

  return (
    <div className="absolute left-4 top-4">
      <select
        name=""
        id=""
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
      <div className="form-control w-52">
        <label className="cursor-pointer label">
          <span className="label-text">Camera ON/OFF</span>
          <input
            type="checkbox"
            className="toggle toggle-primary"
            onChange={(e) => setCameraOn(e.target.checked)}
          />
        </label>
      </div>
    </div>
  );
}
