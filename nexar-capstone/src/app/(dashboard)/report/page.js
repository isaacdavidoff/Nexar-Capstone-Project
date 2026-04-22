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

        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
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
    (s) => s.status === "completed"
  ).length;

  const completionRate = Math.round(
    (completedSessions / sessions.length) * 100
  );

  const avgSession = Math.round(totalMinutes / sessions.length);

  const taskBreakdown = {};
  sessions.forEach((s) => {
    const key = s.title || "Unknown";
    if (!taskBreakdown[key]) taskBreakdown[key] = 0;
    taskBreakdown[key] += s.actualDuration || 0;
  });

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-black">Focus Report</h1>

      {/* Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-6 bg-indigo-600 rounded-[2rem] text-white shadow-lg shadow-indigo-200">
          <p className="text-[10px] font-black uppercase opacity-70">
            Total Focus
          </p>
          <p className="text-2xl font-black">
            {totalMinutes}
            <span className="text-sm ml-1 opacity-80">m</span>
          </p>
        </div>

        <div className="p-6 bg-white rounded-[2rem] border border-neutral-200">
          <p className="text-[10px] font-black uppercase text-neutral-400">
            Success
          </p>
          <p className="text-2xl font-black text-neutral-900">
            {completionRate}%
          </p>
        </div>

        <div className="p-6 bg-white rounded-[2rem] border border-neutral-200">
          <p className="text-[10px] font-black uppercase text-neutral-400">Sessions</p>
          <p className="text-xl font-bold">{sessions.length}</p>
        </div>

        <div className="p-6 bg-white rounded-[2rem] border border-neutral-200">
          <p className="text-[10px] font-black uppercase text-neutral-400">Avg Session</p>
          <p className="text-xl font-bold">{avgSession} mins</p>
        </div>
      </div>

      {/* Updated Time by Task Section */}
      <div>
        <h2 className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-4 ml-1">
          Time Distribution
        </h2>
        <div className="space-y-3">
          {Object.entries(taskBreakdown).map(([task, mins]) => {
            const percentage = Math.round((mins / totalMinutes) * 100);
            return (
              <div
                key={task}
                className="bg-white p-4 rounded-2xl border border-neutral-100 shadow-sm"
              >
                <div className="flex justify-between items-end mb-2">
                  <div>
                    <p className="text-xs font-black text-indigo-600 uppercase tracking-tighter">
                      {percentage}%
                    </p>
                    <p className="text-sm font-bold text-neutral-800 truncate">
                      {task}
                    </p>
                  </div>
                  <span className="text-sm font-black text-neutral-900">
                    {mins}m
                  </span>
                </div>
                {/* Simple CSS Progress Bar */}
                <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 rounded-full transition-all duration-1000"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <h2 className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-3">Recent Sessions</h2>
        <div className="space-y-2">
          {sessions.slice(0, 10).map((s) => (
            <div
              key={s.id}
              className="bg-white p-4 rounded-2xl border border-neutral-100 shadow-sm flex justify-between items-center"
            >
              <div>
                <p className="text-sm font-bold">
                  {s.title || "Focus Session"}
                </p>
                <p className="text-xs text-neutral-400">
                {s.startedAt?.toDate ? s.startedAt.toDate().toLocaleString() : new Date(s.startedAt).toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold">{s.actualDuration || 0}m</p>
                <p
                  className={`text-xs ${
                    s.status === "completed"
                      ? "text-emerald-500"
                      : "text-rose-400"
                  }`}
                >
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
