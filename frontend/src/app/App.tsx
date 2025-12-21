import { RouterProvider } from "react-router-dom";
import { router } from "./router";

function App() {
  return (
    <div className="bg-gray-50 text-gray-900">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <RouterProvider router={router} />
      </div>
    </div>
  );
}

export default App;
