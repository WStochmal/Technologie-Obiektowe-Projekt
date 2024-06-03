// libraries
import { BrowserRouter, Routes, Route } from "react-router-dom";

// layouts
import AppLayout from "./layouts/AppLayout.js";

// pages
import Editor from "./pages/app/Editor.jsx";
import Test from "./test/Test.js";

// styles
import "./styles/main.css";

import WorkspacePage from "./pages/app/Workspace.jsx";
import SigninPage from "./pages/auth/Signin.jsx";
import SignupPage from "./pages/auth/Signup.jsx";

function App() {
  // const { user } = useAuthContext();
  return (
    <main>
      <BrowserRouter>
        <Routes>
          <Route path="/test" element={<Test />} />{" "}
          <Route path="" element={<AppLayout />}>
            <Route path="editor/:id" element={<Editor />} />{" "}
            <Route path="auth/sign-in" element={<SigninPage />} />{" "}
            <Route path="auth/sign-up" element={<SignupPage />} />{" "}
            <Route path="workspace" element={<WorkspacePage />} />{" "}
          </Route>{" "}
        </Routes>{" "}
      </BrowserRouter>{" "}
    </main>
  );
}

export default App;
