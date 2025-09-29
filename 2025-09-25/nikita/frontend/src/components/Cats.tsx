import { Box, List, ListItem, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import SubmitCat from "./SubmitCat.tsx";

type Cat = {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number | null;
  deleted: boolean;
};

const Cats = () => {
  const [cats, setCats] = useState<Cat[]>([]);

  const fetchCats = async () => {
    const response = await fetch("http://localhost:3000/cats");
    const data = await response.json();

    setCats(data);
  };

  useEffect(() => {
    fetchCats();
  }, []);

  return (
    <Box>
      <Typography variant="h1">Cats</Typography>
      <CatsList cats={cats} />
      <SubmitCat fetchCats={fetchCats} />
    </Box>
  );
};

type CatsListProps = {
  cats: Cat[];
};

const CatsList: React.FC<CatsListProps> = ({ cats }) => {
  return (
    <List>
      {cats.map((cat) => (
        <ListItem key={cat.id}>{JSON.stringify(cat)}</ListItem>
      ))}
    </List>
  );
};

export default Cats;
