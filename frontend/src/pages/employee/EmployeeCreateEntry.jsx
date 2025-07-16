// EmployeeTaskManager.jsx
import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import {
  Box, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, MenuItem, Typography, Table, TableHead, TableRow,
  TableCell, TableBody, Paper, TableContainer, CircularProgress,
  Snackbar,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

// ✅ Updated Categories
const categories = [
  "Task",
  "Project Update",
  "Meeting",
  "Training",
  "Event",
  "Leave Request",
  "Incident Report",
  "Daily Log",
  "Idea/Suggestion"
];

// ✅ Optional status tracking
const statuses = ["Pending", "In Progress", "Completed"];

const EmployeeTaskManager = () => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    date: "",
    status: "Pending",
  });
  const [file, setFile] = useState(null);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMsg, setSnackMsg] = useState("");

  useEffect(() => {
    fetchEntries();
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") fetchEntries();
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  const fetchEntries = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/employee-tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEntries(res.data);
    } catch (err) {
      console.error("Failed to fetch tasks", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const formData = new FormData();
    Object.entries(form).forEach(([key, val]) => formData.append(key, val));
    if (file) formData.append("file", file);

    setSubmitting(true);
    try {
      await axios.post("/employee-tasks", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setSnackMsg("✅ Task submitted successfully!");
      setSnackOpen(true);
      setOpen(false);
      setForm({ title: "", description: "", category: "", date: "", status: "Pending" });
      setFile(null);
      fetchEntries();
    } catch (err) {
      console.error("Failed to submit task", err);
      setSnackMsg("❌ Failed to submit task.");
      setSnackOpen(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>Employee Task Manager</Typography>
      <Button variant="contained" onClick={() => setOpen(true)} sx={{ mb: 2 }}>+ Add Task</Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {["Title", "Category", "Status", "Due Date", "File"].map((head) => (
                <TableCell key={head} sx={{ backgroundColor: "#000", color: "#fff", fontWeight: "bold" }}>
                  {head}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={5} align="center"><CircularProgress /></TableCell></TableRow>
            ) : entries.length === 0 ? (
              <TableRow><TableCell colSpan={5} align="center">No tasks found.</TableCell></TableRow>
            ) : (
              entries.map((entry) => (
                <TableRow key={entry._id}>
                  <TableCell>{entry.title}</TableCell>
                  <TableCell>{entry.category}</TableCell>
                  <TableCell>{entry.status}</TableCell>
                  <TableCell>{entry.date ? new Date(entry.date).toLocaleDateString() : "N/A"}</TableCell>
                  <TableCell>
                    {entry.fileUrl ? (
                      <a href={entry.fileUrl} target="_blank" rel="noreferrer" style={{ color: "#1976d2" }}>View</a>
                    ) : "No File"}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog Form */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Submit New Task</DialogTitle>
        <DialogContent>
          <TextField label="Title" name="title" value={form.title} onChange={handleChange} fullWidth margin="dense" />
          <TextField label="Description" name="description" value={form.description} onChange={handleChange} fullWidth margin="dense" multiline rows={3} />
          <TextField label="Category" name="category" value={form.category} onChange={handleChange} select fullWidth margin="dense">
            {categories.map((cat) => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
          </TextField>
          <TextField label="Status" name="status" value={form.status} onChange={handleChange} select fullWidth margin="dense">
            {statuses.map((status) => <MenuItem key={status} value={status}>{status}</MenuItem>)}
          </TextField>
          <TextField label="Due Date" name="date" type="date" value={form.date} onChange={handleChange} fullWidth margin="dense" InputLabelProps={{ shrink: true }} />
          <Button component="label" variant="outlined" sx={{ mt: 2 }}>Upload File<input type="file" hidden onChange={handleFileChange} /></Button>
          {file && <Typography mt={1}>{file.name}</Typography>}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} disabled={submitting}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" disabled={submitting}>{submitting ? <CircularProgress size={24} /> : "Submit"}</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackOpen} autoHideDuration={3000} onClose={() => setSnackOpen(false)} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert onClose={() => setSnackOpen(false)} severity={snackMsg.startsWith("✅") ? "success" : "error"}>{snackMsg}</Alert>
      </Snackbar>
    </Box>
  );
};

export default EmployeeTaskManager;
