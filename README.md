# Azzurro Hotels Cleaning Management System

A full-stack web application designed to streamline housekeeping operations for Azzurro Hotels. The system empowers cleaners to seamlessly report room status directly from their mobile devices using real-time browser camera integration, while providing administrators with a comprehensive dashboard to track, filter, and monitor all cleaning activities instantly.

## 🚀 Key Features

### For Cleaners (Mobile-Optimized Form)
- **Live Camera Integration:** Hardware-accelerated camera capture allows workers to take live "Before" and "After" photos of the room directly within the browser without leaving the page.
- **Location details:** Easily specify Property Name, Room Number, and Floor.
- **Task Tracking:** Update task status (Pending, In Progress, Completed), cleaning type, and priority level.
- **Issue Reporting:** Interactive tags to quickly report plumbing, electrical, or other common room issues.

### For Administrators (Dashboard)
- **Real-Time Metrics Grid:** High-level KPIs tracking total tasks, pending tasks, completed tasks, and reported issues.
- **Recent Activity Feed:** Monitor the latest submitted tracking data at a glance.
- **Log Management Table:** Sort and filter historical cleaning logs natively by status or room criteria.
- **Media Viewer:** View before and after photo evidence alongside detailed worker notes.

## 💻 Tech Stack

- **Frontend:** React, React Router, Vite, Tailwind CSS, Lucide React (Icons), React Hot Toast (Notifications)
- **Backend:** Node.js, Express.js, Multer (Multipart Form handling)
- **Database:** SQLite (Local persistence mapped safely on startup)

## 📁 Project Structure

```text
azzurro-cleaning-app/
│
├── backend/                  # Express API Server connecting to SQLite
│   ├── db/                   # Database configuration and persistence
│   ├── routes/               # API endpoint definitions (e.g. /api/cleaning)
│   ├── uploads/              # Local storage for captured photo evidence
│   └── server.js             # Main backend runtime environment
│
└── frontend/                 # React SPA built with Vite and Tailwind
    ├── src/
    │   ├── components/       # Reusable UI elements
    │   ├── pages/            # Core routing view points
    │   ├── index.css         # Tailwind global scopes
    │   ├── App.jsx           # Master layout and Routing setup
    │   └── main.jsx          # Front-end React hook
    └── package.json          
```

## 🛠️ Installation & Setup

Ensure you have [Node.js](https://nodejs.org/) installed before running the project.

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Deepak777/azzurro-cleaning-system.git
   cd azzurro-cleaning-system
   ```

2. **Setup the Backend:**
   Open a terminal and start the Express server. A local SQLite database structure will be initialized automatically!
   ```bash
   cd backend
   npm install
   node server.js
   ```
   *The backend server will run natively on `http://localhost:5000`.*

3. **Setup the Frontend:**
   Open a separate new terminal window and launch the React development server.
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   *The client application will execute precisely on `http://localhost:5173`.*

## 📸 Usage Workflow
1. Navigate directly to `http://localhost:5173` on a desktop or mobile device to view the default **Cleaner Input Form**.
2. Tap the "Tap To Capture" boundaries and allow permissions to trigger the live camera sequence.
3. Fill out and submit the cleaning log safely into the database.
4. Click **"Access Admin Dashboard"** at the bottom of the form (or navigate explicitly to `/admin`) to examine the latest metrics inside the administration panel.

---
*Developed for Azzurro Hotels Internal Tracking Operations.*
