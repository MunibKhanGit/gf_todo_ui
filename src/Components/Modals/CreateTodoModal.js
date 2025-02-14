import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

function CreateTodoModal({ show, handleClose, onTodoCreated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleCreate = async () => {
    if (!title.trim() || !description.trim()) {
      alert("Title and Description are required!");
      return;
    }

    const newTodo = { title, description };
    const token = localStorage.getItem("token"); // Retrieve the token

    try {
      const response = await fetch("https://localhost:7014/api/Todo/Create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(newTodo),
      });

      if (response.ok) {
        const createdTodo = await response.json();
        onTodoCreated(createdTodo); // Update the list dynamically
        handleClose(); // Close modal
        setTitle("");
        setDescription("");
      } else {
        const errorMessage = await response.text();
        alert(`Failed to create task: ${errorMessage}`);
      }
    } catch (error) {
      console.error("Error creating task:", error);
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
