"use client";
import { detectImage, renderBoxes } from "@/yolo/image_processing";
import { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import * as ort from "onnxruntime-web";
import { InferenceBox, InferenceSessionSet } from "@/utils/types";
import { labels } from "@/yolo/label";

export default function YoloCamera() {
  // element sizes
  const [elementWidth, setElementWidth] = useState<number>(0);
  const [elementHeight, setElementHeight] = useState<number>(0);

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
  const [resultLabelHistory, setResultLabelHistory] = useState<string[][]>([
    [],
  ]);

  // refs
  const containerRef = useRef<HTMLDivElement>(null);
  const webcamRef = useRef<Webcam>(null);
  const cameraCanvasRef = useRef<HTMLCanvasElement>(null);
  const boxCanvasRef = useRef<HTMLCanvasElement>(null);

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
    return () => observer.disconnect();
  }, [containerRef.current]);

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
        if (webcamRef.current && cameraCanvasRef.current) {
          const ctx = cameraCanvasRef.current.getContext("2d", {
            willReadFrequently: true,
          });
          ctx && ctx.drawImage(video, 0, 0, elementWidth, elementHeight);
          boxCanvasRef.current &&
            renderBoxes(boxCanvasRef.current, resultBoxes);
        }
      });
  }, [webcamRef, session, elementWidth, elementHeight, resultBoxes]);

  useEffect(() => {
    if (cameraCanvasRef.current === null || session === null) return;
    detectImage(cameraCanvasRef.current, session, modelInputShape).then(
      (boxes) => {
        if (boxes.length === 0) return;
        console.log(
          `${inferenceCount}: objects`,
          boxes.map((b) => labels[b.labelIndex])
        );
        setResultLabelHistory((prev) => {
          const newHistory = [...prev];
          newHistory.push(boxes.map((b) => labels[b.labelIndex]));
          if (newHistory.length > 10) newHistory.shift();
          return newHistory;
        });
        setInferenceCount((prev) => prev + 1);
        setResultBoxes(boxes);
      }
    );
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
    /**
     *  initial detection to trigger inference loop
     */
    session &&
      cameraCanvasRef.current &&
      detectImage(cameraCanvasRef.current, session, modelInputShape).then(
        (boxes) => {
          console.log("boxes", boxes);
          setResultBoxes(boxes);
        }
      );
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
      <section className="absolute top-0 right-0 h-screen flex justify-start flex-col p-4 gap-2">
        {resultLabelHistory.map((labels, i) => (
          <div
            key={i}
            className="flex flex-col items-center p-2"
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.3)",
              backdropFilter: "blur(5px)",
              borderRadius: "0.5rem",
            }}
          >
            {labels.map((label, j) => (
              <p
                key={j}
                style={{
                  fontSize: "12px",
                  color: "#dddddd",
                }}
              >
                [{inferenceCount - 10 + i}] detected: {label}
              </p>
            ))}
          </div>
        ))}
      </section>
    </div>
  );
}
