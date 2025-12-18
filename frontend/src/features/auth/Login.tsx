import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { login } from "./auth.api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const mutation = useMutation({
    mutationFn: () => login(email, password),
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      alert("Login successful");
    },
    onError: (error: any) => {
      alert(error.message);
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          mutation.mutate();
        }}
        className="bg-white p-6 rounded shadow w-80 space-y-4"
      >
        <h1 className="text-xl font-semibold">Login</h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          required
        />

        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50"
        >
          {mutation.isPending ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}

export default Login;
