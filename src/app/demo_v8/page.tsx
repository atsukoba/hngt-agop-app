"use client";

import Image from "next/image";
import Webcam from "react-webcam";

import { useEffect, useRef, useState } from "react";

export default function App() {
  const [windowWidth, setWindowWidth] = useState<number>(0);
  const [windowHeight, setWindowHeight] = useState<number>(0);
  const [cameras, setCameras] = useState<Array<MediaDeviceInfo>>([]);
  const [camera, setCamera] = useState<MediaDeviceInfo | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    /**
     * @description change camera width and height on resize
     */
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      setWindowHeight(window.innerHeight);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
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
      video.addEventListener("timeupdate", (d) => {
        const canvas = canvasRef.current;
        if (webcamRef.current && canvas) {
          const ctx = canvas.getContext("2d");
          ctx && ctx.drawImage(video, 0, 0, windowWidth, windowHeight);
        }
      });
  }, [webcamRef]);

  return (
    <main
      className="flex min-w-screen min-h-screen flex-col items-center justify-between"
      ref={containerRef}
    >
      {/* canvas here */}
      <div className="w-full h-full relative">
        <Webcam
          ref={webcamRef}
          videoConstraints={{
            width: windowWidth,
            height: windowHeight,
            facingMode: "user",
            deviceId: camera?.deviceId,
          }}
          className="display-none"
          style={{
            width: windowWidth,
            height: windowHeight,
            boxSizing: "content-box",
          }}
        />
        <canvas
          className="left-0 top-0 absolute"
          ref={canvasRef}
          style={{ boxSizing: "content-box" }}
          width={windowWidth}
          height={windowHeight}
        />
      </div>
    </main>
  );
}
