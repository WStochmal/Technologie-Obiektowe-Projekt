// libraries
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// layouts
import AppLayout from "./layouts/AppLayout";

// pages
import Editor from "./pages/app/Editor";
import Test from "./test/Test";

// styles
import "./styles/main.css";

function App() {
  // const { user } = useAuthContext();
  return (
    <main>
      <BrowserRouter>
        <Routes>
          <Route path="/test" element={<Test />} />
          <Route path="" element={<AppLayout />}>
            <Route path="editor/:id" element={<Editor />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </main>
  );
}

export default App;
