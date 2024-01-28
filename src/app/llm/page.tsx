"use client";

import { useSearchParams } from "next/navigation";
import AppFooter from "../components/AppFooter";
import DetectStatus from "../components/DetectStatus";
import LMDisplay from "../components/LMDisplay";
import Loading from "../components/Loading";
import YoloCamera from "../components/YoloCamera";
import { useEffect, useState } from "react";
import { useSetAtom } from "jotai";
import { apiKeyAtom } from "@/utils/states";

export default function App() {
  const params = useSearchParams();
  const setApiKey = useSetAtom(apiKeyAtom);
  const [toastMessages, setToastMessages] = useState<string[]>([]);

  useEffect(() => {
    const token = params.get("secret");
    if (token) {
      setApiKey(token);
      setToastMessages((prev) => [...prev, "API key set."]);
      setTimeout(() => {
        setToastMessages((prev) => prev.slice(1));
      }, 3000);
    }
  }, []);

  return (
    <main className="flex w-screen h-screen flex-col items-center justify-between relative">
      {/* 
        all the child components are positioned absolute.
        each component has its own comtainer with full width and height.
      */}
      <YoloCamera doImageDesc />
      <LMDisplay />
      <DetectStatus width={150} showChatPromptButton={false} />
      <AppFooter gpt4mode />
      <Loading />
      {/* toasts */}
      {toastMessages.map((msg, idx) => (
        <div
          className="toast toast-top toast-start animate-in animate-out"
          key={idx}
        >
          <div className="alert alert-info">
            <span>{msg}</span>
          </div>
        </div>
      ))}
    </main>
  );
}
