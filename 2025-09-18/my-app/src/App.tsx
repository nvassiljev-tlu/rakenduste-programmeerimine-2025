import { useState } from "react";
import "./App.css";
import { Button } from "@mui/material";
import { Link, Outlet } from "react-router-dom";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <nav style={{ marginBottom: 20 }}>
        <Link to="/home" style={{ marginRight: 10 }}>
          Home
        </Link>
        <Link to="/something" style={{ marginRight: 10 }}>
          Something
        </Link>
        <Link to="/about">About</Link>
      </nav>
      <h1>Vite + React</h1>
      <div className="card">
        <Button
          variant="contained"
          onClick={() => setCount((count) => count + 1)}
        >
          count is {count}
        </Button>
      </div>
      <Outlet />
    </>
  );
}

export default App;
