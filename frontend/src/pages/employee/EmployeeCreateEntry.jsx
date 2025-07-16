// src/pages/employee/EmployeeTaskManager.jsx
import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import {
  Box, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, MenuItem, Typography, Table, TableHead, TableRow,
  TableCell, TableBody, Paper, TableContainer, CircularProgress,
  Snackbar, IconButton, Tooltip, InputAdornment
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SearchIcon from "@mui/icons-material/Search";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const categories = ["All", "Task", "Project Update", "Meeting", "Training", "Event", "Leave Request", "Incident Report", "Daily Log", "Idea/Suggestion"];
const statuses = ["Pending", "In Progress", "Completed"];

const EmployeeTaskManager = () => {
  const [entries, setEntries] = useState([]);
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", category: "", date: "", status: "Pending", fileUrl: "" });
  const [selectedFile, setSelectedFile] = useState(null);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMsg, setSnackMsg] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => { fetchEntries(); }, []);
  useEffect(() => { filterData(); }, [entries, search, filterCategory]);

  const fetchEntries = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/employee-tasks", { headers: { Authorization: `Bearer ${token}` } });
      setEntries(res.data);
    } catch (err) {
      console.error("❌ Failed to fetch entries:", err);
    } finally {
      setLoading(false);
    }
  };

  const filterData = () => {
    const lowerSearch = search.toLowerCase();
    const filtered = entries.filter(entry => {
      const matchesSearch = entry.title.toLowerCase().includes(lowerSearch) || entry.description.toLowerCase().includes(lowerSearch);
      const matchesCategory = filterCategory === "All" || entry.category === filterCategory;
      return matchesSearch && matchesCategory;
    });
    setFilteredEntries(filtered);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // Upload file to Vercel Blob and get URL
 const handleFileUpload = async () => {
  if (!selectedFile) return null;
  const token = localStorage.getItem("token");
  const formData = new FormData();
  formData.append("file", selectedFile);

  try {
    const res = await axios.post("/blob/upload", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data"
      }
    });
    setSnackMsg("✅ File uploaded!");
    setSnackOpen(true);
    return res.data.url;  // Make sure you return the file URL from blob upload response
  } catch (err) {
    console.error("❌ File upload failed", err);
    setSnackMsg("❌ File upload failed");
    setSnackOpen(true);
    return null;
  }
};


const handleSubmit = async (e) => {
  e.preventDefault();
  const token = localStorage.getItem("token");
  const config = { headers: { Authorization: `Bearer ${token}` } };
  setSubmitting(true);
  try {
    let fileUrl = form.fileUrl || null;
    if (selectedFile) {
      const uploadedUrl = await handleFileUpload();
      if (uploadedUrl) fileUrl = uploadedUrl;
    }

    // Create payload including fileUrl from upload step
    const payload = { ...form, fileUrl };

    if (editingId) {
      await axios.put(`/employee-tasks/${editingId}`, payload, config);
      setSnackMsg("Task updated successfully!");
    } else {
      await axios.post("/employee-tasks", payload, config);
      setSnackMsg("Task created successfully!");
    }

    await fetchEntries();  // Refresh list after submit
    handleClose();
    setSnackOpen(true);
  } catch (err) {
    console.error("❌ Failed to submit:", err);
    setSnackMsg("❌ Failed to submit task");
    setSnackOpen(true);
  } finally {
    setSubmitting(false);
  }
};


  const handleEdit = (entry) => {
    setForm({
      title: entry.title,
      description: entry.description,
      category: entry.category,
      date: entry.date?.slice(0, 10),
      status: entry.status,
      fileUrl: entry.fileUrl || ""
    });
    setSelectedFile(null);
    setEditingId(entry._id);
    setOpen(true);
  };

  const handleDelete = async () => {
    setDeleting(true);
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`/employee-tasks/${entryToDelete._id}`, { headers: { Authorization: `Bearer ${token}` } });
      setSnackMsg("Task deleted successfully");
      fetchEntries();
    } catch {
      setSnackMsg("❌ Failed to delete");
    } finally {
      setDeleting(false);
      setDeleteDialogOpen(false);
      setEntryToDelete(null);
      setSnackOpen(true);
    }
  };

  const handleToggleStatus = async (entry) => {
    const token = localStorage.getItem("token");
    const nextStatus = entry.status === "Pending" ? "In Progress" : entry.status === "In Progress" ? "Completed" : "Pending";
    try {
      await axios.put(`/employee-tasks/${entry._id}`, { ...entry, status: nextStatus }, { headers: { Authorization: `Bearer ${token}` } });
      fetchEntries();
      setSnackMsg("Status updated!");
      setSnackOpen(true);
    } catch {
      alert("Failed to toggle status");
    }
  };

  const handleClose = () => {
    setOpen(false);
    setEditingId(null);
    setForm({ title: "", description: "", category: "", date: "", status: "Pending", fileUrl: "" });
    setSelectedFile(null);
  };

  const handleMarkDoneUndone = async (entry) => {
    const token = localStorage.getItem("token");
    const nextStatus = entry.status === "Completed" ? "Pending" : "Completed";
    try {
      await axios.put(`/employee-tasks/${entry._id}`, { ...entry, status: nextStatus }, { headers: { Authorization: `Bearer ${token}` } });
      fetchEntries();
      setSnackMsg(`Marked as ${nextStatus === "Completed" ? "Done" : "Undone"}`);
      setSnackOpen(true);
    } catch (err) {
      console.error("❌ Failed to update status:", err);
      setSnackMsg("❌ Failed to update status");
      setSnackOpen(true);
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>Employee Task Manager</Typography>

      {/* Search & Filters */}
      <Box display="flex" gap={2} mb={2}>
        <TextField
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search"
          InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }}
          size="small"
        />
        <TextField select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} size="small">
          {categories.map(cat => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
        </TextField>
      </Box>

      <Button variant="contained" onClick={() => setOpen(true)} sx={{ mb: 2 }}>+ Add Task</Button>

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              {["Title", "Description", "Category", "Status", "Due Date", "Date Posted", "File", "Actions"].map(head => (
                <TableCell key={head} sx={{ fontWeight: "bold", backgroundColor: "#000", color: "#fff" }}>{head}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={8} align="center"><CircularProgress /></TableCell></TableRow>
            ) : filteredEntries.length === 0 ? (
              <TableRow><TableCell colSpan={8} align="center">No entries found</TableCell></TableRow>
            ) : (
              filteredEntries.map(entry => (
                <TableRow key={entry._id}>
                  <TableCell>{entry.title}</TableCell>
                  <TableCell>{entry.description.length > 50 ? entry.description.slice(0, 50) + "..." : entry.description}</TableCell>
                  <TableCell>{entry.category}</TableCell>
                  <TableCell>
                    <Button
                      onClick={() => handleToggleStatus(entry)}
                      size="small"
                      color={entry.status === "Completed" ? "success" : "warning"}
                    >
                      {entry.status}
                    </Button>
                  </TableCell>
                  <TableCell>{entry.date ? new Date(entry.date).toLocaleDateString() : "N/A"}</TableCell>
                  <TableCell>{entry.createdAt ? new Date(entry.createdAt).toLocaleDateString() : "N/A"}</TableCell>
                  <TableCell>
                    {entry.fileUrl ? (
                      <a href={entry.fileUrl} target="_blank" rel="noopener noreferrer">View</a>
                    ) : "No File"}
                  </TableCell>
                  <TableCell>
                    <Tooltip title={entry.status === "Completed" ? "Mark as Undone" : "Mark as Done"}>
                      <IconButton onClick={() => handleMarkDoneUndone(entry)}>
                        <CheckCircleIcon
                          sx={{
                            color:
                              entry.status === "Completed"
                                ? "success.main"
                                : entry.status === "Pending"
                                  ? "orange"
                                  : "text.disabled"
                          }}
                        />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Edit">
                      <IconButton onClick={() => handleEdit(entry)} color="primary">
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton color="error" onClick={() => { setEntryToDelete(entry); setDeleteDialogOpen(true); }}>
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

      {/* Dialogs */}
      {/* Create/Edit Task */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>{editingId ? "Edit Task" : "Create Task"}</DialogTitle>
        <DialogContent>
          <TextField label="Title" name="title" value={form.title} onChange={handleChange} fullWidth margin="dense" required />
          <TextField label="Description" name="description" value={form.description} onChange={handleChange} fullWidth margin="dense" multiline rows={3} required />
          <TextField label="Category" name="category" value={form.category} onChange={handleChange} select fullWidth margin="dense" required>
            {categories.slice(1).map(cat => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
          </TextField>
          <TextField label="Due Date" name="date" type="date" value={form.date} onChange={handleChange} fullWidth margin="dense" InputLabelProps={{ shrink: true }} required />
          <TextField label="Status" name="status" value={form.status} onChange={handleChange} select fullWidth margin="dense" required>
            {statuses.map(status => <MenuItem key={status} value={status}>{status}</MenuItem>)}
          </TextField>

          {/* File Upload */}
          <Button variant="outlined" component="label" fullWidth sx={{ mt: 2 }}>
            Upload File
            <input
              type="file"
              hidden
              onChange={(e) => setSelectedFile(e.target.files[0])}
            />
          </Button>
          {selectedFile && <Typography variant="body2" sx={{ mt: 1 }}>Selected: {selectedFile.name}</Typography>}
          {!selectedFile && form.fileUrl && (
            <Typography variant="body2" sx={{ mt: 1 }}>
              Current file: <a href={form.fileUrl} target="_blank" rel="noopener noreferrer">View</a>
            </Typography>
          )}

        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" disabled={submitting}>
            {submitting ? <CircularProgress size={24} /> : editingId ? "Update" : "Submit"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent dividers>
          <Typography>Are you sure you want to delete <strong>{entryToDelete?.title}</strong>?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} variant="outlined" color="inherit" disabled={deleting}>Cancel</Button>
          <Button
            onClick={handleDelete}
            variant="contained"
            color="error"
            disabled={deleting}
            startIcon={deleting && <CircularProgress size={18} color="inherit" />}
          >
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackOpen}
        autoHideDuration={3000}
        onClose={() => setSnackOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackOpen(false)}
          severity={snackMsg.startsWith("❌") ? "error" : "success"}
        >
          {snackMsg}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EmployeeTaskManager;
