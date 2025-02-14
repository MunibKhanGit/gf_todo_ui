import TodoList from "../Components/Todo/TodoList";
import CreateTodoModal from "../Components/Modals/CreateTodoModal";
import DeleteTodoModal from "../Components/Modals/DeleteTodoModal";
import axios from "../Services/api";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { Navbar, Nav, Button, Container } from "react-bootstrap";


function Home() {
    const [todos, setTodos] = useState([]);
    const [selectedTodo, setSelectedTodo] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [user, setUser] = useState(null);
    const [todoToDelete, setTodoToDelete] = useState(null);
    const navigate = useNavigate();
  
    useEffect(() => {
      fetchTodos();
      checkUserAuth();
    }, []);

    const fetchTodos = async () => {
      const token = localStorage.getItem("token");
      try {
          const response = await axios.get("https://localhost:7014/api/Todo/GetAll", {
              headers: {
                  Authorization: `Bearer ${token}`,
              },
          });
          setTodos(response.data);
      } catch (error) {
          console.error("Error fetching todos:", error.response?.data?.message || error.message);
          if (error.response?.status === 401) {
              localStorage.removeItem("token"); // Remove token if expired
              toast.error("Session expired. Please log in again.");
              navigate("/login"); // Redirect to login page
          }
      }
  };

    const handleTodoCreated = (newTodo) => {
        setTodos([...todos, newTodo]); // Add new task without refreshing
        fetchTodos();
      };

      const handleDeleteClick = (todo) => {
        setSelectedTodo(todo);
        setShowDeleteModal(true);
      };
    
      const handleConfirmDelete = async () => {
        if (!selectedTodo) return;
        const token = localStorage.getItem("token");
    
        try {
            await axios.delete(`https://localhost:7014/api/Todo/${selectedTodo.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setTodos((prevTodos) => prevTodos.filter(todo => todo.id !== selectedTodo.id));
            toast.success("Task deleted successfully!");
        } catch (error) {
            toast.error("Error deleting task:", error.response?.data?.message || error.message);
        }
    
        setShowDeleteModal(false);
        setSelectedTodo(null);
    };

      const handleUpdate = (updatedTodo) => {
        setTodos((prevTodos) =>
          prevTodos.map((todo) => (todo.id === updatedTodo.id ? updatedTodo : todo))
        );
      };

      const handleCreateClick = () => {
        const token = localStorage.getItem("token");
        if (!token) {
            toast.warning("Please log in to create a task!"); // Show warning
            return;
        }
        setShowCreateModal(true); // Open modal if authenticated
    };

    const checkUserAuth = () => {
      const token = localStorage.getItem("token");
      if (token) {
          try {
              const decoded = jwtDecode(token);
              const username = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
              setUser(username);
          } catch (error) {
              toast.error("Invalid token:", error);
              setUser(null);
          }
      } else {
          setUser(null);
      }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    toast.success("Logged out successfully!");
    navigate("/"); // Redirect to home
};
    
  return (
    <Container className="mt-3">
    {/* Navbar */}
    <Navbar bg="light" expand="lg" className="mb-3">
        <Container>
            <Navbar.Brand>TODO App</Navbar.Brand>
            <Nav className="ms-auto">
                {user ? (
                    <>
                        <span className="me-3">Welcome, {user}!</span>
                        <Button variant="danger" onClick={handleLogout}>Logout</Button>
                    </>
                ) : (
                    <>
                        <Button variant="secondary" className="me-2" onClick={() => navigate("/login")}>Login</Button>
                        <Button variant="outline-secondary" onClick={() => navigate("/register")}>Register</Button>
                    </>
                )}
            </Nav>
        </Container>
    </Navbar>

    {/* Create Task Button */}
    <div className="d-flex justify-content-between align-items-center mb-3">
      <div className="px-3 py-2 bg-light border rounded">
        <h5 className="mb-0 text-secondary">Total Tasks: {todos.length}</h5>
      </div>
        <Button variant="primary" onClick={handleCreateClick}>Create Task</Button>
    </div>

    {/* Centered Table */}
    <div className="d-flex justify-content-center">
        <div className="w-100">
        <TodoList todos={todos} onDelete={handleDeleteClick} onUpdate={handleUpdate}/>
        </div>
    </div>

    <CreateTodoModal show={showCreateModal} handleClose={()=>setShowCreateModal(false)} onTodoCreated={handleTodoCreated} />
    <DeleteTodoModal show={showDeleteModal} handleClose={() => setShowDeleteModal(false)} onConfirmDelete={handleConfirmDelete} todo={selectedTodo}/>
</Container>
  );
}

export default Home;