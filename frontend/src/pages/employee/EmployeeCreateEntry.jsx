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
import SearchIcon from "@mui/icons-material/Search";
import DoneIcon from "@mui/icons-material/Done";
import UndoIcon from "@mui/icons-material/Undo";

// 👉 Export dependencies
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import "jspdf-autotable"; // Import for side effect — extends jsPDF prototype

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const categories = ["All", "Task", "Project Update", "Meeting", "Training", "Event", "Leave Request", "Incident Report", "Daily Log", "Idea/Suggestion"];
const statuses = ["Pending", "In Progress", "Completed"];

const EmployeeTaskManager = () => {
  const [entries, setEntries] = useState([]);
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", category: "", date: "", status: "Pending" });
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const token = localStorage.getItem("token");
    try {
      const payload = { ...form };
      if (editingId) {
        await axios.put(`/employee-tasks/${editingId}`, payload, { headers: { Authorization: `Bearer ${token}` } });
        setSnackMsg("Task updated successfully!");
      } else {
        await axios.post("/employee-tasks", payload, { headers: { Authorization: `Bearer ${token}` } });
        setSnackMsg("Task created successfully!");
      }
      fetchEntries();
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
    });
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
    setForm({ title: "", description: "", category: "", date: "", status: "Pending" });
  };

  // Export to Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredEntries.map(entry => ({
      Title: entry.title,
      Description: entry.description,
      Category: entry.category,
      Status: entry.status,
      "Due Date": entry.date ? new Date(entry.date).toLocaleDateString() : "N/A",
      "Date Posted": entry.createdAt ? new Date(entry.createdAt).toLocaleDateString() : "N/A"
    })));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Tasks");
    XLSX.writeFile(workbook, "Employee_Tasks.xlsx");
  };

  // Export to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Employee Task Report", 14, 15);

    const tableData = filteredEntries.map(entry => [
      entry.title,
      entry.description.length > 30 ? entry.description.slice(0, 30) + "..." : entry.description,
      entry.category,
      entry.status,
      entry.date ? new Date(entry.date).toLocaleDateString() : "N/A",
      entry.createdAt ? new Date(entry.createdAt).toLocaleDateString() : "N/A"
    ]);

    doc.autoTable({
      head: [["Title", "Description", "Category", "Status", "Due Date", "Date Posted"]],
      body: tableData,
      startY: 25,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [0, 0, 0] }
    });

    doc.save("Employee_Tasks_Report.pdf");
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>Employee Task Manager</Typography>
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
      <Box display="flex" gap={2} mb={2}>
        <Button variant="contained" onClick={() => setOpen(true)}>+ Add Task</Button>
        <Button
  variant="contained"
  onClick={exportToExcel}
  sx={{
    backgroundColor: '#4CAF50',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#43A047',
    },
  }}
>
  Export to Excel
</Button>
<Button
  variant="contained"
  onClick={exportToPDF}
  sx={{
    backgroundColor: '#000',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#333',
    },
  }}
>
  Export to PDF
</Button>

  
      </Box>
      <TableContainer component={Paper} sx={{ maxHeight: 500, overflow: 'auto' }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              {["Title", "Description", "Category", "Status", "Due Date", "Date Posted", "Actions"].map(head => (
                <TableCell key={head} sx={{ fontWeight: "bold", backgroundColor: "#000", color: "#fff" }}>{head}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={7} align="center"><CircularProgress /></TableCell></TableRow>
            ) : filteredEntries.length === 0 ? (
              <TableRow><TableCell colSpan={7} align="center">No entries found</TableCell></TableRow>
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
                    <Tooltip
                      title={
                        entry.status === "Completed"
                          ? "Done"
                          : entry.status === "Pending"
                            ? "Undone"
                            : "In Progress"
                      }
                      arrow
                    >
                      <IconButton
                        onClick={() => handleToggleStatus(entry)}
                        size="small"
                        color={entry.status === "Completed" ? "success" : "warning"}
                        aria-label="Toggle Status"
                      >
                        {entry.status === "Completed" ? (
                          <DoneIcon />
                        ) : (
                          <UndoIcon />
                        )}
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Edit">
                      <IconButton onClick={() => handleEdit(entry)} color="primary">
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        color="error"
                        onClick={() => {
                          setEntryToDelete(entry);
                          setDeleteDialogOpen(true);
                        }}
                      >
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

      {/* Task Dialog */}
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
          <Button onClick={handleDelete} variant="contained" color="error" disabled={deleting}>
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar open={snackOpen} autoHideDuration={3000} onClose={() => setSnackOpen(false)} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert onClose={() => setSnackOpen(false)} severity={snackMsg.startsWith("❌") ? "error" : "success"}>
          {snackMsg}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EmployeeTaskManager;
