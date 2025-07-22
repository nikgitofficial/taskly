import { useEffect, useState } from "react";
import {
  Container, Typography, Card, CardContent, Box, Stack,
  Button, CircularProgress, TextField, Avatar, IconButton,
  Snackbar, Alert
} from "@mui/material";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import axios from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

const AdminProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState({ name: "", department: "", position: "", profilePic: "" });
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [snack, setSnack] = useState({ open: false, msg: "", severity: "success" });

  const showSnack = (msg, severity = "success") => setSnack({ open: true, msg, severity });

  const fetchProfile = async () => {
    try {
      const { data } = await axios.get("/admin/profile");
      setProfile({
        name: data.name || "",
        department: data.department || "",
        position: data.position || "",
        profilePic: data.profilePic || ""
      });
    } catch {
      showSnack("❌ Failed to fetch profile", "error");
    }
  };

  useEffect(() => { fetchProfile(); }, []);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const { data } = await axios.post("/admin/profile/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setProfile(prev => ({ ...prev, profilePic: data.url }));
      showSnack("✅ Profile picture updated!");
    } catch (err) {
      showSnack("❌ Failed to upload image", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.put("/admin/profile", {
        name: profile.name,
        department: profile.department,
        position: profile.position
      });
      setEditMode(false);
      showSnack("✅ Profile updated!");
    } catch {
      showSnack("❌ Failed to update profile", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Container sx={{ mt: 8, display: "flex", justifyContent: "center" }}>
      <Card sx={{ width: 500, borderRadius: 4, boxShadow: 6 }}>
        <Box sx={{
          background: "linear-gradient(135deg, #ab47bc, #8e24aa)",
          p: 4, color: "#fff", display: "flex", flexDirection: "column", alignItems: "center"
        }}>
          <Box position="relative">
            <Avatar src={profile.profilePic} sx={{
              width: 100, height: 100, fontSize: 36,
              bgcolor: "#fff", color: "#8e24aa", border: "3px solid #fff"
            }}>
              {!profile.profilePic && (profile.name?.[0] || user?.email?.[0])?.toUpperCase()}
            </Avatar>
            <IconButton component="label" sx={{
              position: "absolute", bottom: -5, right: -5,
              bgcolor: "#8e24aa", color: "#fff"
            }} disabled={uploading}>
              <PhotoCameraIcon fontSize="small" />
              <input type="file" hidden accept="image/*" onChange={handleFileUpload} />
            </IconButton>
          </Box>
          {uploading && <Typography fontSize={12} mt={1}>Uploading...</Typography>}
          <Typography variant="h6" mt={2}>Admin Profile</Typography>
          <Typography variant="body2">{user?.email}</Typography>
        </Box>

        <CardContent>
          <Stack spacing={2}>
            {editMode ? (
              <>
                <TextField label="Full Name" value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })} fullWidth />
                <TextField label="Department" value={profile.department}
                  onChange={(e) => setProfile({ ...profile, department: e.target.value })} fullWidth />
                <TextField label="Position" value={profile.position}
                  onChange={(e) => setProfile({ ...profile, position: e.target.value })} fullWidth />
                <Stack direction="row" spacing={2}>
                  <Button variant="contained" onClick={handleSave} disabled={saving}>
                    {saving ? <CircularProgress size={20} color="inherit" /> : "Save"}
                  </Button>
                  <Button variant="outlined" color="secondary" onClick={() => setEditMode(false)} disabled={saving}>Cancel</Button>
                </Stack>
              </>
            ) : (
              <>
                <Typography>Full Name: {profile.name || "Not Set"}</Typography>
                <Typography>Department: {profile.department || "Not Set"}</Typography>
                <Typography>Position: {profile.position || "Not Set"}</Typography>
                <Button variant="outlined" onClick={() => setEditMode(true)}>✏️ Edit Profile</Button>
              </>
            )}
          </Stack>
        </CardContent>
      </Card>

      <Snackbar open={snack.open} autoHideDuration={3000} onClose={() => setSnack(p => ({ ...p, open: false }))} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert severity={snack.severity} variant="filled">{snack.msg}</Alert>
      </Snackbar>
    </Container>
  );
};

export default AdminProfile;
