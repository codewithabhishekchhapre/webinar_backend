// setup.js
const fs = require("fs");
const path = require("path");

const folders = [
  "src/config",
  "src/models",
  "src/controllers",
  "src/routes",  
  "src/middlewares",
  "src/services",
  "src/utils",
  "src/validations",
  "src/docs",
  "tests",
  "logs"
];

const files = {
  "src/app.js": `const express = require("express");
const app = express();
const userRoutes = require("./routes/user.routes");

app.use(express.json());
app.use("/api/users", userRoutes);

module.exports = app;
`,

  "src/server.js": `require("dotenv").config({
  path: \`.env.\${process.env.NODE_ENV || "development"}\`
});
const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;

// DB Connect
connectDB();

// Start server
app.listen(PORT, () => {
  console.log(\`🚀 Server running in \${process.env.NODE_ENV} mode on port \${PORT}\`);
});
`,

  "src/config/db.js": `const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(\`✅ MongoDB Connected: \${conn.connection.host}\`);
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
`,

  "src/models/User.model.js": `const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "seller", "agent", "admin"], default: "user" }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
`,

  "src/controllers/auth.controller.js": `const User = require("../models/User.model");

// @desc Register user
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ success: false, message: "Email already exists" });

    const user = new User({ name, email, password, role });
    await user.save();
    res.status(201).json({ success: true, message: "User registered successfully", data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
`,

  "src/routes/user.routes.js": `const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");

// User registration route
router.post("/register", authController.register);

module.exports = router;
`,

  ".env.development": `PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/baserahub_dev
JWT_SECRET=devSecretKey
`,

  ".env.production": `PORT=8080
NODE_ENV=production
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/baserahub_prod
JWT_SECRET=prodSecretKey
`,

  ".gitignore": `node_modules
.env*
logs
`
};

// Create folders
folders.forEach(folder => {
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
    console.log("📂 Created folder:", folder);
  }
});

// Create files
for (const [filePath, content] of Object.entries(files)) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filePath, content);
  console.log("📄 Created file:", filePath);
}

console.log("\n✅ Project structure setup complete!");
console.log("👉 Run 'npm init -y' and install dependencies:");
console.log("   npm install express mongoose dotenv bcryptjs jsonwebtoken helmet cors express-rate-limit morgan multer  ");
console.log("   npm install --save-dev nodemon jest supertest eslint prettier swagger-ui-express yamljs");
