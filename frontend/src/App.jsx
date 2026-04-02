import { useEffect } from "react";
import Editor from "./pages/Editor";

function App() {
  useEffect(() => {
    fetch("http://localhost:5000")
      .then(res => res.text())
      .then(data => console.log(data));
  }, []);

  return <Editor />;
}

export default App;