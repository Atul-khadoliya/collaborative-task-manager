import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { register } from "./auth.api";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const mutation = useMutation({
    mutationFn: () => register(name, email, password),
    onSuccess: () => {
      alert("Registration successful. Please login.");
      navigate("/login");
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
        <h1 className="text-xl font-semibold">Register</h1>

        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          required
        />

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
          {mutation.isPending ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
}

export default Register;
