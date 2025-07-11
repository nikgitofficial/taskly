// FileUploader.jsx
import React, { useEffect, useState, useMemo, useRef } from "react";
import axios from "../../api/axios";
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
      const res = await axios.get("/blob/files", getAuthHeaders());
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
      await axios.post("/blob/upload", formData, {
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

  const handleRename = (file) => {
    setFileToRename(file);
    setNewFileName(file?.originalname || file?.name || "");
    setRenameDialogOpen(true);
  };

  const confirmRename = async () => {
    if (!newFileName.trim()) {
      showSnack("❌ New file name cannot be empty", "error");
      return;
    }
    setRenaming(true);
    try {
      await axios.put(`/blob/rename/${fileToRename._id}`, { newName: newFileName }, getAuthHeaders());
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
      await axios.delete(`/blob/delete/${fileToDelete._id}`, getAuthHeaders());
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

const handleDownloadById = async (url, filename) => {
  try {
    const response = await fetch(url, { method: "GET" });
    if (!response.ok) throw new Error("Network response was not ok");

    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(downloadUrl);
  } catch (error) {
    console.error("❌ Download failed:", error);
    showSnack("❌ Failed to download file", "error");
  }
};




  const fileTypes = useMemo(() => {
    const types = uploadedFiles.map((f) => f.mimetype || f.type || "");
    return ["all", ...Array.from(new Set(types))];
  }, [uploadedFiles]);

  const filteredFiles = useMemo(() => {
    return uploadedFiles.filter((file) => {
      const name = file?.originalname?.toLowerCase() || "";
      const type = file?.mimetype || "";
      return name.includes(searchTerm.toLowerCase()) && 
             (fileTypeFilter === "all" || type === fileTypeFilter);
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
        <Button variant="contained" onClick={handleUpload} disabled={!file || uploading} size="large" sx={{ px: 4 }}>
          {uploading ? <CircularProgress size={24} color="inherit" /> : "Upload"}
        </Button>
      </Box>

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

      {loading ? (
        <Box textAlign="center" mt={6}><CircularProgress /></Box>
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
                  <TableCell sx={{ wordBreak: "break-word" }}>{file.originalname}</TableCell>
                  <TableCell>{file.mimetype}</TableCell>
                  <TableCell>{(file.size / 1024).toFixed(2)}</TableCell>
                  <TableCell>
                    <Tooltip title="View">
                      <IconButton component="a" href={file.url} target="_blank" rel="noopener noreferrer" color="info">
                        <Visibility />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Download">
  <IconButton onClick={() => handleDownloadById(file.url, file.originalname)} color="success">
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
          <Button onClick={() => setRenameDialogOpen(false)} disabled={renaming}>Cancel</Button>
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
            Are you sure you want to delete <strong>{fileToDelete?.originalname}</strong>?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} disabled={deleting}>Cancel</Button>
          <Button variant="contained" color="error" onClick={confirmDelete} disabled={deleting}>
            {deleting ? <CircularProgress size={20} /> : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

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
          sx={snackColor && {
            bgcolor: snackColor,
            color: "#fff",
            "& .MuiAlert-icon": { color: "#fff" },
          }}
        >
          {snackMsg}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default FileUploader;
