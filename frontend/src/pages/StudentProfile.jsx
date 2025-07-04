import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Avatar,
  Box,
  Stack,
  Button,
  IconButton,
  CircularProgress,
  TextField,
} from "@mui/material";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import axios from "../api/axios";

const StudentProfile = () => {
  const { student, user, refreshStudent } = useAuth();
  const [profile, setProfile] = useState({
    name: "",
    course: "",
    yearLevel: "",
  });
  const [originalProfile, setOriginalProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  

  useEffect(() => {
    if (student) {
      const data = {
        name: student.name || "",
        course: student.course || "",
        yearLevel: student.yearLevel || "",
      };
      setProfile(data);
      setOriginalProfile(data);
      setPreview(student.profilePic || null);
    }
  }, [student]);

  useEffect(() => {
    if (!profilePicFile) return;
    const url = URL.createObjectURL(profilePicFile);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [profilePicFile]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setProfilePicFile(file);
  };

  const handleUpload = async () => {
    if (!profilePicFile) return;
    setUploading(true);
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("file", profilePicFile);

      const res = await axios.post("/students/profile-pic", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      await refreshStudent(res.data);
      setProfilePicFile(null);
    } catch (err) {
      console.error("📛 Profile pic upload failed:", err);
      alert("Failed to upload profile picture.");
    } finally {
      setUploading(false);
    }
  };

  const handleSaveProfile = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.put("/students/profile", profile, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    await refreshStudent(res.data); // to refresh context
    setEditMode(false);
  } catch (err) {
    console.error("❌ Failed to update profile:", err);
    alert("Failed to update profile");
  }
};

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleCancel = () => {
    setProfile(originalProfile);
    setEditMode(false);
  };

  return (
    <Container sx={{ mt: 8, display: "flex", justifyContent: "center" }}>
      <Card sx={{ width: 500, borderRadius: 4, boxShadow: 6 }}>
        {/* Header */}
        {/* Header */}
<Box
  sx={{
    backgroundColor: "primary.main",
    p: 3,
    display: "flex",
    alignItems: "center",
    gap: 2,
    color: "#fff",
    position: "relative",
    flexWrap: "wrap",
  }}
>
  <Avatar
    src={preview}
    sx={{
      width: 64,
      height: 64,
      bgcolor: "#fff",
      color: "primary.main",
      fontWeight: "bold",
    }}
  >
    {!preview && (student?.name?.charAt(0) || user?.email?.charAt(0))}
  </Avatar>

  <Typography variant="h6" flexGrow={1}>
    {student?.name || "Student"}
  </Typography>

  {/* Camera Upload */}
  <IconButton color="inherit" component="label">
    <input hidden accept="image/*" type="file" onChange={handleFileChange} />
    <PhotoCamera />
  </IconButton>

  {/* Save Photo Button (only shows when file is selected) */}
  {profilePicFile && (
    <Stack
      direction="row"
      spacing={1}
      sx={{ width: "100%", mt: 2, justifyContent: "flex-end" }}
    >
      <Button
        variant="outlined"
        color="success"
        onClick={handleUpload}
        disabled={uploading}
        startIcon={uploading && <CircularProgress size={18} />}
      >
        {uploading ? "Saving..." : "Save Photo"}
      </Button>
      <Button
        variant="outlined"
        color="error"
        onClick={() => {
          setProfilePicFile(null);
          setPreview(student?.profilePic || null);
        }}
      >
        Cancel
      </Button>
    </Stack>
  )}
</Box>


        {/* Content */}
        <CardContent>
        <Stack spacing={2}>
  <Typography variant="body2" color="text.secondary">
    Email: {user?.email}
  </Typography>

  {editMode ? (
    <>
      <TextField
        label="Full Name"
        value={profile.name}
        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
        fullWidth
      />
      <TextField
        label="Course"
        value={profile.course}
        onChange={(e) => setProfile({ ...profile, course: e.target.value })}
        fullWidth
      />
      <TextField
        label="Year Level"
        value={profile.yearLevel}
        onChange={(e) => setProfile({ ...profile, yearLevel: e.target.value })}
        fullWidth
      />
      <Stack direction="row" spacing={2}>
        <Button onClick={handleSaveProfile} variant="contained">
          Save
        </Button>
        <Button onClick={() => setEditMode(false)} color="secondary">
          Cancel
        </Button>
      </Stack>
    </>
  ) : (
    <>
      <Typography variant="subtitle1">Full Name: {profile.name}</Typography>
      <Typography variant="subtitle1">Course: {profile.course}</Typography>
      <Typography variant="subtitle1">Year Level: {profile.yearLevel}</Typography>

      <Button variant="outlined" onClick={() => setEditMode(true)}>
        ✏️ Edit Profile
      </Button>
    </>
  )}
</Stack>


        </CardContent>
      </Card>
    </Container>
  );
};

export default StudentProfile;
