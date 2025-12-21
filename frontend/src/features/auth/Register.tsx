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
    <div className="flex justify-center mt-24">
      <div className="w-[360px] bg-[#fdfaf6] border border-[#e6d8c8] rounded-xl shadow-sm p-6 overflow-hidden">
        <h1 className="text-2xl font-semibold text-[#4b2e1e] mb-1 text-center">
          Register
        </h1>
        <p className="text-sm text-[#7a5c44] mb-6 text-center">
          Create a new account
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            mutation.mutate();
          }}
          className="space-y-5"
        >
          <div>
            <label className="block text-sm mb-1 text-[#5a3b2a]">
              Name
            </label>
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-[#d6bfa8] px-3 py-2 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#b08968]"
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-[#5a3b2a]">
              Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-[#d6bfa8] px-3 py-2 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#b08968]"
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-[#5a3b2a]">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-[#d6bfa8] px-3 py-2 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#b08968]"
              required
            />
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={mutation.isPending}
              className="mt-2 bg-[#7a4a2e] text-white px-8 py-2 rounded-md hover:bg-[#633824] transition disabled:opacity-50"
            >
              {mutation.isPending ? "Registering..." : "Register"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
