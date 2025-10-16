import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "./components/mode-toggle";
import { Button } from "./components/ui/button";
import { useEffect, useRef, useState } from "react";
import "./App.css";

export default function App() {
  const [count, setCount] = useState(0);
  const [running, setRunning] = useState(false);
  const [records, setRecords] = useState<{ id: number; time: string }[]>([]);
  const [recordId, setRecordId] = useState(1);

  const intervalRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const pauseTimeRef = useRef(0);

  useEffect(() => {
    if (running) {
      // پاک کردن interval قبلی
      if (intervalRef.current) clearInterval(intervalRef.current);

      startTimeRef.current = performance.now() - pauseTimeRef.current;

      intervalRef.current = window.setInterval(() => {
        if (startTimeRef.current !== null) {
          const elapsed = performance.now() - startTimeRef.current;
          setCount(Math.floor(elapsed / 10));
        }
      }, 85);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      pauseTimeRef.current = count * 10;
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running, count]);

  function handleStartStop() {
    setRunning((r) => !r);
  }

  function handleRecord() {
    setRecords((r) => [
      ...r,
      { id: recordId, time: (count / 100).toFixed(2) },
    ]);
    setRecordId((id) => id + 1);
  }

  function handleReset() {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setCount(0);
    setRunning(false);
    setRecords([]);
    setRecordId(1);
    pauseTimeRef.current = 0;
    startTimeRef.current = null;
  }

  return (
    <div className="container d-flex justify-content-start mt-4">
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <ModeToggle />
      </ThemeProvider>

      <Button>salam</Button>

      <div className="card p-4 shadow text-center">
        <div className="row w-auto">
          <label className="col-6 text-end p-0">{Math.floor(count / 100)}.</label>
          <label className="col-6 text-start p-0">{(count % 100).toString().padStart(2, "0")} s</label>
        </div>

        {running ? (
          <div className="d-flex justify-content-center gap-2 mb-3">
            <button className="btn btn-danger" onClick={handleStartStop}>
              Stop
            </button>
            <button className="btn btn-primary" onClick={handleRecord}>
              Record
            </button>
          </div>
        ) : count > 0 ? (
          <div className="d-flex justify-content-center gap-2 mb-3">
            <button className="btn btn-success" onClick={handleStartStop}>
              Resume
            </button>
            <button className="btn btn-secondary" onClick={handleReset}>
              Reset
            </button>
          </div>
        ) : (
          <button className="btn btn-primary mb-3" onClick={handleStartStop}>
            Start
          </button>
        )}

        {records.length > 0 && (
          <table className="table table-bordered mt-3">
            <thead>
              <tr>
                <th>ردیف</th>
                <th>زمان (ثانیه)</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r) => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td>{r.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
