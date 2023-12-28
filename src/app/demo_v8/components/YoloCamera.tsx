"use client";
import { detectImage, renderBoxes } from "@/yolo/image_processing";
import { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import * as ort from "onnxruntime-web";
import { InferenceBox, InferenceSessionSet } from "@/utils/types";

export default function YoloCamera() {
  const [elementWidth, setelementWidth] = useState<number>(0);
  const [elementHeight, setelementHeight] = useState<number>(0);
  // cameras
  const [cameras, setCameras] = useState<Array<MediaDeviceInfo>>([]);
  const [camera, setCamera] = useState<MediaDeviceInfo | null>(null);

  // model
  const modelName = "yolov8n.onnx";
  const nmsModelName = "nms-yolov8.onnx";
  const modelInputShape: [number, number, number, number] = [1, 3, 416, 416];

  // inference
  const [inferenceCount, setInferenceCount] = useState<number>(0);
  const [session, setSession] = useState<InferenceSessionSet | null>(null);
  const [resultBoxes, setResultBoxes] = useState<InferenceBox[]>([]);

  const containerRef = useRef<HTMLDivElement>(null);
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    /**
     * @description change camera width and height on resize
     */
    const handleResize = () => {
      setelementWidth(containerRef.current?.clientWidth || 0);
      setelementHeight(containerRef.current?.clientHeight || 0);
    };
    containerRef.current?.addEventListener("resize", handleResize);
    handleResize();
    return () =>
      containerRef.current?.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    /**
     * @description set camera on mount
     */
    navigator.mediaDevices.enumerateDevices().then((mediaDevices) => {
      const devices = mediaDevices.filter(({ kind }) => kind === "videoinput");
      setCameras(devices);
      if (devices.length) {
        setCamera(devices[0]);
      }
    });
  }, []);

  useEffect(() => {
    /**
     * @description get data on each update
     */
    const video = webcamRef.current?.video;
    video &&
      session &&
      video.addEventListener("timeupdate", async (event: Event) => {
        const canvas = canvasRef.current;
        if (webcamRef.current && canvas) {
          const ctx = canvas.getContext("2d", { willReadFrequently: true });
          ctx && ctx.drawImage(video, 0, 0, elementWidth, elementHeight);
          ctx && renderBoxes(canvas, resultBoxes);
        }
      });
  }, [webcamRef, session, elementWidth, elementHeight]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas === null || session === null) return;
    detectImage(canvas, session, modelInputShape).then((boxes) => {
      console.log(`${inferenceCount}: boxes`, boxes);
      setInferenceCount((prev) => prev + 1);
      setResultBoxes(boxes);
    });
  }, [resultBoxes]);

  const initOrtSession = async () => {
    // wait until opencv.js initialized
    console.log("OpenCV init:", window.cv);
    if (window.cv) {
      // create session
      console.log("loading models and creating YOLO session");
      const [yolov8, nms] = await Promise.all([
        ort.InferenceSession.create(`/models/${modelName}`),
        ort.InferenceSession.create(`/models/${nmsModelName}`),
      ]);
      console.log("checking model input");
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

  useEffect(() => {
    initOrtSession();
  }, []);

  useEffect(() => {
    // initial detection
    session &&
      canvasRef.current &&
      detectImage(canvasRef.current, session, modelInputShape).then((boxes) => {
        console.log("boxes", boxes);
        setResultBoxes(boxes);
      });
  }, [session]);

  return (
    <div className="w-full h-full relative" ref={containerRef}>
      <Webcam
        ref={webcamRef}
        videoConstraints={{
          width: elementWidth,
          height: elementHeight,
          facingMode: "user",
          deviceId: camera?.deviceId,
        }}
        className="display-none"
        style={{
          width: elementWidth,
          height: elementHeight,
          boxSizing: "content-box",
        }}
      />
      <canvas
        className="left-0 top-0 absolute"
        ref={canvasRef}
        style={{ boxSizing: "content-box" }}
        width={elementWidth}
        height={elementHeight}
      />
    </div>
  );
}
