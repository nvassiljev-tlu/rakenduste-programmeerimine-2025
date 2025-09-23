import {
  Box,
  Container,
  Typography,
  Paper,
  Card,
  CardContent,
} from "@mui/material"
import Grid from "@mui/material/Grid"

function About() {
  const stats = [
    { label: "Years of Experience", value: "3+" },
    { label: "Projects Completed", value: "15+" },
    { label: "Technologies Mastered", value: "10+" },
    { label: "Coffee Cups", value: "∞" },
  ]

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          textAlign="center"
        >
          About Me
        </Typography>

        <Paper
          elevation={2}
          sx={{ p: 3, mt: 3 }}
        >
          <Typography
            variant="body1"
            paragraph
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </Typography>

          <Typography
            variant="body1"
            paragraph
          >
            Duis aute irure dolor in reprehenderit in voluptate velit esse
            cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
            cupidatat non proident, sunt in culpa qui officia deserunt mollit
            anim id est laborum.
          </Typography>

          <Typography variant="body1">
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem
            accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
            quae ab illo inventore veritatis et quasi architecto beatae vitae
            dicta sunt explicabo.
          </Typography>
        </Paper>

        <Grid
          container
          spacing={2}
          sx={{ mt: 3 }}
        >
          {stats.map((stat, index) => (
            <Grid
              item
              xs={6}
              sm={3}
              key={index}
            >
              <Card elevation={1}>
                <CardContent sx={{ textAlign: "center" }}>
                  <Typography
                    variant="h4"
                    color="primary"
                    gutterBottom
                  >
                    {stat.value}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    {stat.label}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  )
}

export default About
