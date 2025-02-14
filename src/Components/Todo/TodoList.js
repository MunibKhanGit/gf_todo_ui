import { useState, useEffect } from "react";
import axios from "../../Services/api"; 
import { toast } from "react-toastify";
import UpdateTodoModal from "../Modals/UpdateTodoModal";

function TodoList({todos,onDelete,onUpdate}) {
    const [selectedTodo, setSelectedTodo] = useState(null); // Store todo for editing
    const [showUpdateModal, setShowUpdateModal] = useState(false); // Modal visibility

    // Check if the user is authenticated
    const isAuthenticated = !!localStorage.getItem("token");
  
    const handleEditClick = (todo) => {
        if (!isAuthenticated) {
            toast.error("You must be logged in to update a task!");
            return;
        }
      setSelectedTodo(todo); // Set selected todo
      setShowUpdateModal(true); // Show modal
    };

    const handleDeleteClick = (todo) => {
        if (!isAuthenticated) {
          toast.error("You must be logged in to delete a task!");
          return;
        }
        onDelete(todo);
    };
  return (
    <>
    <table className="table">
      <thead>
        <tr>
          <th>Title</th>
          <th>Description</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {todos.map((todo) => (
          <tr key={todo.id}>
            <td>{todo.title}</td>
            <td>{todo.description}</td>
            <td>
              <button className="btn btn-warning btn-sm me-2" onClick={() => handleEditClick(todo)}>Update</button>
              <button className="btn btn-danger btn-sm" onClick={() => handleDeleteClick(todo)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>

    {/* Update Modal */}
    {showUpdateModal && (
      <UpdateTodoModal
        todo={selectedTodo}
        onClose={() => setShowUpdateModal(false)}
        onUpdate={onUpdate}
      />
    )}
  </>
 );
}

export default TodoList;