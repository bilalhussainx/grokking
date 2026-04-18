"use client";

import { useState, useEffect, useCallback } from "react";
import { Calendar, Plus, Zap, Check, Circle, AlertTriangle, Trash2 } from "lucide-react";

interface Task {
  id: string;
  school_id: string | null;
  task_type: string;
  title: string;
  description: string | null;
  due_date: string | null;
  status: string;
  priority: number;
  completed_at: string | null;
  cc_schools: { name: string } | null;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function getMonthKey(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

function daysUntil(dateStr: string): number {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const due = new Date(dateStr + "T00:00:00");
  return Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export default function TimelinePage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDate, setNewDate] = useState("");

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/cc/timeline");
    if (res.ok) {
      const data = await res.json();
      setTasks(data.tasks || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleGenerate = async () => {
    setGenerating(true);
    await fetch("/api/cc/timeline/generate", { method: "POST" });
    await fetchTasks();
    setGenerating(false);
  };

  const handleToggle = async (task: Task) => {
    const newStatus = task.status === "completed" ? "pending" : "completed";
    await fetch("/api/cc/timeline/task", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: task.id, status: newStatus }),
    });
    fetchTasks();
  };

  const handleDelete = async (taskId: string) => {
    await fetch("/api/cc/timeline/task", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: taskId }),
    });
    fetchTasks();
  };

  const handleAddTask = async () => {
    if (!newTitle.trim()) return;
    await fetch("/api/cc/timeline/task", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTitle, due_date: newDate || null }),
    });
    setNewTitle("");
    setNewDate("");
    setShowAddForm(false);
    fetchTasks();
  };

  const pendingTasks = tasks.filter((t) => t.status !== "completed");
  const completedTasks = tasks.filter((t) => t.status === "completed");

  const overdue = pendingTasks.filter((t) => t.due_date && daysUntil(t.due_date) < 0);
  const upcoming = pendingTasks.filter((t) => !t.due_date || daysUntil(t.due_date) >= 0);

  const groupedByMonth = upcoming.reduce<Record<string, Task[]>>((acc, task) => {
    const key = task.due_date ? getMonthKey(task.due_date) : "No date";
    if (!acc[key]) acc[key] = [];
    acc[key].push(task);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#D4AF37]" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Calendar className="w-8 h-8 text-[#D4AF37]" />
          <div>
            <h1 className="text-xl font-bold text-white">Timeline</h1>
            <p className="text-sm text-white/40">{pendingTasks.length} pending task{pendingTasks.length !== 1 ? "s" : ""}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white/50 border border-white/10 hover:border-white/20 transition-all"
          >
            <Plus className="w-3.5 h-3.5" /> Add task
          </button>
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#D4AF37]/10 text-[#D4AF37] text-xs font-medium hover:bg-[#D4AF37]/20 disabled:opacity-50 transition-all"
          >
            <Zap className="w-3.5 h-3.5" />
            {generating ? "Generating..." : "From school list"}
          </button>
        </div>
      </div>

      {showAddForm && (
        <div className="mb-6 p-4 rounded-xl border border-white/10 bg-white/5">
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Task title..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
              className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-[#D4AF37]/50"
            />
            <input
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]/50"
            />
            <button
              onClick={handleAddTask}
              className="px-4 py-2 rounded-lg bg-[#D4AF37] text-black text-sm font-semibold hover:bg-[#C4A030] transition-all"
            >
              Add
            </button>
          </div>
        </div>
      )}

      {overdue.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <h2 className="text-sm font-semibold text-red-400">Overdue ({overdue.length})</h2>
          </div>
          <div className="grid gap-2">
            {overdue.map((task) => (
              <TaskRow key={task.id} task={task} onToggle={handleToggle} onDelete={handleDelete} />
            ))}
          </div>
        </div>
      )}

      {Object.entries(groupedByMonth).map(([month, monthTasks]) => (
        <div key={month} className="mb-6">
          <h2 className="text-sm font-semibold text-white/60 mb-3">{month}</h2>
          <div className="grid gap-2">
            {monthTasks.map((task) => (
              <TaskRow key={task.id} task={task} onToggle={handleToggle} onDelete={handleDelete} />
            ))}
          </div>
        </div>
      ))}

      {completedTasks.length > 0 && (
        <div className="mt-8 pt-6 border-t border-white/10">
          <h2 className="text-sm font-semibold text-white/30 mb-3">Completed ({completedTasks.length})</h2>
          <div className="grid gap-2 opacity-50">
            {completedTasks.slice(0, 10).map((task) => (
              <TaskRow key={task.id} task={task} onToggle={handleToggle} onDelete={handleDelete} />
            ))}
          </div>
        </div>
      )}

      {tasks.length === 0 && (
        <div className="text-center py-16">
          <p className="text-sm text-white/30 mb-4">No tasks yet.</p>
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="flex items-center gap-1.5 mx-auto px-4 py-2 rounded-xl bg-[#D4AF37] text-black text-sm font-semibold hover:bg-[#C4A030] disabled:opacity-50 transition-all"
          >
            <Zap className="w-4 h-4" />
            Generate from school list
          </button>
        </div>
      )}
    </div>
  );
}

function TaskRow({
  task,
  onToggle,
  onDelete,
}: {
  task: Task;
  onToggle: (task: Task) => void;
  onDelete: (id: string) => void;
}) {
  const isCompleted = task.status === "completed";
  const days = task.due_date ? daysUntil(task.due_date) : null;
  const isOverdue = days !== null && days < 0 && !isCompleted;
  const isDueSoon = days !== null && days >= 0 && days <= 7 && !isCompleted;

  return (
    <div className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
      isOverdue ? "border-red-500/20 bg-red-500/5" :
      isDueSoon ? "border-amber-500/20 bg-amber-500/5" :
      "border-white/10"
    }`}>
      <button
        onClick={() => onToggle(task)}
        className="shrink-0"
      >
        {isCompleted ? (
          <Check className="w-5 h-5 text-green-400" />
        ) : (
          <Circle className={`w-5 h-5 ${isOverdue ? "text-red-400" : "text-white/20"}`} />
        )}
      </button>

      <div className="flex-1 min-w-0">
        <p className={`text-sm ${isCompleted ? "line-through text-white/30" : "text-white"}`}>
          {task.title}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          {task.cc_schools && (
            <span className="text-[10px] text-white/30">{(task.cc_schools as { name: string }).name}</span>
          )}
          {task.due_date && (
            <span className={`text-[10px] ${isOverdue ? "text-red-400" : isDueSoon ? "text-amber-400" : "text-white/30"}`}>
              {formatDate(task.due_date)}
              {isOverdue && ` (${Math.abs(days!)}d overdue)`}
              {isDueSoon && days === 0 && " (today)"}
              {isDueSoon && days === 1 && " (tomorrow)"}
              {isDueSoon && days! > 1 && ` (${days}d)`}
            </span>
          )}
        </div>
      </div>

      <button
        onClick={() => onDelete(task.id)}
        className="shrink-0 p-1 text-white/10 hover:text-red-400 transition-colors"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
