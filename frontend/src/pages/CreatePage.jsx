import { ArrowLeftIcon } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router";
import { motion } from "framer-motion";
import api from "../lib/axios";
import AnimatedCard from "../components/ui/AnimatedCard";
import AnimatedInput from "../components/ui/AnimatedInput";
import AnimatedButton from "../components/ui/AnimatedButton";
import Navbar from "../components/Navbar";
import ParticlesBackground from "../components/ui/ParticlesBackground";

const CreatePage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState("");
  const [targetLikes, setTargetLikes] = useState("");
  const [creatorEmail, setCreatorEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setImage(reader.result);
    // Add size validation here if needed
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size too large (max 5MB)");
      return;
    }
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim() || !password.trim() || !targetLikes || !creatorEmail) {
      toast.error("All fields are required");
      return;
    }

    setLoading(true);
    try {
      await api.post("/notes", {
        title,
        content,
        password,
        image,
        targetLikes: parseInt(targetLikes),
        creatorEmail
      });

      toast.success("Petition created successfully!");
      navigate("/");
    } catch (error) {
      console.log("Error creating petition", error);
      if (error.response?.status === 429) {
        toast.error("Slow down! You're creating petitions too fast", {
          duration: 4000,
          icon: "💀",
        });
      } else {
        toast.error(
          error.response?.data?.message || "Failed to create petition"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <div className="min-h-screen bg-base-200/50 relative overflow-hidden">
      <Navbar />
      <ParticlesBackground />

      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-primary/5 to-transparent -z-10" />

      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-2xl mx-auto mb-8"
        >
          <Link to={"/"} className="btn btn-ghost group hover:bg-base-200 pl-0">
            <ArrowLeftIcon className="size-5 transition-transform group-hover:-translate-x-1" />
            <span className="text-lg">Back to Petitions</span>
          </Link>
        </motion.div>

        <div className="max-w-2xl mx-auto">
          <AnimatedCard delay={0.1}>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent inline-block">
                Start a Movement
              </h2>
              <p className="text-base-content/60 mt-2">
                Create a petition and gather support for your cause.
              </p>
            </div>

            <motion.form
              onSubmit={handleSubmit}
              className="space-y-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={itemVariants}>
                <AnimatedInput
                  label="Petition Title"
                  placeholder="What do you want to achieve?"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <AnimatedInput
                  label="Description"
                  placeholder="Explain your cause in detail..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                  isTextarea
                />
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div variants={itemVariants}>
                  <AnimatedInput
                    label="Target Signatures"
                    type="number"
                    placeholder="e.g. 100"
                    value={targetLikes}
                    onChange={(e) => setTargetLikes(e.target.value)}
                    required
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <AnimatedInput
                    label="Edit Password"
                    type="password"
                    placeholder="To edit/delete later"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </motion.div>
              </div>

              <motion.div variants={itemVariants}>
                <AnimatedInput
                  label="Your Email"
                  type="email"
                  placeholder="For notifications"
                  value={creatorEmail}
                  onChange={(e) => setCreatorEmail(e.target.value)}
                  required
                />
              </motion.div>

              <motion.div variants={itemVariants} className="form-control w-full">
                <label className="label">
                  <span className="label-text font-medium text-base-content/80">Cover Image (Optional)</span>
                </label>
                <div className="border-2 border-dashed border-base-content/20 rounded-xl p-8 text-center hover:border-primary/50 transition-colors bg-base-200/30">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="image-upload"
                  />

                  {!image ? (
                    <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center gap-2">
                      <div className="w-12 h-12 rounded-full bg-base-200 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                        </svg>
                      </div>
                      <span className="text-sm font-medium">Click to upload image</span>
                      <span className="text-xs text-base-content/50">JPG, PNG up to 5MB</span>
                    </label>
                  ) : (
                    <div className="relative group">
                      <img
                        src={image}
                        alt="Preview"
                        className="max-h-64 mx-auto rounded-lg shadow-md"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setImage("");
                        }}
                        className="absolute top-2 right-2 btn btn-circle btn-sm btn-error opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>

              <div className="pt-4">
                <AnimatedButton
                  type="submit"
                  loading={loading}
                  className="w-full btn-lg text-lg"
                >
                  Launch Petition
                </AnimatedButton>
              </div>
            </motion.form>
          </AnimatedCard>
        </div>
      </div>
    </div>
  );
};

export default CreatePage;
