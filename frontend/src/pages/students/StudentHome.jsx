// src/pages/student/StudentHome.jsx
import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
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
  useMediaQuery,
  useTheme,
  CircularProgress,
  Snackbar,
  InputAdornment,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SearchIcon from "@mui/icons-material/Search";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const categories = ["All", "Assignment", "Task", "Event", "Todo"];

const StudentHome = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    date: "",
  });
  const [entries, setEntries] = useState([]);
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMsg, setSnackMsg] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");

  useEffect(() => {
    fetchEntries();
  }, []);

  useEffect(() => {
    filterData();
  }, [entries, search, filterCategory]);

  const fetchEntries = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/student-entries", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEntries(res.data);
    } catch (err) {
      console.error("❌ Failed to fetch entries:", err?.response || err);
    } finally {
      setLoading(false);
    }
  };

  const filterData = () => {
    const lowerSearch = search.toLowerCase();
    const filtered = entries.filter((entry) => {
      const matchesSearch =
        entry.title.toLowerCase().includes(lowerSearch) ||
        entry.description.toLowerCase().includes(lowerSearch);
      const matchesCategory =
        filterCategory === "All" || entry.category === filterCategory;
      return matchesSearch && matchesCategory;
    });
    setFilteredEntries(filtered);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { title, description, category, date } = form;

    if (!title || !description || !category || !date) {
      alert("Please fill in all required fields.");
      return;
    }

    setSubmitting(true);
    const token = localStorage.getItem("token");

    const data = { title, description, category, date };

    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      if (editingId) {
        await axios.put(`/student-entries/${editingId}`, data, config);
        setSnackMsg("Entry updated successfully!");
      } else {
        await axios.post("/student-entries", data, config);
        setSnackMsg("Entry created successfully!");
      }

      handleClose();
      await fetchEntries();
      setSnackOpen(true);
    } catch (error) {
      console.error("❌ Error submitting form:", error?.response?.data || error.message);
      alert("Failed to submit entry");
    } finally {
      setSubmitting(false);
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
        prev.map((e) => (e._id === entry._id ? updated : e))
      );
      setSnackMsg(`Marked as ${entry.done ? "Undone" : "Done"}`);
      setSnackOpen(true);
    } catch {
      alert("Failed to update status");
    }
  };

  const confirmDelete = (entry) => {
    setEntryToDelete(entry);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    setDeleting(true);
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/student-entries/${entryToDelete._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEntries((prev) =>
        prev.filter((e) => e._id !== entryToDelete._id)
      );
      setSnackMsg("Entry deleted successfully!");
      setSnackOpen(true);
    } catch {
      alert("Failed to delete entry");
    } finally {
      setDeleting(false);
      setDeleteDialogOpen(false);
      setEntryToDelete(null);
    }
  };

  const handleEdit = (entry) => {
    setForm({
      title: entry.title,
      description: entry.description,
      category: entry.category,
      date: entry.date?.slice(0, 10),
    });
    setEditingId(entry._id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingId(null);
    setForm({ title: "", description: "", category: "", date: "" });
  };

  return (
    <Box sx={{ p: isMobile ? 2 : 4 }}>
      <Typography variant={isMobile ? "h5" : "h4"} gutterBottom>
        Student Home
      </Typography>

      {/* Search & Filter */}
      <Box sx={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: 2, mb: 3 }}>
        <TextField
          label="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          fullWidth
          variant="outlined"
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ flex: 2 }}
        />
        <TextField
          label="Category"
          select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          variant="outlined"
          size="small"
          sx={{ flex: 1 }}
        >
          {categories.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      <Button variant="contained" onClick={() => setOpen(true)} sx={{ mb: 2 }} fullWidth={isMobile}>
        + Create New Entry
      </Button>

      {/* Entries Table */}
      <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2 }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              {["Title", "Description", "Category", "Posted", "Due", "Status", "Actions"].map((head) => (
                <TableCell
                  key={head}
                  sx={{ color: "#fff", fontWeight: "bold", backgroundColor: "#000" }}
                >
                  {head}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center">Loading...</TableCell>
              </TableRow>
            ) : filteredEntries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">No entries found.</TableCell>
              </TableRow>
            ) : (
              filteredEntries.map((entry) => (
                <TableRow key={entry._id}>
                  <TableCell>{entry.title}</TableCell>
                  <TableCell sx={{ whiteSpace: "pre-line" }}>{entry.description}</TableCell>
                  <TableCell>{entry.category}</TableCell>
                  <TableCell>{new Date(entry.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(entry.date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Typography sx={{ fontSize: "0.75rem", fontWeight: "bold", color: entry.done ? "#2e7d32" : "#ef6c00" }}>
                      {entry.done ? "Done" : "Pending"}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Tooltip title={entry.done ? "Mark as Undone" : "Mark as Done"}>
                      <IconButton onClick={() => handleToggleDone(entry)} color="success"><CheckCircleIcon /></IconButton>
                    </Tooltip>
                    <Tooltip title="Edit">
                      <IconButton onClick={() => handleEdit(entry)} color="primary"><EditIcon /></IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton onClick={() => confirmDelete(entry)} color="error"><DeleteIcon /></IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Snackbar */}
      <Snackbar
        open={snackOpen}
        autoHideDuration={3000}
        onClose={() => setSnackOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={() => setSnackOpen(false)} severity="success">{snackMsg}</Alert>
      </Snackbar>

      {/* Delete Confirmation */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent dividers>
          <Typography>Are you sure you want to delete <strong>{entryToDelete?.title}</strong>?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="inherit">Cancel</Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
            disabled={deleting}
            startIcon={deleting && <CircularProgress size={18} color="inherit" />}
          >
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Entry Form Dialog */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>{editingId ? "Edit Entry" : "Create Entry"}</DialogTitle>
        <DialogContent dividers>
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              label="Title"
              name="title"
              value={form.title}
              onChange={handleChange}
              fullWidth
              margin="dense"
              required
            />
            <TextField
              label="Description"
              name="description"
              value={form.description}
              onChange={handleChange}
              fullWidth
              margin="dense"
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
              margin="dense"
              required
            >
              {categories.slice(1).map((option) => (
                <MenuItem key={option} value={option}>{option}</MenuItem>
              ))}
            </TextField>
            <TextField
              label="Due Date"
              name="date"
              type="date"
              value={form.date}
              onChange={handleChange}
              fullWidth
              margin="dense"
              InputLabelProps={{ shrink: true }}
              required
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={submitting}
            startIcon={submitting && <CircularProgress size={18} color="inherit" />}
          >
            {submitting ? "Submitting..." : editingId ? "Update" : "Submit"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StudentHome;
