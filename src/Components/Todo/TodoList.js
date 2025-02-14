import { useState, useEffect } from "react";
import axios from "../../Services/api"; 
import { toast } from "react-toastify";
import UpdateTodoModal from "../Modals/UpdateTodoModal";
import { Table, Button } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";

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
            <Table striped bordered hover className="text-center">
                <thead className="table-dark">
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
                            <Button variant="warning" size="sm" className="me-2" onClick={() => handleEditClick(todo)}>
                                    <FaEdit />
                                </Button>
                                <Button variant="danger" size="sm" onClick={() => handleDeleteClick(todo)}>
                                    <FaTrash />
                                 </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

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