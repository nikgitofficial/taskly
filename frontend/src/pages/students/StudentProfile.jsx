import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import {
  Container, Typography, Card, CardContent, Box, Stack,
  Button, CircularProgress, TextField, Avatar, IconButton
} from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import axios from "../../api/axios";

const StudentProfile = () => {
  const { student, user, refreshStudent } = useAuth();
  const [profile, setProfile] = useState({ name: "", course: "", yearLevel: "", profilePic: "" });
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMsg, setSnackMsg] = useState("");
  const [snackSeverity, setSnackSeverity] = useState("success");

  const showSnack = (message, severity = "success") => {
  setSnackMsg(message);
  setSnackSeverity(severity);
  setSnackOpen(true);
};



  useEffect(() => {
    if (student) {
      setProfile({
        name: student.name,
        course: student.course,
        yearLevel: student.yearLevel,
        profilePic: student.profilePic || "",
      });
    }
  }, [student]);


const handleProfilePicUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  setUploading(true);
  try {
    const formData = new FormData();
    formData.append("file", file);

    const token = localStorage.getItem("token");

    const res = await axios.post("/blob/upload", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    const imageUrl = res.data.url;
    setProfile(prev => ({ ...prev, profilePic: imageUrl }));

    await axios.put("/students/profile", { ...profile, profilePic: imageUrl }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    await refreshStudent();
    showSnack("✅ Profile picture updated!", "success");
  } catch (err) {
    console.error("❌ Upload failed:", err);
    showSnack("❌ Image upload failed.", "error");
  } finally {
    setUploading(false);
  }
};

  // ✅ Profile Info Save Snackbar Added
const handleSaveProfile = async () => {
  setSaving(true);
  try {
    const token = localStorage.getItem("token");
    await axios.put("/students/profile", profile, {
      headers: { Authorization: `Bearer ${token}` }
    });
    await refreshStudent();
    setEditMode(false);
    showSnack("✅ Profile information updated!", "success");
  } catch (err) {
    console.error("❌ Profile update failed:", err);
    showSnack("❌ Failed to update profile info.", "error");
  } finally {
    setSaving(false);
  }
};


  return (
    <Container sx={{ mt: 8, display: "flex", justifyContent: "center" }}>
      <Card sx={{ width: 500, borderRadius: 4, boxShadow: 6 }}>
        <Box
          sx={{
            background: "linear-gradient(135deg, #42a5f5, #1976d2)", p: 4,
            display: "flex", flexDirection: "column", alignItems: "center", color: "#fff",
          }}
        >
          <Box position="relative">
            <Avatar
              src={profile.profilePic}
              sx={{
                width: 100, height: 100, fontSize: 36, bgcolor: "#fff", color: "#1976d2",
                border: "3px solid #fff",
              }}
            >
              {!profile.profilePic && (profile.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase())}
            </Avatar>

            <IconButton
              component="label"
              sx={{
                position: "absolute", bottom: -5, right: -5,
                bgcolor: "#1976d2", color: "#fff", "&:hover": { bgcolor: "#1565c0" },
              }}
              disabled={uploading}
            >
              <PhotoCameraIcon fontSize="small" />
              <input type="file" accept="image/*" hidden onChange={handleProfilePicUpload} />
            </IconButton>
          </Box>

          {uploading && (
            <Typography fontSize={12} mt={1}>Uploading image...</Typography>
          )}

          <Typography variant="h6" mt={2}>Student Profile</Typography>
          <Typography variant="body2">{user?.email}</Typography>
        </Box>

        <CardContent>
          <Stack spacing={2}>
            {editMode ? (
              <>
                <TextField label="Full Name" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} fullWidth />
                <TextField label="Course" value={profile.course} onChange={(e) => setProfile({ ...profile, course: e.target.value })} fullWidth />
                <TextField label="Year Level" value={profile.yearLevel} onChange={(e) => setProfile({ ...profile, yearLevel: e.target.value })} fullWidth />

                <Stack direction="row" spacing={2}>
                  <Button variant="contained" onClick={handleSaveProfile} disabled={saving}>
                    {saving ? <CircularProgress size={20} color="inherit" /> : "Save"}
                  </Button>
                  <Button onClick={() => setEditMode(false)} color="secondary" variant="outlined" disabled={saving}>Cancel</Button>
                </Stack>
              </>
            ) : (
              <>
                <Typography>Full Name: {profile.name || "Not Set"}</Typography>
                <Typography>Course: {profile.course || "Not Set"}</Typography>
                <Typography>Year Level: {profile.yearLevel || "Not Set"}</Typography>
                <Button variant="outlined" onClick={() => setEditMode(true)}>✏️ Edit Profile</Button>
              </>
            )}
          </Stack>
        </CardContent>
      </Card>
      <Snackbar
  open={snackOpen}
  autoHideDuration={3000}
  onClose={() => setSnackOpen(false)}
  anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
>
  <Alert onClose={() => setSnackOpen(false)} severity={snackSeverity} variant="filled">
    {snackMsg}
  </Alert>
</Snackbar>
    </Container>
    
    
  );
  

};

export default StudentProfile;
