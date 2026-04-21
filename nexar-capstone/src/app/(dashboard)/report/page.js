"use client";

import { useEffect, useState } from "react";
import useAuthUser from "@/hooks/useAuth";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";

export default function ReportPage() {
  const user = useAuthUser();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchSessions = async () => {
      setLoading(true);
      try {
        const actualUid = user.uid || user.id;

        const q = query(
          collection(db, "focusSessions"),
          where("userId", "==", actualUid),
          orderBy("startedAt", "desc")
        );

        const snapshot = await getDocs(q);

        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setSessions(data);
      } catch (err) {
        console.error("Error fetching sessions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [user]);

  if (loading) {
    return <div className="p-6">Loading report...</div>;
  }

  if (sessions.length === 0) {
    return <div className="p-6">No focus data yet.</div>;
  }


  const totalMinutes = sessions.reduce(
    (sum, s) => sum + (s.actualDuration || 0),
    0
  );

  const completedSessions = sessions.filter(
    s => s.status === "completed"
  ).length;

  const completionRate = Math.round(
    (completedSessions / sessions.length) * 100
  );

  const avgSession = Math.round(
    totalMinutes / sessions.length
  );

  const taskBreakdown = {};
  sessions.forEach(s => {
    const key = s.title || "Unknown";
    if (!taskBreakdown[key]) taskBreakdown[key] = 0;
    taskBreakdown[key] += s.actualDuration || 0;
  });

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      
      <h1 className="text-3xl font-black">Focus Report</h1>

      {/* Overview */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-white rounded-2xl border">
          <p className="text-xs text-neutral-400">Total Focus</p>
          <p className="text-xl font-bold">{totalMinutes} mins</p>
        </div>

        <div className="p-4 bg-white rounded-2xl border">
          <p className="text-xs text-neutral-400">Completion Rate</p>
          <p className="text-xl font-bold">{completionRate}%</p>
        </div>

        <div className="p-4 bg-white rounded-2xl border">
          <p className="text-xs text-neutral-400">Sessions</p>
          <p className="text-xl font-bold">{sessions.length}</p>
        </div>

        <div className="p-4 bg-white rounded-2xl border">
          <p className="text-xs text-neutral-400">Avg Session</p>
          <p className="text-xl font-bold">{avgSession} mins</p>
        </div>
      </div>

      <div>
        <h2 className="text-sm font-bold mb-3">Time by Task</h2>
        <div className="space-y-2">
          {Object.entries(taskBreakdown).map(([task, mins]) => (
            <div
              key={task}
              className="flex justify-between p-3 bg-white rounded-xl border"
            >
              <span className="text-sm font-medium truncate">{task}</span>
              <span className="text-sm text-neutral-500">{mins} mins</span>
            </div>
          ))}
        </div>
      </div>

      
      <div>
        <h2 className="text-sm font-bold mb-3">Recent Sessions</h2>
        <div className="space-y-2">
          {sessions.slice(0, 10).map(s => (
            <div
              key={s.id}
              className="p-3 bg-white rounded-xl border flex justify-between"
            >
              <div>
                <p className="text-sm font-bold">
                  {s.title || "Focus Session"}
                </p>
                <p className="text-xs text-neutral-400">
                  {new Date(s.startedAt).toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold">
                  {s.actualDuration || 0}m
                </p>
                <p className={`text-xs ${
                  s.status === "completed"
                    ? "text-emerald-500"
                    : "text-rose-400"
                }`}>
                  {s.status}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}