import ChatAskPanel from "../components/ChatAskPanel";
import PreviousYearPanel from "../components/PreviousYearPanel";
import ClassPanel from "../components/ClassPanel";

export default function Home() {
  return (
    <div className="space-y-12">
      <ChatAskPanel />
      <PreviousYearPanel />

      <ClassPanel />
    </div>
  );
}
