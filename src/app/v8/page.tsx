import YoloCamera from "./components/YoloCamera";
import AppControl from "./components/AppControl";
import DetectStatus from "./components/DetectStatus";
import Loading from "./components/Loading";

export default function App() {
  return (
    <main className="flex w-screen h-screen flex-col items-center justify-between relative">
      <YoloCamera />
      <AppControl />
      <DetectStatus width={200} />
      <Loading />
    </main>
  );
}
