const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { getDbConnection } = require('../db/database');

// Ensure uploads dir exists before multer uses it
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer config for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// POST /api/cleaning
router.post('/', upload.fields([{ name: 'before_image', maxCount: 1 }, { name: 'after_image', maxCount: 1 }]), async (req, res) => {
  try {
    const db = await getDbConnection();
    const {
      property_name,
      floor_number,
      room_number,
      cleaner_name,
      cleaner_id,
      cleaning_status,
      cleaning_type,
      priority,
      issues_found,
      notes
    } = req.body;

    const before_image = req.files && req.files['before_image'] ? `/uploads/${req.files['before_image'][0].filename}` : null;
    const after_image = req.files && req.files['after_image'] ? `/uploads/${req.files['after_image'][0].filename}` : null;

    const result = await db.run(`
      INSERT INTO cleaning_logs (
        property_name, floor_number, room_number, cleaner_name, cleaner_id,
        cleaning_status, cleaning_type, priority, issues_found, notes,
        before_image, after_image
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      property_name, floor_number, room_number, cleaner_name, cleaner_id,
      cleaning_status, cleaning_type, priority, issues_found, notes,
      before_image, after_image
    ]);

    res.status(201).json({ id: result.lastID, message: 'Cleaning log created successfully' });
  } catch (error) {
    console.error('Error creating cleaning log:', error);
    res.status(500).json({ error: 'Failed to create cleaning log' });
  }
});

// GET /api/cleaning
router.get('/', async (req, res) => {
  try {
    const db = await getDbConnection();
    const logs = await db.all('SELECT * FROM cleaning_logs ORDER BY created_at DESC');
    res.json(logs);
  } catch (error) {
    console.error('Error fetching logs:', error);
    res.status(500).json({ error: 'Failed to fetch logs' });
  }
});

// GET /api/cleaning/:id
router.get('/:id', async (req, res) => {
  try {
    const db = await getDbConnection();
    const log = await db.get('SELECT * FROM cleaning_logs WHERE id = ?', req.params.id);
    if (!log) {
      return res.status(404).json({ error: 'Log not found' });
    }
    res.json(log);
  } catch (error) {
    console.error('Error fetching log:', error);
    res.status(500).json({ error: 'Failed to fetch log' });
  }
});

module.exports = router;
