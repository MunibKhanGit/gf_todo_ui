import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "../../Services/api";

function UpdateTodoModal({ todo, onClose, onUpdate }) {
  const [title, setTitle] = useState(todo.title || "");
  const [description, setDescription] = useState(todo.description || "");

  const handleUpdate = async () => {
    const token = localStorage.getItem("token");
    try {
      const updatedTodo = { ...todo, title, description };

      await axios.put(`https://localhost:7014/api/Todo/${todo.id}`, updatedTodo,{
        headers: {
          "Authorization": `Bearer ${token}`, // Include token
          "Content-Type": "application/json",
        },
      }); // Update API call

      onUpdate(updatedTodo); 
      onClose(); 
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  return (
    <Modal show onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Update Todo</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button variant="primary" onClick={handleUpdate}>Update</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default UpdateTodoModal;