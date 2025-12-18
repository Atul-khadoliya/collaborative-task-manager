import { RouterProvider } from "react-router-dom";
import { router } from "./router";

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <main className="p-6">
        <RouterProvider router={router} />
      </main>
    </div>
  );
}

export default App;
