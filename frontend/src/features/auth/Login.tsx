import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { login } from "./auth.api";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: () => login(email, password),
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      alert("Login successful");
      navigate("/dashboard");
    },
    onError: (error: any) => {
      alert(error.message);
    },
  });

  return (
    <div className="flex justify-center mt-24 px-4">
      <div className="w-[360px] rounded-3xl bg-[#f3ede6] p-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_20px_40px_rgba(0,0,0,0.15)]">
        
        <h1 className="text-xl font-semibold text-[#3b2417] mb-2">
          Welcome back
        </h1>
        <p className="text-sm text-[#7a5c44] mb-8">
          Log in to continue
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            mutation.mutate();
          }}
          className="space-y-6"
        >
          {/* Email */}
          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="
                peer w-full rounded-xl
                bg-[#efe6db]
                px-4 pt-5 pb-2
                text-sm text-[#3b2417]
                shadow-inner
                focus:outline-none focus:ring-2 focus:ring-[#b08968]
              "
              required
            />
            <label
              className="
                absolute left-4 top-2
                text-xs text-[#6b4b38]
                transition-all
                peer-placeholder-shown:top-4
                peer-placeholder-shown:text-sm
              "
            >
              Email
            </label>
          </div>

          {/* Password */}
          <div className="relative">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="
                peer w-full rounded-xl
                bg-[#efe6db]
                px-4 pt-5 pb-2
                text-sm text-[#3b2417]
                shadow-inner
                focus:outline-none focus:ring-2 focus:ring-[#b08968]
              "
              required
            />
            <label
              className="
                absolute left-4 top-2
                text-xs text-[#6b4b38]
                transition-all
                peer-placeholder-shown:top-4
                peer-placeholder-shown:text-sm
              "
            >
              Password
            </label>
          </div>

          {/* CTA */}
          <button
            type="submit"
            disabled={mutation.isPending}
            className="
              w-full rounded-xl
              bg-[#3b2417]
              py-3
              text-sm font-medium text-[#fdfaf6]
              shadow-lg
              hover:translate-y-[-1px]
              transition
              disabled:opacity-50
            "
          >
            {mutation.isPending ? "Logging in…" : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
