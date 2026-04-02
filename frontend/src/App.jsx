import { useState } from 'react';
import EtherX from "./pages/EtherX";
import "./pages/EtherX.css";

function App() {
  const [error, setError] = useState(null);

  try {
    return (
      <div>
        <EtherX />
      </div>
    );
  } catch (err) {
    return (
      <div style={{ padding: '20px', color: 'red' }}>
        <h1>Error loading EtherX:</h1>
        <pre>{err.toString()}</pre>
      </div>
    );
  }
}

export default App;