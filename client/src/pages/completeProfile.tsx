import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { User, GraduationCap, School, Globe, Linkedin, Phone, Calendar, ImageIcon, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { uploadAvatar } from "@/utils/uploadAvatar";
import { toast } from "sonner";


export default function CompleteProfile() {
  const { user, UpdateProfile } = useAuth();
  const [academic_level, setAcademicLevel] = useState("")
  const [study_field, setStudyField] = useState("")
  const [institution, setInstitution] = useState("")
  const [country, setCountry] = useState("")
  const [phone_number, setPhoneNumber] = useState("")
  const [language, setLanguage] = useState("")
  const [linkedin, setLinkedin] = useState("")
  const [dob, setDob] = useState("")
  const [gender, setGender] = useState("")
  const [research_interest, setInterest] = useState("")
  const [bio, setBio] = useState("")
  const [avatar_url, setAvatar] = useState("")
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [website, setWebsite] = useState("")
  const [loading, setLoading] = useState<boolean>(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true)
      let uploadedUrl = avatar_url
      if (avatarFile) {
        uploadedUrl = await uploadAvatar(avatarFile, user.id);
        setAvatar(uploadedUrl);
      }
      const success = await UpdateProfile(
        academic_level,
        study_field,
        institution,
        country,
        phone_number,
        language,
        linkedin,
        website,
        dob,
        gender,
        research_interest,
        bio,
        uploadedUrl  // ✅ use the updated URL!
      );

      if (success) {
        toast.success("Profile Updated")
        console.log("Profile updated", success)
        return success
      } else {
        toast.error("Could not update profile");
      }
    } catch (error) {
      console.log(error || error.message || "There was an error while updating profile info")
    } finally {
      setLoading(false)
    }
  };


  useEffect(() => {
    if (user) {
      setAcademicLevel(user.academic_level || "");
      setStudyField(user.study_field || "");
      setInstitution(user.institution || "");
      setCountry(user.country || "");
      setPhoneNumber(user.phone_number || "");
      setLanguage(user.language || "");
      setLinkedin(user.linkedin || "");
      setWebsite(user.website || "");
      setDob(user.dob || "");
      setGender(user.gender || "");
      setInterest(user.research_interest || "");
      setBio(user.bio || "");
      setAvatar(user.avatar_url || "");
    }
  }, [user]);




  return (
    <div className="min-h-screen py-12 px-4 md:px-6 bg-muted/50">
      <form onSubmit={handleSubmit}>
        <div className="max-w-3xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-1 flex items-center gap-2 text-primary">
              <User className="w-5 h-5" />
              Complete Your Profile
            </h1>
            <p className="text-sm text-muted-foreground">
              Help us personalize your experience on Acadex.
            </p>
          </div>

          <div className="space-y-6 bg-background rounded-xl p-6 shadow border">
            {/* Name & Email (Read-only) */}
            <div>
              <label className="block text-sm font-medium mb-1">Full Name</label>
              <Input type="text" value={user?.full_name} readOnly />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <Input type="email" value={user?.email} readOnly />
            </div>

            {/* Academic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Academic Level</label>
                <Input value={academic_level}
                  onChange={(e) => setAcademicLevel(e.target.value)} placeholder="Undergraduate, Graduate, etc." />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Field of Study</label>
                <Input value={study_field} onChange={(e) => setStudyField(e.target.value)} placeholder="Computer Science, Biology, etc." />
              </div>
            </div>

            {/* Institution Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">School / Institution</label>
                <Input value={institution} onChange={(e) => setInstitution(e.target.value)} placeholder="Harvard University" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Country</label>
                <Input value={country} onChange={(e) => setCountry(e.target.value)} placeholder="United States, United Kingdom etc." />
              </div>
            </div>

            {/* Additional Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Phone Number</label>
                <Input value={phone_number} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="+1 410 000 0000" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Preferred Language</label>
                <Input value={language} onChange={(e) => setLanguage(e.target.value)} placeholder="English, French, etc." />
              </div>
            </div>

            {/* Online Presence */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">LinkedIn Profile</label>
                <Input value={linkedin} onChange={(e) => setLinkedin(e.target.value)} placeholder="https://linkedin.com/in/username" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Portfolio / Website</label>
                <Input value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://yourportfolio.com" />
              </div>
            </div>

            {/* Personal Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Date of Birth</label>
                <Input value={dob} onChange={(e) => setDob(e.target.value)} type="date" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Gender</label>
                <Input value={gender} onChange={(e) => setGender(e.target.value)} placeholder="Male, Female, Non-binary..." />
              </div>
            </div>

            {/* Research & Bio */}
            <div>
              <label className="block text-sm font-medium mb-1">Research Interests</label>
              <Textarea value={research_interest} onChange={(e) => setInterest(e.target.value)} placeholder="e.g., AI, Machine Learning, Neuroscience..." />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Short Bio</label>
              <Textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Tell us about yourself..." rows={4} />
            </div>

            {/* Profile Picture Upload */}
            <div>
              <label className=" text-sm font-medium mb-1 flex items-center gap-1">

                <ImageIcon className="w-4 h-4" />
                Profile Photo
              </label>
              <Input type="file" onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setAvatarFile(file)
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setAvatar(reader.result as string); // base64 string
                  };
                  reader.readAsDataURL(file);
                }
              }} accept="image/*" />

            </div>

            {/* Submit */}
            <div className="pt-2">
              <Button type="submit" className="w-full md:w-auto px-6 text-base">
                {loading ? (
                  <Loader2 className="animate-spin h-5 w-5" />
                ) : (
                  "Update Profile"
                )} </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
