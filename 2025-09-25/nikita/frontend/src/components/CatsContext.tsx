import { Box, List, ListItem, Typography } from "@mui/material";
import React, { useEffect, useState, createContext, useContext } from "react";

type Cat = {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number | null;
  deleted: boolean;
};

const CatsContext = createContext<Cat[]>([]);

const CatsContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cats, setCats] = useState<Cat[]>([]);

  const fetchCats = async () => {
    const response = await fetch("http://localhost:3000/cats");
    const data = await response.json();
    setCats(data);
  };

  useEffect(() => {
    fetchCats();
  }, []);

  return <CatsContext.Provider value={cats}>{children}</CatsContext.Provider>;
};

const CatsList = () => {
  const cats = useContext(CatsContext);
  return (
    <List>
      {cats.map((cat) => (
        <ListItem key={cat.id}>{cat.name}</ListItem>
      ))}
    </List>
  );
};

const CatsWithContext = () => {
  return (
    <CatsContextProvider>
      <Box>
        <Typography variant="h1">Cats</Typography>
        <CatsList />
      </Box>
    </CatsContextProvider>
  );
};

export default CatsWithContext;
