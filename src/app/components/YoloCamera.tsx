"use client";
import {
  convertToBase64,
  detectImage,
  renderBoxes,
} from "@/yolo/image_processing";
import { useEffect, useRef, useState } from "react";

import { LoadingMessages } from "@/utils/consts";
import { isSameInferenceBoxes } from "@/utils/data";
import {
  currentBoxesAtom,
  currentCameraAtom,
  currentCamerasAtom,
  currentIntervalTImeAtom,
  describeIntervalSecAtom,
  describeModeBase64ImageAtom,
  imageShotFuncAtom,
  inferenceCountAtom,
  inferenceIntervalAtom,
  iouThreshold,
  isAutoDescribeOnAtom,
  isCameraOn,
  loadingMessageAtom,
  resultBoxesHistoryAtom,
  scoreThreshold,
  topK,
} from "@/utils/states";
import { InferenceSessionSet } from "@/utils/types";
import { useAtom, useAtomValue, useSetAtom } from "jotai/react";
import Script from "next/script";
import * as ort from "onnxruntime-web";

const wait = async (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export default function YoloCamera({
  doImageDesc = false,
}: {
  doImageDesc: boolean;
}) {
  // element sizes
  const [elementWidth, setElementWidth] = useState<number>(0);
  const [elementHeight, setElementHeight] = useState<number>(0);

  // camera on/off
  const [cameraOn, setCameraOn] = useAtom(isCameraOn);
  // cameras
  const setCameras = useSetAtom(currentCamerasAtom);
  const [camera, setCamera] = useAtom(currentCameraAtom);

  // model
  const modelName = "yolov8n.onnx";
  const nmsModelName = "nms-yolov8.onnx";
  const modelInputShape: [number, number, number, number] = [1, 3, 416, 416];

  // inference
  const [session, setSession] = useState<InferenceSessionSet | null>(null);
  const setInferenceCount = useSetAtom(inferenceCountAtom);
  const [resultBoxes, setResultBoxes] = useAtom(currentBoxesAtom);
  const [resultBoxesHistory, setResultBoxesHistory] = useAtom(
    resultBoxesHistoryAtom
  );
  const inferenceInterval = useAtomValue(inferenceIntervalAtom);
  const topKVal = useAtomValue(topK);
  const iouThresholdVal = useAtomValue(iouThreshold);
  const scoreThresholdVal = useAtomValue(scoreThreshold);

  // llm image description mode
  const isAutoDescribeOn = useAtomValue(isAutoDescribeOnAtom);
  const describeIntervalSec = useAtomValue(describeIntervalSecAtom);
  const [currentIntervalTIme, setCurrentIntervalTime] = useAtom(
    currentIntervalTImeAtom
  );
  const setImageShotFunc = useSetAtom(imageShotFuncAtom);
  const setImage = useSetAtom(describeModeBase64ImageAtom);

  // refs
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const cameraCanvasRef = useRef<HTMLCanvasElement>(null);
  const boxCanvasRef = useRef<HTMLCanvasElement>(null);

  // loading
  const setLoadingMessage = useSetAtom(loadingMessageAtom);

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

  useEffect(() => {
    /**
     * @description init ort session
     */

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
    return () => observer.disconnect();
  }, [containerRef.current]);

  useEffect(() => {
    /**
     * @description set camera on mount
     */
    setCameraOn(true);
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
     * @description set camera on change
     */
    setLoadingMessage(LoadingMessages.SETUP_CAMERA);
    const video = videoRef.current;
    if (camera && video) {
      navigator.mediaDevices
        .getUserMedia({
          audio: false,
          video: {
            deviceId: {
              exact: camera.deviceId,
            },
            width: {
              ideal: 1920,
            },
            height: {
              ideal: 1080,
            },
            facingMode: {
              ideal: "environment",
            },
          },
        })
        .then((stream) => {
          video.srcObject = stream;
          video.play();
        })
        .catch((err) => {
          alert("Failed to set up camera" + err.message);
        })
        .finally(() => {
          setLoadingMessage(undefined);
        });
    }
  }, [camera]);

  useEffect(() => {
    /**
     * @description inference loop
     */
    (async () => {
      // check if all refs are ready
      if (cameraCanvasRef.current === null || session === null || !cameraOn) {
        const ctx = boxCanvasRef.current?.getContext("2d", {
          willReadFrequently: true,
        });
        ctx?.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); // clean canvas
        return;
      }
      // get data on each update
      videoRef.current &&
        cameraCanvasRef.current
          .getContext("2d", {
            willReadFrequently: true,
          })
          ?.drawImage(videoRef.current, 0, 0, elementWidth, elementHeight);
      // update the bb view
      boxCanvasRef.current && renderBoxes(boxCanvasRef.current, resultBoxes);
      // trigger next inference
      await wait(inferenceInterval);
      const boxes = await detectImage(
        cameraCanvasRef.current,
        session,
        modelInputShape,
        topKVal,
        iouThresholdVal,
        scoreThresholdVal
      );
      setInferenceCount((prev) => prev + 1);
      setResultBoxes(boxes);
      if (
        boxes.length !== 0 &&
        !isSameInferenceBoxes(
          boxes,
          resultBoxesHistory[resultBoxesHistory.length - 1]
        )
      ) {
        setResultBoxesHistory((prev) => {
          const newHistory = [...prev, boxes];
          if (newHistory.length > 10) newHistory.shift();
          return newHistory;
        });
      }
    })();
  }, [
    resultBoxes,
    cameraOn,
    session,
    cameraCanvasRef.current,
    videoRef.current,
  ]);

  useEffect(() => {
    /**
     *  @description initial detection to trigger inference loop
     */
    if (session && cameraCanvasRef.current) {
      setLoadingMessage(LoadingMessages.TEST_MODEL);
      detectImage(cameraCanvasRef.current, session, modelInputShape).then(
        (boxes) => {
          // console.log("boxes", boxes);
          setResultBoxes(boxes);
          setLoadingMessage(undefined);
        }
      );
    }
  }, [session]);

  doImageDesc &&
    useEffect(() => {
      /**
       * @description image description mode: init timer
       */
      console.log(
        "image description mode: desc interval:",
        describeIntervalSec
      );
      if (!cameraCanvasRef.current) {
        return;
      }
      setImageShotFunc({
        // image conversion function for other components
        call: () => {
          const base64 = convertToBase64(cameraCanvasRef.current!);
          console.log("image shot", base64);
          return base64;
        },
      });
    }, [cameraCanvasRef.current, describeIntervalSec, setCurrentIntervalTime]);

  doImageDesc &&
    /**
     * @description counter
     */
    useEffect(() => {
      isAutoDescribeOn &&
        setTimeout(() => {
          if (currentIntervalTIme === 0) {
            setCurrentIntervalTime(describeIntervalSec);
          } else {
            setCurrentIntervalTime((prev) => prev - 1);
          }
        }, 1000);
    }, [isAutoDescribeOn, currentIntervalTIme, describeIntervalSec]);

  doImageDesc &&
    useEffect(() => {
      /**
       * @description trigger image description by updating image data
       */
      if (currentIntervalTIme === 0) {
        const base64 = convertToBase64(cameraCanvasRef.current!);
        setImage(base64);
      }
    }, [cameraCanvasRef.current, currentIntervalTIme, describeIntervalSec]);

  return (
    <>
      <Script
        src="https://docs.opencv.org/4.5.5/opencv.js"
        strategy="beforeInteractive"
        onLoad={() => {
          console.log("OpenCV loaded");
        }}
      />
      <div className="w-full h-full relative" ref={containerRef}>
        <video
          className="w-full h-full left-0 top-0 absolute"
          ref={videoRef}
        ></video>
        <canvas
          className="canvas__camera_input"
          ref={cameraCanvasRef}
          style={{ boxSizing: "border-box", display: "none" }}
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
    </>
  );
}
