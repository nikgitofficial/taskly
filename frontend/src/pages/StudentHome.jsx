import React, { useEffect, useState, useRef } from "react";
import axios from "../api/axios";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  TableContainer,
  IconButton,
  Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const categories = ["Assignment", "Task", "Event", "Todo"];

const StudentHome = () => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    date: "",
    file: null,
  });
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const fileInputRef = useRef();

  const fetchEntries = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/student-entries", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("📦 Entries fetched:", res.data);
      setEntries(res.data);
    } catch (err) {
      console.error("❌ Failed to fetch entries:", err?.response || err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "file") {
      setForm((prev) => ({ ...prev, file: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("category", form.category);
    formData.append("date", form.date);
    if (form.file) formData.append("file", form.file);

    try {
      if (editingId) {
        await axios.put(`/student-entries/${editingId}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        await axios.post("/student-entries", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      }
      fetchEntries();
      handleClose();
    } catch (err) {
      alert("Failed to submit entry");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this entry?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/student-entries/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEntries((prev) => prev.filter((e) => e._id !== id));
    } catch {
      alert("Failed to delete entry");
    }
  };

  const handleToggleDone = async (entry) => {
    try {
      const token = localStorage.getItem("token");
      const updated = { ...entry, done: !entry.done };
      await axios.put(`/student-entries/${entry._id}`, updated, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEntries((prev) =>
        prev.map((e) => (e._id === entry._id ? { ...e, done: !e.done } : e))
      );
    } catch {
      alert("Failed to update status");
    }
  };

  const handleEdit = (entry) => {
    setForm({
      title: entry.title,
      description: entry.description,
      category: entry.category,
      date: entry.date?.slice(0, 10),
      file: null,
    });
    setEditingId(entry._id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingId(null);
    setForm({ title: "", description: "", category: "", date: "", file: null });
    if (fileInputRef.current) fileInputRef.current.value = null;
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Student Home
      </Typography>

      <Button variant="contained" onClick={() => setOpen(true)}>
        + Create New Entry
      </Button>

     <TableContainer component={Paper} elevation={3} sx={{ mt: 3, borderRadius: 3 }}>
  <Table stickyHeader>
    <TableHead sx={{ backgroundColor: "#e3f2fd" }}>
      <TableRow sx={{ backgroundColor: "#1976d2" }}>
        {["Title", "Category", "Posted", "Due", "File", "Status", "Actions"].map((head) => (
          <TableCell key={head} sx={{ color: "black", fontWeight: "bold" }}>
            {head}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
    <TableBody>
      {loading ? (
        <TableRow>
          <TableCell colSpan={7} align="center">
            <Typography variant="body2" color="text.secondary">
              Loading...
            </Typography>
          </TableCell>
        </TableRow>
      ) : entries.length === 0 ? (
        <TableRow>
          <TableCell colSpan={7} align="center">
            <Typography variant="body2" color="text.secondary">
              No entries found.
            </Typography>
          </TableCell>
        </TableRow>
      ) : (
        entries.map((entry, index) => (
          <TableRow
            key={entry._id}
            sx={{
              backgroundColor: index % 2 === 0 ? "#fafafa" : "#fff",
              transition: "background-color 0.3s",
              "&:hover": { backgroundColor: "#f1f1f1" },
            }}
          >
            <TableCell>{entry.title}</TableCell>
            <TableCell>{entry.category}</TableCell>
            <TableCell>{new Date(entry.createdAt).toLocaleDateString()}</TableCell>
            <TableCell>{new Date(entry.date).toLocaleDateString()}</TableCell>
            <TableCell>
              {entry.fileUrl ? (
                <a
                  href={entry.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: "none", color: "#1976d2", fontWeight: 500 }}
                >
                  📎 {entry.fileName || "View File"}
                </a>
              ) : (
                "—"
              )}
            </TableCell>
            <TableCell>
              <Typography
                variant="body2"
                sx={{
                  display: "inline-block",
                  px: 1.5,
                  py: 0.5,
                  borderRadius: "8px",
                  fontSize: "0.75rem",
                  fontWeight: "bold",
                  backgroundColor: entry.done ? "#c8e6c9" : "#ffe0b2",
                  color: entry.done ? "#2e7d32" : "#e65100",
                }}
              >
                {entry.done ? "Done" : "Pending"}
              </Typography>
            </TableCell>
            <TableCell>
              <Tooltip title={entry.done ? "Mark as Undone" : "Mark as Done"}>
                <IconButton
                  onClick={() => handleToggleDone(entry)}
                  color={entry.done ? "warning" : "success"}
                >
                  <CheckCircleIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Edit">
                <IconButton onClick={() => handleEdit(entry)} color="primary">
                  <EditIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete">
                <IconButton onClick={() => handleDelete(entry._id)} color="error">
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </TableCell>
          </TableRow>
        ))
      )}
    </TableBody>
  </Table>
</TableContainer>

    

      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>{editingId ? "Edit Entry" : "Create New Entry"}</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} mt={1}>
            <TextField
              label="Title"
              name="title"
              value={form.title}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Description"
              name="description"
              value={form.description}
              onChange={handleChange}
              fullWidth
              margin="normal"
              multiline
              rows={3}
              required
            />
            <TextField
              label="Category"
              name="category"
              value={form.category}
              onChange={handleChange}
              select
              fullWidth
              margin="normal"
              required
            >
              {categories.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Date"
              name="date"
              type="date"
              value={form.date}
              onChange={handleChange}
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
              required
            />
            <input
              type="file"
              name="file"
              ref={fileInputRef}
              onChange={handleChange}
              accept="*/*"
              style={{ marginTop: "16px" }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingId ? "Update" : "Submit"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StudentHome;
