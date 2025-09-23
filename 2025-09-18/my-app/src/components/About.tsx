import React, { useState } from "react"
import {
  Box,
  Container,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
  Button,
  Stack,
  Paper,
  Divider,
} from "@mui/material"
import {
  Code as CodeIcon,
  Search as SearchIcon,
  School as SchoolIcon,
  MenuBook as BookIcon,
  SportsEsports as GamingIcon,
} from "@mui/icons-material"

function Information() {
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")

  const interests = [
    { text: "Full-Stack Developing", icon: <CodeIcon /> },
    { text: "Exploring something new", icon: <SearchIcon /> },
    { text: "Learning new technologies", icon: <SchoolIcon /> },
    { text: "Reading technical literature", icon: <BookIcon /> },
    { text: "Gaming", icon: <GamingIcon /> },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", { email, message })
  }

  return (
    <Container
      maxWidth="md"
      sx={{ display: "flex", justifyContent: "center" }}
    >
      <Box sx={{ py: 4 }}>
        <Box
          textAlign="center"
          mb={4}
        >
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
          >
            Nikita Vassiljev
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
          >
            Software Developer
          </Typography>
        </Box>

        <Stack spacing={4}>
          <Paper
            elevation={2}
            sx={{ p: 3 }}
          >
            <Typography
              variant="h5"
              component="h2"
              gutterBottom
            >
              My Interests & Hobbies
            </Typography>
            <List>
              {interests.map((interest, index) => (
                <ListItem
                  key={index}
                  disablePadding
                >
                  <ListItemIcon>{interest.icon}</ListItemIcon>
                  <ListItemText
                    primary={interest.text}
                    primaryTypographyProps={{ variant: "body1" }}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>

          <Paper
            elevation={2}
            sx={{ p: 3 }}
          >
            <Typography
              variant="h5"
              component="h2"
              gutterBottom
            >
              Get In Touch
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Box
              component="form"
              onSubmit={handleSubmit}
            >
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  variant="outlined"
                  required
                />

                <TextField
                  fullWidth
                  label="Your message"
                  multiline
                  rows={4}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Enter your message..."
                  variant="outlined"
                  required
                />

                <Box textAlign="center">
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    sx={{ px: 4, py: 1.5 }}
                  >
                    Send Message
                  </Button>
                </Box>
              </Stack>
            </Box>
          </Paper>
        </Stack>
      </Box>
    </Container>
  )
}

export default Information
