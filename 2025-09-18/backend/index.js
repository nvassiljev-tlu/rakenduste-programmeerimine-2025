const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use(express.json());

app.get('/items', (req, res) => {
  res.json({ items: ['item1', 'item2'] });
});

app.post('/items', (req, res) => {
  const item = req.body;
  res.status(201).json({ message: 'Item created', item });
});

app.get('/items/:id', (req, res) => {
  const { id } = req.params;
  res.json({ item: { id, name: `Item ${id}` } });
});

app.put('/items/:id', (req, res) => {
  const { id } = req.params;
  const updatedItem = req.body;
  res.json({ message: `Item ${id} updated`, item: updatedItem });
});

app.delete('/items/:id', (req, res) => {
  const { id } = req.params;
  res.json({ message: `Item ${id} deleted` });
});

app.get('/users/:userId/books/:bookId', (req, res) => {
  const { userId, bookId } = req.params;
  res.send(`User ID: ${userId}, Book ID: ${bookId}`);
});

app.get('/flights/:from-:to', (req, res) => {
  const { from, to } = req.params;
  res.send(`Flight from ${from} to ${to}`);
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});