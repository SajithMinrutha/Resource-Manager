import { useEffect, useState } from "react";
import "./App.css";
import Charts from "./Charts";

interface Statistics {
  storage: number;
  cpu: number;
  ram: number;
  diskIO: number;
  battery: number;
}

function App() {
  const [statss, setStatss] = useState<Statistics[]>([]);

  useEffect(() => {
    window.electron.subscribeStatistics((stats: Statistics) => {
      setStatss((prev) => {
        const newStats = [...prev, stats];
        return newStats.length > 100 ? newStats.slice(-100) : newStats; // Keep last 100 stats
      });
    });
  }, []);

  return (
    <>
      <Charts statss={statss} />
    </>
  );
}

export default App;
