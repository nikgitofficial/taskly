import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import { Container, Typography, Card, CardContent, Box, Stack, Button, CircularProgress, TextField } from "@mui/material";
import axios from "../../api/axios";

const StudentProfile = () => {
  const { student, user, refreshStudent } = useAuth();
  const [profile, setProfile] = useState({ name: "", course: "", yearLevel: "" });
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (student) {
      setProfile({
        name: student.name,
        course: student.course,
        yearLevel: student.yearLevel,
      });
    }
  }, [student]);

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      await axios.put("/students/profile", profile);
      await refreshStudent();
      setEditMode(false);
    } catch (err) {
      console.error("❌ Failed to update profile:", err.response?.data);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Container sx={{ mt: 8, display: "flex", justifyContent: "center" }}>
      <Card sx={{ width: 500, borderRadius: 4, boxShadow: 6 }}>
        <Box sx={{ backgroundColor: "primary.main", p: 3, color: "#fff" }}>
          <Typography variant="h6">Student Profile</Typography>
        </Box>
        <CardContent>
          <Stack spacing={2}>
            <Typography>Email: {user?.email}</Typography>

            {editMode ? (
              <>
                <TextField label="Full Name" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} fullWidth />
                <TextField label="Course" value={profile.course} onChange={(e) => setProfile({ ...profile, course: e.target.value })} fullWidth />
                <TextField label="Year Level" value={profile.yearLevel} onChange={(e) => setProfile({ ...profile, yearLevel: e.target.value })} fullWidth />
                <Stack direction="row" spacing={2}>
                  <Button onClick={handleSaveProfile} variant="contained" disabled={saving} startIcon={saving && <CircularProgress size={18} />}>
                    {saving ? "Saving..." : "Save"}
                  </Button>
                  <Button onClick={() => setEditMode(false)} color="secondary" variant="outlined">Cancel</Button>
                </Stack>
              </>
            ) : (
              <>
                <Typography>Full Name: {profile.name}</Typography>
                <Typography>Course: {profile.course}</Typography>
                <Typography>Year Level: {profile.yearLevel}</Typography>
                <Button variant="outlined" onClick={() => setEditMode(true)}>✏️ Edit Profile</Button>
              </>
            )}
          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
};

export default StudentProfile;
