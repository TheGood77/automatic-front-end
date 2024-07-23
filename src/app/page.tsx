"use client";

import { useRouter } from "next/navigation";
import { Container, Typography, Button, Box } from "@mui/material";

export default function Home() {
  const router = useRouter();

  return (
    <Container maxWidth="sm">
      <Box mt={4} p={3} boxShadow={3} borderRadius={2} textAlign="center">
        <Typography variant="h4" component="h1" gutterBottom>
          Login
        </Typography>
        <Box mt={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => router.push("/admin")}
            fullWidth
          >
            Login as Admin
          </Button>
        </Box>
        <Box mt={2}>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => router.push("/user")}
            fullWidth
          >
            Login as User
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
