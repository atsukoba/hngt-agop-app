import YoloCamera from "../components/YoloCamera";
import AppFooter from "../components/AppFooter";
import DetectStatus from "../components/DetectStatus";
import Loading from "../components/Loading";
import LMDisplay from "../components/LMDisplay";
import { use } from "react";

export default function App() {
  return (
    <main className="flex w-screen h-screen flex-col items-center justify-between relative">
      {/* 
        all the child components are positioned absolute.
        each component has its own comtainer with full width and height.
      */}
      <YoloCamera doImageDesc />
      <LMDisplay />
      <AppFooter gpt4mode />
      <DetectStatus width={150} showChatPromptButton={false} />
      <Loading />
    </main>
  );
}
