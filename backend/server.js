// Signup Route
app.post("/api/auth/signup", async (req, res) => {
  const { name, email, password } = req.body;
  console.log("📩 Signup request received:", req.body); // <-- log request

  const userExists = await User.findOne({ email });
  if (userExists) {
    console.log("⚠️ User already exists:", email);
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ name, email, password: hashedPassword });
  await user.save();

  console.log("✅ User created:", user); // <-- log saved user

  res.status(201).json({ message: "Signup successful", user });
});
