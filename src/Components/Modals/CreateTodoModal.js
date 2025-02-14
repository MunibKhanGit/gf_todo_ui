import { useState } from "react";
import axios from "../../Services/api";
import { Modal, Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";

function CreateTodoModal({ show, handleClose, onTodoCreated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleCreate = async () => {
    if (!title.trim() || !description.trim()) {
          toast.error("Title and Description are required!");
        return;
    }

    const newTodo = { title, description };
    const token = localStorage.getItem("token"); // Retrieve the token

    try {
        const response = await axios.post("/Todo/Create", newTodo, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        toast.success("Task created successfully!");
        onTodoCreated(response.data); // Update the list dynamically
        handleClose(); // Close modal
        setTitle("");
        setDescription("");
    } catch (error) {
        console.error("Error creating task:", error.response?.data?.message || error.message);
        toast.error(`Failed to create task: ${error.response?.data?.message || error.message}`);
    }
};

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Create New Task</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter task description"
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleCreate}>
          Create
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default CreateTodoModal;
