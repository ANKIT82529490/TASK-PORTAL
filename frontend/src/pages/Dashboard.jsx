import { useEffect, useMemo, useState } from "react";
import client from "../api/client";
import Topbar from "../components/Topbar";

function StatusPill({ status }) {
  const base = "badge";
  const variant =
    status === "Completed"
      ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-200"
      : "border-amber-400/30 bg-amber-400/10 text-amber-200";

  return <span className={`${base} ${variant}`}>{status}</span>;
}

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("All");
  const [form, setForm] = useState({ title: "", description: "", priority: "Medium" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const fetchTasks = async (currentFilter) => {
    const { data } = await client.get(`/tasks?status=${currentFilter}`);
    setTasks(data.tasks);
  };

  useEffect(() => {
    fetchTasks(filter);
  }, [filter]);

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.reduce((acc, t) => (t.status === "Completed" ? acc + 1 : acc), 0);
    return { total, completed, pending: total - completed };
  }, [tasks]);

  const onChangeField = (key) => (e) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const submitTask = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.title.trim()) {
      setError("Title is required");
      return;
    }

    setBusy(true);
    try {
      await client.post("/tasks", form);
      setForm({ title: "", description: "", priority: "Medium" });
      await fetchTasks(filter);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to add task");
    } finally {
      setBusy(false);
    }
  };

  const toggleStatus = async (id) => {
    await client.patch(`/tasks/${id}/toggle`);
    await fetchTasks(filter);
  };

  const deleteTask = async (id) => {
    await client.delete(`/tasks/${id}`);
    await fetchTasks(filter);
  };

  return (
    <div className="min-h-screen bg-glow">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <Topbar />

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="glass p-4">
            <div className="text-white/60 text-xs">Total</div>
            <div className="text-2xl font-bold mt-1">{stats.total}</div>
          </div>

          <div className="glass p-4">
            <div className="text-white/60 text-xs">Pending</div>
            <div className="text-2xl font-bold mt-1">{stats.pending}</div>
          </div>

          <div className="glass p-4">
            <div className="text-white/60 text-xs">Completed</div>
            <div className="text-2xl font-bold mt-1">{stats.completed}</div>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[360px,1fr]">
          <div className="glass p-5">
            <h3 className="font-semibold">Add Task</h3>
            <p className="text-white/60 text-sm mt-1">
              Title required, created time auto-generated.
            </p>

            {error && (
              <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={submitTask} className="mt-4 space-y-3">
              <div>
                <label className="text-xs text-white/60">Title *</label>
                <input
                  className="input mt-1"
                  value={form.title}
                  onChange={onChangeField("title")}
                  placeholder="e.g., Finish assignment"
                />
              </div>

              <div>
                <label className="text-xs text-white/60">Description</label>
                <textarea
                  className="input mt-1 min-h-[96px]"
                  value={form.description}
                  onChange={onChangeField("description")}
                  placeholder="Optional details..."
                />
              </div>

              <div>
                <label className="text-xs text-white/60">Priority</label>
                <select
                  className="input mt-1"
                  value={form.priority}
                  onChange={onChangeField("priority")}
                >
                  <option className="bg-blue-500">Low</option>
                  <option className="bg-blue-500">Medium</option>
                  <option className="bg-blue-500">High</option>
                </select>
              </div>

              <button disabled={busy} className="btn-primary w-full rounded-md">
                {busy ? "Adding..." : "Add Task"}
              </button>
            </form>
          </div>

          <div className="glass p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="font-semibold">Tasks</h3>
                <p className="text-white/60 text-sm">Filter and toggle status instantly.</p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-blue/60 px-2 py-1 rounded-md">Filter</span>
                <select
                  className="input !py-2 !px-3"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option className="bg-blue-500">All</option>
                  <option className="bg-blue-500">Pending</option>
                  <option className="bg-blue-500">Completed</option>
                </select>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {tasks.map((t) => (
                <div key={t._id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="font-semibold truncate">{t.title}</h4>
                        <StatusPill status={t.status} />
                        <span className="badge text-white/70">{t.priority}</span>
                      </div>

                      {t.description ? (
                        <p className="text-white/70 text-sm mt-2 whitespace-pre-wrap">
                          {t.description}
                        </p>
                      ) : (
                        <p className="text-white/40 text-sm mt-2">No description</p>
                      )}

                      <p className="text-white/50 text-xs mt-3">
                        Created: {new Date(t.createdAt).toLocaleString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button className="btn-ghost" onClick={() => toggleStatus(t._id)}>
                        {t.status === "Pending" ? "Mark Completed" : "Mark Pending"}
                      </button>
                      <button className="btn-ghost" onClick={() => deleteTask(t._id)}>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {tasks.length === 0 && (
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center text-white/60">
                  No tasks found for <span className="text-white">{filter}</span>.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}