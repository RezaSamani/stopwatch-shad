import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "./components/mode-toggle";
import { Button } from "./components/ui/button";
import { useEffect, useRef, useState } from "react";
import { Label } from "@/components/ui/label";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

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
  // اگر تایمر فعال است، هر بار قبل از شروع تایمر جدید، قبلی را پاک کن
  intervalRef.current && clearInterval(intervalRef.current);

  running
    ? (() => {
        startTimeRef.current = performance.now() - pauseTimeRef.current;
        intervalRef.current = window.setInterval(() => {
          if (startTimeRef.current !== null) {
            const elapsed = performance.now() - startTimeRef.current;
            setCount(Math.floor(elapsed / 10));
          }
        }, 85);
      })()
    : (pauseTimeRef.current = count * 10);

 return () => {
 {intervalRef.current && clearInterval(intervalRef.current) ,intervalRef.current=null}
  };
}, [running]);





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

      <div className="">
        <div className="flex flex-row justify-center my-3">
          <Label className=" text-4xl  text-start">{Math.floor(count / 100)}.</Label>
          <Label className=" text-4xl   text-center">{(count % 100).toString().padStart(2, "0")} s</Label>
        </div>

        {running ? (
          <div className="">
            <Button className="w-1/4 m-2" onClick={handleStartStop}>
              Stop
            </Button>
            <Button className="w-1/4 m-2" onClick={handleRecord}>
              Record
            </Button>
          </div>
        ) : count > 0 ? (
          <div className="">
            <Button className="w-1/4 m-2" onClick={handleStartStop}>
              Resume
            </Button>
            <Button className="w-1/4 m-2" onClick={handleReset}>
              Reset
            </Button>
          </div>
        ) : (
          <Button className="w-1/4 m-2" onClick={handleStartStop}>
            Start
          </Button>
        )}

        {records.length > 0 && (
          <Table className="table table-bordered mt-3">
            <TableHeader>
              <TableRow>
                <TableHead className="text-center w-[100px]">ردیف</TableHead>
                <TableHead className="text-center">زمان (ثانیه)</TableHead>
              </TableRow>
            </TableHeader>
            <tbody>
              {records.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium" >{r.id}</TableCell>
                  <TableCell>{r.time}</TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        )}
      </div>
    </div>
  );
}
