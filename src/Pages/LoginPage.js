import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Container } from "react-bootstrap";
import axios from "../Services/api";
import { toast } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      toast.warning("Email or Password cannot be empty!"); 
      return;
    }

    try {
      const response = await axios.post("https://localhost:7014/api/Auth/login", { email, password });
      localStorage.setItem("token", response.data.token);
      toast.success("Login successful!");
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid email or password!");
    }
  };

  return (
    <Container className="mt-4">
      <h2>Login</h2>
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </Form.Group>
        <Button variant="primary" onClick={handleLogin}>Login</Button>
      </Form>
    </Container>
  );
}

export default LoginPage;