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

console.error('See on error!');
console.warn('See on hoiatus!');
console.info('See on info!');

console.table([
  { nimi: 'Mari', vanus: 20 },
  { nimi: 'Jüri', vanus: 25 }
]);

console.time('aeg');
setTimeout(() => {
  console.timeEnd('aeg');

  console.assert(1 === 2, 'Väide on vale!');

  console.group('Minu grupp');
  console.log('Esimene');
  console.log('Teine');
  console.groupEnd();

  console.count('loendur');
  console.count('loendur');
  console.count('teine');
}, 100);