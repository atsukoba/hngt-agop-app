"use client";

import Image from "next/image";

import { useEffect, useRef, useState } from "react";
import YoloCamera from "./components/YoloCamera";
import AppInfo from "./components/AppInfo";
import AppControl from "./components/AppControl";

export default function App() {
  return (
    <main className="flex w-screen h-screen flex-col items-center justify-between relative">
      <YoloCamera />
      <AppControl />
      <AppInfo width={200} />
    </main>
  );
}
