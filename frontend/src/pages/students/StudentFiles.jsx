// FileUploader.jsx
import React, { useEffect, useState, useMemo, useRef } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Container,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  TableContainer,
  CircularProgress,
  Input,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  IconButton,
  Tooltip,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { Delete, Edit, Visibility, Download } from "@mui/icons-material";
import { blue, green, red } from "@mui/material/colors";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

const FileUploader = () => {
  const [file, setFile] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMsg, setSnackMsg] = useState("");
  const [snackSeverity, setSnackSeverity] = useState("success");
  const [snackColor, setSnackColor] = useState(undefined);

  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [newFileName, setNewFileName] = useState("");
  const [fileToRename, setFileToRename] = useState(null);
  const [renaming, setRenaming] = useState(false);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [fileTypeFilter, setFileTypeFilter] = useState("all");

  const fileInputRef = useRef(null);

const showSnack = (msg, severity = "success", color) => {
  const defaultColors = {
    success: green[600],
    error: red[600],
    info: blue[600],
    warning: "#ffa000",
  };
  setSnackMsg(msg);
  setSnackSeverity(severity);
  setSnackColor(color || defaultColors[severity]);
  setSnackOpen(true);
};


  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/blob/files`, getAuthHeaders());
      setUploadedFiles(res.data);
    } catch (err) {
      console.error("❌ Failed to load files:", err.message);
      showSnack("❌ Failed to load files", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post(`${API_BASE_URL}/api/blob/upload`, formData, {
        ...getAuthHeaders(),
        headers: {
          ...getAuthHeaders().headers,
          "Content-Type": "multipart/form-data",
        },
      });
      await fetchFiles();
      showSnack("✅ File uploaded successfully", "success", green[600]);
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      console.error("❌ Upload failed:", err.message);
      showSnack("❌ Upload failed", "error");
    } finally {
      setUploading(false);
    }
  };
// --- inside FileUploader component ---

const handleRename = (file) => {
  setFileToRename(file);
  const safeName = file?.originalname || file?.name || "";
  setNewFileName(safeName);
  setRenameDialogOpen(true);
};

const confirmRename = async () => {
  if (!newFileName || !newFileName.trim()) {
    showSnack("❌ New file name cannot be empty", "error");
    return;
  }
  setRenaming(true);
  try {
    await axios.put(
      `${API_BASE_URL}/api/blob/rename/${fileToRename._id}`,
      { newName: newFileName },
      getAuthHeaders()
    );
    showSnack("✏️ File renamed", "success", green[700]);
    await fetchFiles();
    setRenameDialogOpen(false);
  } catch (err) {
    console.error("❌ Rename failed:", err.message);
    showSnack("❌ Rename failed", "error");
  } finally {
    setRenaming(false);
    setFileToRename(null);
    setNewFileName("");
  }
};




  const handleDeleteClick = (file) => {
    setFileToDelete(file);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await axios.delete(`${API_BASE_URL}/api/blob/delete/${fileToDelete._id}`, getAuthHeaders()); // ✅ updated route
      showSnack("🗑️ File deleted", "success", red[700]);
      await fetchFiles();
      setDeleteDialogOpen(false);
    } catch (err) {
      console.error("❌ Delete failed:", err.message);
      showSnack("❌ Delete failed", "error");
    } finally {
      setDeleting(false);
      setFileToDelete(null);
    }
  };

 const handleDownload = async (url, name) => {
  try {
    const response = await axios.get(url, {
      responseType: "blob",
    });

    const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = blobUrl;
    // Use fallback for name here:
    link.setAttribute("download", name || "downloaded_file");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);

    showSnack("⬇️ Download started", "info", blue[700]);
  } catch (err) {
    console.error("❌ Download failed:", err.message);
    showSnack("❌ Download failed", "error", red[500]);
  }
};



  const fileTypes = useMemo(() => {
    const types = uploadedFiles.map((f) => f.type);
    return ["all", ...Array.from(new Set(types))];
  }, [uploadedFiles]);

// Replace your current useMemo with this:
const filteredFiles = useMemo(() => {
  return uploadedFiles.filter((file) => {
    const name = file?.originalname || file?.name || "";
    const type = file?.mimetype || file?.type || "";
    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = fileTypeFilter === "all" || type === fileTypeFilter;
    return matchesSearch && matchesType;
  });
}, [uploadedFiles, searchTerm, fileTypeFilter]);

  return (
     <Container maxWidth="md" sx={{ mt: 6, mb: 6 }}>
            <Typography variant="h4" fontWeight={700} gutterBottom textAlign={{ xs: "center", sm: "left" }}>
        📤 File Uploader
      </Typography>

      <Box display="flex" flexDirection={{ xs: "column", sm: "row" }} gap={2} alignItems="center" mb={4}>
        <Input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          inputRef={fileInputRef}
          sx={{ flex: 1, border: "1px solid #ccc", px: 1, py: 0.5, borderRadius: 1, backgroundColor: "#fff" }}
        />
        <Button
          variant="contained"
          onClick={handleUpload}
          disabled={!file || uploading}
          size="large"
          sx={{ px: 4 }}
        >
          {uploading ? <CircularProgress size={24} color="inherit" /> : "Upload"}
        </Button>
      </Box>

      {/* Filters */}
      <Box mb={2} display="flex" flexDirection={{ xs: "column", sm: "row" }} gap={2}>
        <TextField
          label="Search by file name"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ flex: 1 }}
        />
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Filter by type</InputLabel>
          <Select value={fileTypeFilter} onChange={(e) => setFileTypeFilter(e.target.value)} label="Filter by type">
            {fileTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type === "all" ? "All Types" : type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Table */}
      {loading ? (
        <Box textAlign="center" mt={6}>
          <CircularProgress />
        </Box>
      ) : filteredFiles.length > 0 ? (
        <TableContainer component={Paper} elevation={3} sx={{ overflowX: "auto", borderRadius: 2 }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: "#000" }}>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Name</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Type</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Size (KB)</TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredFiles.map((file, idx) => (
                <TableRow key={idx} hover>
                  <TableCell sx={{ wordBreak: "break-word" }}>
  {file.originalname || file.name || "Unnamed"}
</TableCell>


                  <TableCell>{file.type}</TableCell>
                  <TableCell>{(file.size / 1024).toFixed(2)}</TableCell>
                  <TableCell>
                    <Tooltip title="View">
                      <IconButton
                        component="a"
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        color="info"
                      >
                        <Visibility />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Download">
                      <IconButton
  onClick={() => handleDownload(file.url, file.originalname || file.name)}
  color="success"
>
  <Download />
</IconButton>

                    </Tooltip>
                    <Tooltip title="Rename">
                      <IconButton onClick={() => handleRename(file)} color="warning">
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton onClick={() => handleDeleteClick(file)} color="error">
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography mt={4} textAlign="center" color="text.secondary">
          No files match your search/filter criteria.
        </Typography>
      )}

      {/* Rename Dialog */}
      <Dialog open={renameDialogOpen} onClose={() => !renaming && setRenameDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Rename File</DialogTitle>
        <DialogContent>
          <DialogContentText>Enter a new name for the file.</DialogContentText>
          <TextField
            fullWidth
            margin="dense"
            value={newFileName}
            onChange={(e) => setNewFileName(e.target.value)}
            disabled={renaming}
            autoFocus
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRenameDialogOpen(false)} disabled={renaming}>
            Cancel
          </Button>
          <Button variant="contained" onClick={confirmRename} disabled={renaming || !newFileName.trim()}>
            {renaming ? <CircularProgress size={20} /> : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => !deleting && setDeleteDialogOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete <strong>{fileToDelete?.name}</strong>?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} disabled={deleting}>
            Cancel
          </Button>
          <Button variant="contained" color="error" onClick={confirmDelete} disabled={deleting}>
            {deleting ? <CircularProgress size={20} /> : "Delete"}
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
          severity={snackSeverity}
          variant="filled"
          sx={
            snackColor && {
              bgcolor: snackColor,
              color: "#fff",
              "& .MuiAlert-icon": { color: "#fff" },
            }
          }
        >
          {snackMsg}
        </Alert>
      </Snackbar>
    </Container>
  );

    
  
};

export default FileUploader;
