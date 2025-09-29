import { Box, List, ListItem, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";

type Cat = {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number | null;
  deleted: boolean;
};

const CatsPropDrilling = () => {
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
        <ListItem key={cat.id}>{cat.name}</ListItem>
      ))}
    </List>
  );
};

export default CatsPropDrilling;
