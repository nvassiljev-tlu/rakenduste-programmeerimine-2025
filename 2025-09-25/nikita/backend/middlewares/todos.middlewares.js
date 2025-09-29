const jwt = require("jsonwebtoken");

const users = [
  { id: "1", username: "user", password: "user", role: "user" },
  { id: "2", username: "admin", password: "admin", role: "admin" },
];

exports.login = (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ message: "Username and password required" });
  const user = users.find(
    (u) => u.username === username && u.password === password
  );
  if (!user) return res.status(401).json({ message: "Invalid credentials" });
  const token = jwt.sign({ id: user.id, role: user.role }, "SECRET", {
    expiresIn: "1h",
  });
  res.json({ token, isAdmin: user.role === "admin" });
};

exports.authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "No token" });
  const token = authHeader.split(" ")[1];
  jwt.verify(token, "SECRET", (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = user;
    next();
  });
};

exports.requireAdmin = (req, res, next) => {
  if (req.user.role !== "admin")
    return res.status(403).json({ message: "Admin only" });
  next();
};
