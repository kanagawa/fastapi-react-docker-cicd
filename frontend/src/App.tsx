import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [data, setData] = useState<{ message: string } | null>(null);

  useEffect(() => {
    fetch("http://localhost:8000/api/health")
      .then((res) => res.json())
      .then(setData)
      .catch(console.error);
  }, []);

  return (
    <div className="App">
      <h1>Fullstack CI/CD Lab</h1>
      <p>Backend Status: {data ? data.message : "Connecting..."}</p>
    </div>
  );
}

export default App;
