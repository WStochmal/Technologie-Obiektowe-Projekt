// libraries
import { BrowserRouter, Routes, Route } from "react-router-dom";

// layouts
import AppLayout from "./layouts/AppLayout";

// pages
import Editor from "./pages/app/Editor";
import Test from "./test/Test";

// styles
import "./styles/main.css";
import LoginPage from "./pages/auth/Login";
import WorkspacePage from "./pages/app/Workspace";

function App() {
  // const { user } = useAuthContext();
  return (
    <main>
      <BrowserRouter>
        <Routes>
          <Route path="/test" element={<Test />} />{" "}
          <Route path="" element={<AppLayout />}>
            <Route path="editor/:id" element={<Editor />} />{" "}
            <Route path="auth/login" element={<LoginPage />} />{" "}
            <Route path="workspace" element={<WorkspacePage />} />{" "}
          </Route>{" "}
        </Routes>{" "}
      </BrowserRouter>{" "}
    </main>
  );
}

export default App;
