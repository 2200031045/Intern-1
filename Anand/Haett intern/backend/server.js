const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 5000;

let users = [
  {
    id: 1,
    name: "Admin",
    email: "admin@test.com",
    password: "admin123",
    role: "admin",
  },
  {
    id: 2,
    name: "User",
    email: "user@test.com",
    password: "user123",
    role: "user",
  },
];

let applications = [];
let codes = [];

function makeCode(name) {
  return (
    name.toUpperCase().replace(/\s/g, "").slice(0, 5) +
    Math.floor(1000 + Math.random() * 9000)
  );
}

app.get("/", (req, res) => {
  res.send("Backend is running");
});

app.post("/api/login", (req, res) => {
  const email = req.body.email?.trim();
  const password = req.body.password?.trim();

  const user = users.find(
    (u) => u.email === email && u.password === password
  );

  if (!user) {
    return res.status(401).json({ message: "Invalid login" });
  }

  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  });
});

app.get("/api/partner/:userId", (req, res) => {
  const userId = Number(req.params.userId);

  const application = applications.find((a) => a.userId === userId) || null;
  const userCodes = codes.filter((c) => c.userId === userId);

  res.json({
    application,
    codes: userCodes,
  });
});

app.post("/api/apply", (req, res) => {
  const data = req.body;

  if (!data.partnerType || !data.businessName) {
    return res.status(400).json({
      message: "Partner type and business name are required",
    });
  }

  applications = applications.filter((a) => a.userId !== data.userId);

  const newApplication = {
    id: Date.now(),
    userId: data.userId,
    name: data.name,
    email: data.email,
    partnerType: data.partnerType,
    businessName: data.businessName,
    phone: data.phone || "",
    socialLink: data.socialLink || "",
    audienceSize: data.audienceSize || "",
    description: data.description || "",
    status: "pending",
    appliedAt: new Date().toLocaleDateString(),
    approvedAt: null,
    rejectionReason: "",
  };

  applications.push(newApplication);

  res.json(newApplication);
});

app.get("/api/admin/applications", (req, res) => {
  res.json(applications);
});

app.post("/api/admin/approve/:id", (req, res) => {
  const id = Number(req.params.id);

  const application = applications.find((a) => a.id === id);

  if (!application) {
    return res.status(404).json({ message: "Application not found" });
  }

  application.status = "approved";
  application.approvedAt = new Date().toLocaleDateString();

  const code = {
    id: Date.now(),
    userId: application.userId,
    applicationId: application.id,
    code: makeCode(application.businessName),
    active: true,
    discount: "20% off",
    used: 0,
    totalDiscount: 0,
    expiry: "31-12-2026",
  };

  codes.push(code);

  res.json({
    application,
    code,
  });
});

app.post("/api/admin/reject/:id", (req, res) => {
  const id = Number(req.params.id);
  const reason = req.body.reason;

  if (!reason) {
    return res.status(400).json({ message: "Reject reason required" });
  }

  const application = applications.find((a) => a.id === id);

  if (!application) {
    return res.status(404).json({ message: "Application not found" });
  }

  application.status = "rejected";
  application.rejectionReason = reason;

  res.json(application);
});

app.post("/api/admin/code-toggle/:id", (req, res) => {
  const id = Number(req.params.id);

  const code = codes.find((c) => c.id === id);

  if (!code) {
    return res.status(404).json({ message: "Code not found" });
  }

  code.active = !code.active;

  res.json(code);
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});