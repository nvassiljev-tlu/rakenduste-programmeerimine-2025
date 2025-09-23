import { useLocalStorage } from "./hooks/useLocalStorage"
import "./App.css"
import { Button } from "@mui/material"
import { Link, Outlet } from "react-router-dom"
import { createTheme, ThemeProvider } from "@mui/material/styles"

function App() {
  const [count, setCount] = useLocalStorage<number>("counter", 0)

  const theme = createTheme({
    palette: {
      primary: {
        main: "#1976d2",
      },
    },
  })

  return (
    <ThemeProvider theme={theme}>
      <nav style={{ marginBottom: 20 }}>
        <Link
          to="/home"
          style={{ marginRight: 10 }}
        >
          Home
        </Link>
        <Link
          to="/something"
          style={{ marginRight: 10 }}
        >
          Something
        </Link>
        <Link to="/about">About</Link>
      </nav>
      <h1>Vite + React</h1>
      <div className="card">
        <Button
          variant="contained"
          onClick={() => setCount(count => count + 1)}
        >
          count is {count}
        </Button>
      </div>
      <Outlet />
    </ThemeProvider>
  )
}

export default App
