import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import {
  Container, Typography, Card, CardContent, Box, Stack,
  Button, CircularProgress, TextField, Avatar, IconButton,
  Snackbar, Alert
} from "@mui/material";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import axios from "../../api/axios";

const EmployeeProfile = () => {
  const { employee, user, refreshEmployee } = useAuth();
  const [profile, setProfile] = useState({ name: "", department: "", position: "", profilePic: "" });
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [snack, setSnack] = useState({ open: false, msg: "", severity: "success" });

  const showSnack = (msg, severity = "success") => setSnack({ open: true, msg, severity });

  useEffect(() => {
    if (employee) {
      setProfile({
        name: employee.name || "",
        department: employee.department || "",
        yearLevel: employee.position || "",
        profilePic: employee.profilePic || "",
      });
    }
  }, [employee]);

  const handleProfilePicUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await axios.post("/employees-profile/profile/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setProfile(prev => ({ ...prev, profilePic: res.data.url }));
      await refreshEmployee();
      showSnack("✅ Profile picture updated!");
    } catch (err) {
      console.error("❌ Upload error:", err);
      showSnack("❌ Image upload failed.", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      await axios.put("/employees-profile/profile", {
        name: profile.name,
        department: profile.department,
        position: profile.postion
      });
      await refreshEmployee();
      setEditMode(false);
      showSnack("✅ Profile information updated!");
    } catch (err) {
      console.error("❌ Save profile error:", err);
      showSnack("❌ Failed to update profile info.", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Container sx={{ mt: 8, display: "flex", justifyContent: "center" }}>
      <Card sx={{ width: 500, borderRadius: 4, boxShadow: 6 }}>
        <Box sx={{
          background: "linear-gradient(135deg, #42a5f5, #1976d2)",
          p: 4, color: "#fff", display: "flex", flexDirection: "column", alignItems: "center"
        }}>
          <Box position="relative">
            <Avatar src={profile.profilePic} sx={{
              width: 100, height: 100, fontSize: 36,
              bgcolor: "#fff", color: "#1976d2", border: "3px solid #fff"
            }}>
              {!profile.profilePic && (profile.name?.[0] || user?.email?.[0])?.toUpperCase()}
            </Avatar>
            <IconButton component="label" sx={{
              position: "absolute", bottom: -5, right: -5,
              bgcolor: "#1976d2", color: "#fff"
            }} disabled={uploading}>
              <PhotoCameraIcon fontSize="small" />
              <input type="file" accept="image/*" hidden onChange={handleProfilePicUpload} />
            </IconButton>
          </Box>
          {uploading && <Typography fontSize={12} mt={1}>Uploading...</Typography>}
          <Typography variant="h6" mt={2}>Employee Profile</Typography>
          <Typography variant="body2">{user?.email}</Typography>
        </Box>

        <CardContent>
          <Stack spacing={2}>
            {editMode ? (
              <>
                <TextField label="Full Name" value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })} fullWidth />
                <TextField label="Course" value={profile.department}
                  onChange={(e) => setProfile({ ...profile, department: e.target.value })} fullWidth />
                <TextField label="Year Level" value={profile.postion}
                  onChange={(e) => setProfile({ ...profile, postion: e.target.value })} fullWidth />
                <Stack direction="row" spacing={2}>
                  <Button variant="contained" onClick={handleSaveProfile} disabled={saving}>
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

export default EmployeeProfile;

