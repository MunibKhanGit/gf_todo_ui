import TodoList from "../Components/Todo/TodoList";
import CreateTodoModal from "../Components/Modals/CreateTodoModal";
import DeleteTodoModal from "../Components/Modals/DeleteTodoModal";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

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
        const response = await fetch("https://localhost:7014/api/Todo/GetAll",{
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        });
        if (response.ok) {
          const data = await response.json();
          setTodos(data);
        } else {
          const errorData = await response.json();
          console.error("Failed to fetch todos:", errorData.message);
          if (response.status === 401) {
            localStorage.removeItem("token"); // Remove token if expired
            alert("Session expired. Please log in again.");
            navigate("/login"); // Redirect to login page
          }
        }
      } catch (error) {
        console.error("Error fetching todos:", error);
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
          const response = await fetch(`https://localhost:7014/api/Todo/${selectedTodo.id}`, {
            method: "DELETE",
            headers: {
              "Authorization": `Bearer ${token}`, // Include token
              "Content-Type": "application/json",
            },
          });
    
          if (response.ok) {
            setTodos(todos.filter(todo => todo.id !== selectedTodo.id));
          } else {
            console.error("Failed to delete task");
          }
        } catch (error) {
          console.error("Error deleting task:", error);
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
              console.error("Invalid token:", error);
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
    <div className="container mt-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>TODO List</h2>
        {user ? (
                <div>
                    <span className="me-3">Welcome, {user}!</span>
                    <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
                </div>
            ) : (
                <div>
                    <button className="btn btn-secondary me-2" onClick={() => navigate("/login")}>Login</button>
                    <button className="btn btn-outline-secondary me-3" onClick={() => navigate("/register")}>Register</button>
                </div>
            )}
        <button className="btn btn-primary" onClick={handleCreateClick}>
          Create Task
        </button>
      </div>
      <CreateTodoModal show={showCreateModal} handleClose={()=>setShowCreateModal(false)} onTodoCreated={handleTodoCreated} />
      <DeleteTodoModal show={showDeleteModal} handleClose={() => setShowDeleteModal(false)} onConfirmDelete={handleConfirmDelete} todo={selectedTodo}/>
      <TodoList todos={todos} onDelete={handleDeleteClick} onUpdate={handleUpdate}/>
    </div>
  );
}

export default Home;