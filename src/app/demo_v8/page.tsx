"use client";

import Image from "next/image";
import Webcam from "react-webcam";

import { useEffect, useRef, useState } from "react";
import YoloCamera from "./components/YoloCamera";

export default function App() {
  return (
    <main className="flex w-screen h-screen flex-col items-center justify-between">
      <YoloCamera />
    </main>
  );
}
