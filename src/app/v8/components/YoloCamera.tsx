"use client";
import { detectImage, renderBoxes } from "@/yolo/image_processing";
import { useEffect, useRef, useState } from "react";

import * as ort from "onnxruntime-web";
import { InferenceSessionSet } from "@/utils/types";
import { labels } from "@/yolo/label";
import { useAtom, useAtomValue } from "jotai/react";
import {
  currentBoxesAtom,
  currentCameraAtom,
  currentCamerasAtom,
  inferenceCountAtom,
  iouThreshold,
  isCameraOn,
  loadingMessageAtom,
  resultLabelHistoryAtom,
  scoreThreshold,
  topK,
} from "@/utils/states";
import { LoadingMessages } from "@/utils/consts";

export default function YoloCamera() {
  // element sizes
  const [elementWidth, setElementWidth] = useState<number>(0);
  const [elementHeight, setElementHeight] = useState<number>(0);

  // camera on/off
  const [cameraOn, setCameraOn] = useAtom(isCameraOn);
  // cameras
  const [cameras, setCameras] = useAtom(currentCamerasAtom);
  const [camera, setCamera] = useAtom(currentCameraAtom);

  // model
  const modelName = "yolov8n.onnx";
  const nmsModelName = "nms-yolov8.onnx";
  const modelInputShape: [number, number, number, number] = [1, 3, 416, 416];

  // inference
  const [session, setSession] = useState<InferenceSessionSet | null>(null);
  const [inferenceCount, setInferenceCount] = useAtom(inferenceCountAtom);
  const [resultBoxes, setResultBoxes] = useAtom(currentBoxesAtom);
  const [resultLabelHistory, setResultLabelHistory] = useAtom(
    resultLabelHistoryAtom
  );
  const topKVal = useAtomValue(topK);
  const iouThresholdVal = useAtomValue(iouThreshold);
  const scoreThresholdVal = useAtomValue(scoreThreshold);

  // refs
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const cameraCanvasRef = useRef<HTMLCanvasElement>(null);
  const boxCanvasRef = useRef<HTMLCanvasElement>(null);

  // loading
  const [loadingMessage, setLoadingMessage] = useAtom(loadingMessageAtom);

  const initOrtSession = async () => {
    // wait until opencv.js initialized
    if (window.cv) {
      // create session
      setLoadingMessage(LoadingMessages.YOLO_MODEL);
      const yolov8 = await ort.InferenceSession.create(`/models/${modelName}`);
      setLoadingMessage(LoadingMessages.YOLO_CLASSIFIER);
      const nms = await ort.InferenceSession.create(`/models/${nmsModelName}`);
      // warmup main model
      const tensor = new ort.Tensor(
        "float32",
        new Float32Array(modelInputShape.reduce((a, b) => a * b)),
        modelInputShape
      );
      const testRes = await yolov8.run({ images: tensor });
      console.log("model output :", testRes);
      setSession({ net: yolov8, nms: nms });
    }
  };

  const handleCameraChange = (m: MediaDeviceInfo) => {
    setCamera(m);
    const video = videoRef.current;
    if (video) {
      navigator.mediaDevices
        .getUserMedia({
          video: {
            deviceId: m.deviceId,
            width: {
              ideal: 1920,
            },
            height: {
              ideal: 1080,
            },
          },
        })
        .then((stream) => {
          video.srcObject = stream;
          video.play();
        });
    }
  };

  useEffect(() => {
    initOrtSession();
  }, []);

  useEffect(() => {
    /**
     * @description change camera width and height on resize
     */
    if (containerRef.current === null) return;
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const cr = entry.contentRect;
        setElementWidth(cr.width);
        setElementHeight(cr.height);
      }
    });
    observer.observe(containerRef.current);
    // init
    setElementWidth(containerRef.current.clientWidth);
    setElementHeight(containerRef.current.clientHeight);
    // return () => observer.disconnect();
  }, [containerRef.current]);

  useEffect(() => {
    /**
     * @description set camera on mount
     */
    setLoadingMessage(LoadingMessages.SETUP_CAMERA);
    navigator.mediaDevices.enumerateDevices().then((mediaDevices) => {
      const devices = mediaDevices.filter(({ kind }) => kind === "videoinput");
      setCameras(devices);
      if (devices.length) {
        handleCameraChange(devices[0]);
      }
    });
  }, []);

  useEffect(() => {
    /**
     * @description get data on each update
     */
    const video = videoRef.current;
    video?.addEventListener("timeupdate", async (event: Event) => {
      if (videoRef.current && cameraCanvasRef.current) {
        const ctx = cameraCanvasRef.current.getContext("2d", {
          willReadFrequently: true,
        });
        ctx && ctx.drawImage(video, 0, 0, elementWidth, elementHeight);
      }
    });
    return video?.removeEventListener("timeupdate", () => {});
  }, [videoRef, camera, elementWidth, elementHeight]);

  // useEffect(() => {
  //   /**
  //    * @description inference loop
  //    */
  //   if (cameraCanvasRef.current === null || session === null) return;
  //   // update the bb view
  //   boxCanvasRef.current && renderBoxes(boxCanvasRef.current, resultBoxes);
  //   // trigger next inference
  //   detectImage(
  //     cameraCanvasRef.current,
  //     session,
  //     modelInputShape,
  //     topKVal,
  //     iouThresholdVal,
  //     scoreThresholdVal
  //   ).then((boxes) => {
  //     console.log(
  //       `${inferenceCount}: objects`,
  //       boxes.map((b) => labels[b.labelIndex]),
  //       "params",
  //       {
  //         topKVal,
  //         iouThresholdVal,
  //         scoreThresholdVal,
  //       }
  //     );
  //     setInferenceCount((prev) => prev + 1);
  //     setResultBoxes(boxes);
  //     if (boxes.length !== 0) {
  //       setResultLabelHistory((prev) => {
  //         const newHistory = [...prev];
  //         newHistory.push(boxes.map((b) => labels[b.labelIndex]));
  //         if (newHistory.length > 5) newHistory.shift();
  //         return newHistory;
  //       });
  //     }
  //   });
  // }, [resultBoxes]);

  useEffect(() => {
    /**
     *  initial detection to trigger inference loop
     */
    if (session && cameraCanvasRef.current) {
      setLoadingMessage(LoadingMessages.TEST_MODEL);
      detectImage(cameraCanvasRef.current, session, modelInputShape).then(
        (boxes) => {
          console.log("boxes", boxes);
          setResultBoxes(boxes);
          setLoadingMessage(undefined);
        }
      );
    }
  }, [session]);

  return (
    <div className="w-full h-full relative" ref={containerRef}>
      <video ref={videoRef}></video>
      <canvas
        className="canvas__camera_input left-0 top-0 absolute"
        ref={cameraCanvasRef}
        style={{ boxSizing: "border-box" }}
        width={elementWidth}
        height={elementHeight}
      />
      <canvas
        className="canvas__bounding_box left-0 top-0 absolute"
        ref={boxCanvasRef}
        style={{ boxSizing: "border-box" }}
        width={elementWidth}
        height={elementHeight}
      />
    </div>
  );
}
