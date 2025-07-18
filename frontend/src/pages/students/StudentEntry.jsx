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
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const categories = ["All", "Assignment", "Task", "Event", "Todo"];

const StudentEntry = () => {
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
  const config = { headers: { Authorization: `Bearer ${token}` } };

  if (editingId) {
    await axios.put(`/student-entries/${editingId}`, data, config);
    setSnackMsg("Entry updated successfully!");
  } else {
    await axios.post("/student-entries", data, config);
    setSnackMsg("Entry created successfully!");
  }

  handleClose();
  setLoading(true); // ✅ add this
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
  setLoading(true); // ✅ start loading
  try {
    const token = localStorage.getItem("token");
    const updated = { ...entry, done: !entry.done };
    await axios.put(`/student-entries/${entry._id}`, updated, {
      headers: { Authorization: `Bearer ${token}` },
    });
    await fetchEntries(); // ✅ reload from server
    setSnackMsg(`Marked as ${entry.done ? "Undone" : "Done"}`);
    setSnackOpen(true);
  } catch {
    alert("Failed to update status");
  } finally {
    setLoading(false); // ✅ stop loading
  }
};



  const confirmDelete = (entry) => {
    setEntryToDelete(entry);
    setDeleteDialogOpen(true);
  };

 const handleConfirmDelete = async () => {
  setDeleting(true);
  setLoading(true); // ✅ start loading
  try {
    const token = localStorage.getItem("token");
    await axios.delete(`/student-entries/${entryToDelete._id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    await fetchEntries(); // ✅ refresh from backend
    setSnackMsg("Entry deleted successfully!");
    setSnackOpen(true);
  } catch {
    alert("Failed to delete entry");
  } finally {
    setDeleting(false);
    setDeleteDialogOpen(false);
    setEntryToDelete(null);
    setLoading(false); // ✅ stop loading
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
  const exportToExcel = () => {
  const worksheet = XLSX.utils.json_to_sheet(filteredEntries.map(entry => ({
    Title: entry.title,
    Description: entry.description,
    Category: entry.category,
    "Due Date": entry.date ? new Date(entry.date).toLocaleDateString() : "N/A",
    "Posted Date": entry.createdAt ? new Date(entry.createdAt).toLocaleDateString() : "N/A",
    Status: entry.done ? "Done" : "Pending"
  })));

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Student Entries");
  XLSX.writeFile(workbook, "Student_Entries.xlsx");
};

const exportToPDF = () => {
  const doc = new jsPDF();
  doc.text("Student Entries Report", 14, 15);

  const tableData = filteredEntries.map(entry => [
    entry.title,
    entry.description.length > 30 ? entry.description.slice(0, 30) + "..." : entry.description,
    entry.category,
    entry.date ? new Date(entry.date).toLocaleDateString() : "N/A",
    entry.createdAt ? new Date(entry.createdAt).toLocaleDateString() : "N/A",
    entry.done ? "Done" : "Pending"
  ]);

  doc.autoTable({
    head: [["Title", "Description", "Category", "Due Date", "Posted Date", "Status"]],
    body: tableData,
    startY: 25,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [0, 0, 0] }
  });

  doc.save("Student_Entries_Report.pdf");
};


  return (
    <Box sx={{ p: isMobile ? 2 : 4 }}>
      <Typography variant={isMobile ? "h5" : "h4"} gutterBottom>
        Student Entries
      </Typography>

      {/* Search & Filter */}
<Box sx={{ display: "flex", gap: 2, mb: 2, flexWrap: "wrap" }}>
  <TextField
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    placeholder="Search"
    InputProps={{
      startAdornment: (
        <InputAdornment position="start">
          <SearchIcon />
        </InputAdornment>
      ),
    }}
    size="small"
    sx={{ minWidth: 200 }}
  />
  <TextField
    select
    value={filterCategory}
    onChange={(e) => setFilterCategory(e.target.value)}
    size="small"
    sx={{ minWidth: 180 }}
  >
    {categories.map((option) => (
      <MenuItem key={option} value={option}>
        {option}
      </MenuItem>
    ))}
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
      

      {/* Entries Table */}
        <TableContainer component={Paper} sx={{ maxHeight: 500, overflow: 'auto' }}>
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
    <TableCell colSpan={7} align="center">
      <CircularProgress size={30} />
    </TableCell>
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

export default StudentEntry;
