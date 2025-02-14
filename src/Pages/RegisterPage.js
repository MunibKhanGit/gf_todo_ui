import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Container } from "react-bootstrap";
import axios from "../Services/api";
import { toast } from "react-toastify"; 

function RegisterPage() {
  const [username,setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!username.trim() || !email.trim() || !password.trim()) {
      toast.warning("All fields are required!"); // Show warning toast
      return;
    }
    try {
      await axios.post("/Auth/register", { name:username,email, password });
      navigate("/login");
      toast.success("Registered successfully! Please log in.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed!"); 
    }
  };

  return (
    <Container className="mt-4">
      <h2>Register</h2>
      <Form>
      <Form.Group className="mb-3">
        <Form.Label>Username</Form.Label>
            <Form.Control type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </Form.Group>
        <Button variant="primary" onClick={handleRegister}>Register</Button>
      </Form>
    </Container>
  );
}

export default RegisterPage;