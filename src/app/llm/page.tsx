import AppFooter from "../components/AppFooter";
import DetectStatus from "../components/DetectStatus";
import LMDisplay from "../components/LMDisplay";
import Loading from "../components/Loading";
import TimerProgress from "../components/TimerProgress";
import YoloCamera from "../components/YoloCamera";

export default function App() {
  return (
    <main className="flex w-screen h-screen flex-col items-center justify-between relative">
      {/* 
        all the child components are positioned absolute.
        each component has its own comtainer with full width and height.
      */}
      <YoloCamera doImageDesc />
      <LMDisplay rightMargin={150} />
      <TimerProgress />
      <AppFooter gpt4mode />
      <Loading />
    </main>
  );
}
