const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Mock data for processes
const mockProcesses = [
  { pid: 1234, name: 'python.exe', cpu_percent: 2.5, memory_percent: 1.2, status: 'running', create_time: Date.now() / 1000 - 3600 },
  { pid: 5678, name: 'chrome.exe', cpu_percent: 5.0, memory_percent: 3.4, status: 'running', create_time: Date.now() / 1000 - 7200 }
];

// Mock system info
const mockSystemInfo = {
  cpu_percent: 10.5,
  memory_percent: 45.2,
  disk_percent: 60.0,
  boot_time: Date.now() / 1000 - 86400
};

// Endpoint to get process list and system info
app.get('/processes', (req, res) => {
  res.json({
    processes: mockProcesses,
    system_info: mockSystemInfo
  });
});

// Endpoint to kill a process by PID
app.post('/kill/:pid', (req, res) => {
  const pid = parseInt(req.params.pid);
  const process = mockProcesses.find(p => p.pid === pid);
  if (process) {
    res.json({ success: true, message: `Process ${pid} killed successfully.` });
  } else {
    res.status(404).json({ success: false, message: `Process ${pid} not found.` });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
}); 