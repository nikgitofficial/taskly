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

// Get base URL from env or default localhost
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const FileUploader = () => {
  const [file, setFile] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMsg, setSnackMsg] = useState("");

  // Rename dialog states
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [newFileName, setNewFileName] = useState("");
  const [fileToRename, setFileToRename] = useState(null);
  const [renaming, setRenaming] = useState(false);

  // Delete confirmation dialog states
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Search & filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [fileTypeFilter, setFileTypeFilter] = useState("all");

  // Ref to clear file input after upload
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/blob/files`);
      setUploadedFiles(res.data);
    } catch (err) {
      console.error("❌ Failed to load files:", err.message);
      setSnackMsg("❌ Failed to load files");
      setSnackOpen(true);
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
      await axios.post(`${API_BASE_URL}/api/blob/upload`, formData);
      setLoading(true); // Show spinner while fetching updated list
      await fetchFiles();
      setSnackMsg("✅ File uploaded successfully");
      setSnackOpen(true);

      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Clear chosen file display
      }
    } catch (err) {
      console.error("❌ Upload failed:", err.message);
      setSnackMsg("❌ Upload failed");
      setSnackOpen(true);
    } finally {
      setUploading(false);
      setLoading(false);
    }
  };

  const handleRename = (file) => {
    setFileToRename(file);
    setNewFileName(file.name);
    setRenameDialogOpen(true);
  };

  const confirmRename = async () => {
    if (!newFileName.trim()) {
      setSnackMsg("❌ New file name cannot be empty");
      setSnackOpen(true);
      return;
    }
    setRenaming(true);
    try {
      await axios.put(`${API_BASE_URL}/api/blob/files/${fileToRename._id}`, {
        newName: newFileName,
      });
      setSnackMsg("✏️ File renamed");
      await fetchFiles();
      setRenameDialogOpen(false);
    } catch (err) {
      console.error("❌ Rename failed:", err.message);
      setSnackMsg("❌ Rename failed");
      setSnackOpen(true);
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
      await axios.delete(`${API_BASE_URL}/api/blob/files/${fileToDelete._id}`);
      setSnackMsg("🗑️ File deleted");
      await fetchFiles();
      setDeleteDialogOpen(false);
    } catch (err) {
      console.error("❌ Delete failed:", err.message);
      setSnackMsg("❌ Delete failed");
      setSnackOpen(true);
    } finally {
      setDeleting(false);
      setFileToDelete(null);
    }
  };

  const handleDownload = async (url, name) => {
    try {
      const response = await axios.get(url, { responseType: "blob" });
      const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = blobUrl;
      link.setAttribute("download", name);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("❌ Download failed:", error.message);
      setSnackMsg("❌ Download failed");
      setSnackOpen(true);
    }
  };

  // Get unique file types for filter dropdown
  const fileTypes = useMemo(() => {
    const types = uploadedFiles.map((f) => f.type);
    return ["all", ...Array.from(new Set(types))];
  }, [uploadedFiles]);

  // Filter files based on search and type filter
  const filteredFiles = useMemo(() => {
    return uploadedFiles.filter((file) => {
      const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = fileTypeFilter === "all" || file.type === fileTypeFilter;
      return matchesSearch && matchesType;
    });
  }, [uploadedFiles, searchTerm, fileTypeFilter]);

  return (
    <Container maxWidth="md" sx={{ mt: 6, mb: 6 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom textAlign={{ xs: "center", sm: "left" }}>
        📤 File Uploader
      </Typography>

      <Box
        display="flex"
        flexDirection={{ xs: "column", sm: "row" }}
        alignItems={{ xs: "stretch", sm: "center" }}
        gap={2}
        mb={4}
      >
        <Input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          inputRef={fileInputRef} // <-- Here
          sx={{
            flex: 1,
            border: "1px solid #ccc",
            px: 1,
            py: 0.5,
            borderRadius: 1,
            backgroundColor: "#fff",
            width: { xs: "100%", sm: "auto" },
          }}
        />
        <Button
          variant="contained"
          onClick={handleUpload}
          disabled={!file || uploading}
          size="large"
          sx={{ px: 4, width: { xs: "100%", sm: "auto" } }}
        >
          {uploading ? <CircularProgress size={24} color="inherit" /> : "Upload"}
        </Button>
      </Box>

      {/* Search & Filter */}
      <Box
        mb={2}
        display="flex"
        flexDirection={{ xs: "column", sm: "row" }}
        gap={2}
        justifyContent="space-between"
        alignItems="center"
      >
        <TextField
          label="Search by file name"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ flex: 1 }}
        />
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel id="file-type-filter-label">Filter by type</InputLabel>
          <Select
            labelId="file-type-filter-label"
            label="Filter by type"
            value={fileTypeFilter}
            onChange={(e) => setFileTypeFilter(e.target.value)}
          >
            {fileTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type === "all" ? "All Types" : type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {loading ? (
        <Box textAlign="center" mt={6}>
          <CircularProgress />
        </Box>
      ) : filteredFiles.length > 0 ? (
        <TableContainer component={Paper} elevation={3} sx={{ overflowX: "auto", borderRadius: 2 }}>
          <Table size="small" sx={{ minWidth: 650 }}>
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
                  <TableCell sx={{ wordBreak: "break-word" }}>{file.name}</TableCell>
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
                        disabled={renaming || deleting}
                      >
                        <Visibility />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Download">
                      <IconButton
                        onClick={() => handleDownload(file.url, file.name)}
                        color="success"
                        disabled={renaming || deleting}
                      >
                        <Download />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Rename">
                      <IconButton
                        onClick={() => handleRename(file)}
                        color="warning"
                        disabled={renaming || deleting}
                      >
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        onClick={() => handleDeleteClick(file)}
                        color="error"
                        disabled={renaming || deleting}
                      >
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
        <Typography variant="body1" color="text.secondary" mt={4} textAlign="center">
          No files match your search/filter criteria.
        </Typography>
      )}

      {/* Rename Dialog */}
      <Dialog
        open={renameDialogOpen}
        onClose={() => !renaming && setRenameDialogOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Rename File</DialogTitle>
        <DialogContent>
          <DialogContentText mb={2}>Enter a new name for the file.</DialogContentText>
          <TextField
            fullWidth
            label="New File Name"
            value={newFileName}
            onChange={(e) => setNewFileName(e.target.value)}
            margin="dense"
            disabled={renaming}
            autoFocus
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setRenameDialogOpen(false)} disabled={renaming}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={confirmRename}
            disabled={renaming || !newFileName.trim()}
            startIcon={renaming ? <CircularProgress size={20} color="inherit" /> : null}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => !deleting && setDeleteDialogOpen(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete <strong>{fileToDelete?.name}</strong>?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDeleteDialogOpen(false)} disabled={deleting}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={confirmDelete}
            disabled={deleting}
            startIcon={deleting ? <CircularProgress size={20} color="inherit" /> : null}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar Alert */}
      <Snackbar
        open={snackOpen}
        autoHideDuration={3000}
        onClose={() => setSnackOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackOpen(false)}
          severity={snackMsg.startsWith("✅") || snackMsg.startsWith("✏️") ? "success" : "error"}
          variant="filled"
        >
          {snackMsg}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default FileUploader;
