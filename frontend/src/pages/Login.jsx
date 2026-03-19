import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import apiClient from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    setCredentials((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const response = await apiClient.post("/auth/login", credentials);
      login(response.data);
      navigate("/");
    } catch (error) {
      const message =
        error?.response?.data?.message || "Login failed";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-glow flex items-center justify-center px-4">
      <div className="glass w-full max-w-md p-6">
        <h2 className="text-xl font-semibold">Sign in</h2>
        <p className="text-white/60 text-sm mt-1">
          Access your tasks securely.
        </p>

        {error && (
          <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-3">
          <div>
            <label className="text-xs text-white/60">Email</label>
            <input
              className="input mt-1"
              value={credentials.email}
              onChange={handleChange("email")}
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="text-xs text-white/60">Password</label>
            <input
              className="input mt-1"
              type="password"
              value={credentials.password}
              onChange={handleChange("password")}
              placeholder="••••••••"
            />
          </div>

          <button disabled={submitting} className="btn-primary w-full">
            {submitting ? "Signing in..." : "Login"}
          </button>
        </form>

        <p className="text-sm text-white/60 mt-4">
          New here?{" "}
          <Link className="text-white underline" to="/register">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}