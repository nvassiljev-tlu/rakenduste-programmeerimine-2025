import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  List,
  ListItem,
  Stack,
} from "@mui/material";

const API = "http://localhost:3000";

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch(`${API}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("token_exp", String(Date.now() + 3600 * 1000));
        localStorage.setItem("isAdmin", data.isAdmin ? "1" : "0");
        onLogin();
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setError("Login error");
    }
  };

  return (
    <Box sx={{ maxWidth: 300, mx: "auto", mt: 8 }}>
      <Typography variant="h5">Login</Typography>
      <form onSubmit={handleSubmit}>
        <Stack spacing={2} mt={2}>
          <TextField
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" variant="contained">
            Login
          </Button>
          {error && <Typography color="error">{error}</Typography>}
        </Stack>
      </form>
    </Box>
  );
};

interface Todo {
  id: string | number;
  text: string;
  deleted?: boolean;
}

const TodoPanel = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");
  const isAdmin = localStorage.getItem("isAdmin") === "1";

  const fetchTodos = async () => {
    setError("");
    try {
      const res = await fetch(`${API}/todos`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setTodos(data);
    } catch (err) {
      setError("Failed to fetch todos");
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch(`${API}/todos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text }),
      });
      if (res.ok) {
        setText("");
        fetchTodos();
      } else {
        const data = await res.json();
        setError(data.message || "Add failed");
      }
    } catch (err) {
      setError("Add error");
    }
  };

  const markDone = async (id: string | number) => {
    setError("");
    try {
      const res = await fetch(`${API}/todos/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        fetchTodos();
      } else {
        const data = await res.json();
        setError(data.message || "Delete failed");
      }
    } catch (err) {
      setError("Delete error");
    }
  };

  const restoreTodo = async (id: string | number) => {
    setError("");
    try {
      const res = await fetch(`${API}/todos/${id}/restore`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        fetchTodos();
      } else {
        const data = await res.json();
        setError(data.message || "Restore failed");
      }
    } catch (err) {
      setError("Restore error");
    }
  };

  return (
    <Box sx={{ maxWidth: 500, mx: "auto", mt: 4 }}>
      <Typography variant="h4">TODO Panel</Typography>
      <form onSubmit={addTodo}>
        <Stack direction="row" spacing={2} mt={2}>
          <TextField
            label="New todo"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <Button type="submit" variant="contained">
            Add
          </Button>
        </Stack>
      </form>
      {error && <Typography color="error">{error}</Typography>}
      <List>
        {todos.map((todo) => (
          <ListItem
            key={todo.id}
            secondaryAction={
              (!todo.deleted && !isAdmin && (
                <Button
                  color="success"
                  variant="outlined"
                  size="small"
                  onClick={() => markDone(todo.id)}
                >
                  Mark as done
                </Button>
              )) ||
              (isAdmin && todo.deleted && (
                <Button
                  color="warning"
                  variant="outlined"
                  size="small"
                  onClick={() => restoreTodo(todo.id)}
                >
                  Restore
                </Button>
              ))
            }
          >
            {JSON.stringify(todo)}
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

const TodoApp = () => {
  const [loggedIn, setLoggedIn] = useState(() => {
    const token = localStorage.getItem("token");
    const exp = localStorage.getItem("token_exp");
    return token && exp && Date.now() < Number(exp);
  });

  const handleLogin = () => setLoggedIn(true);

  if (!loggedIn) return <Login onLogin={handleLogin} />;
  return <TodoPanel />;
};

export default TodoApp;
