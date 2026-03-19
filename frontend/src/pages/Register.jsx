import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import apiClient from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const response = await apiClient.post("/auth/register", formData);
      login(response.data);
      navigate("/");
    } catch (error) {
      const message =
        error?.response?.data?.message || "Register failed";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-glow flex items-center justify-center px-4">
      <div className="glass w-full max-w-md p-6">
        <h2 className="text-xl font-semibold">Create account</h2>
        <p className="text-white/60 text-sm mt-1">
          Start managing tasks in minutes.
        </p>

        {error && (
          <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-3">
          <div>
            <label className="text-xs text-white/60">Name</label>
            <input
              className="input mt-1"
              value={formData.name}
              onChange={handleChange("name")}
              placeholder="Ankit Kumar"
            />
          </div>

          <div>
            <label className="text-xs text-white/60">Email</label>
            <input
              className="input mt-1"
              value={formData.email}
              onChange={handleChange("email")}
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="text-xs text-white/60">
              Password (min 6)
            </label>
            <input
              className="input mt-1"
              type="password"
              value={formData.password}
              onChange={handleChange("password")}
              placeholder="••••••••"
            />
          </div>

          <button disabled={submitting} className="btn-primary w-full">
            {submitting ? "Creating..." : "Register"}
          </button>
        </form>

        <p className="text-sm text-white/60 mt-4">
          Already have an account?{" "}
          <Link className="text-white underline" to="/login">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}