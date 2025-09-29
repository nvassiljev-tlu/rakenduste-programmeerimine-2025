const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");
const cats = [
  {
    id: "7d613b93-fa3e-4ef3-a9d2-e09e5ca6e4e6",
    name: "Meow",
    createdAt: 1727098800585,
    updatedAt: null,
    deleted: false,
  },
  {
    id: "2dc9ce08-d345-4fed-8560-4c6b66fb0836",
    name: "Kitty",
    createdAt: 1727098952739,
    updatedAt: null,
    deleted: false,
  },
];

exports.create = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { name } = req.body;
  const newCat = {
    id: uuidv4(),
    name,
    createdAt: Date.now(),
    updatedAt: null,
    deleted: false,
  };
  cats.push(newCat);
  res.status(201).json({ message: "Cat created", cat: newCat });
};

exports.read = (req, res) => {
  res.json(cats.filter((cat) => cat.deleted));
};

exports.update = (req, res) => {
  const { name } = req.params;
  const cat = cats.find((c) => c.name === name);
  if (cat) {
    Object.assign(cat, req.body);
    res.json({ message: "Cat updated" });
  } else {
    res.status(404).json({ message: "Cat not found" });
  }
};

exports.delete = (req, res) => {
  const { name } = req.params;
  const index = cats.findIndex((c) => c.name === name);
  if (index !== -1) {
    cats.splice(index, 1);
    res.json({ message: "Cat deleted" });
  } else {
    res.status(404).json({ message: "Cat not found" });
  }
};
