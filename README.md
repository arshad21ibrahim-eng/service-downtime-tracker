# Public Service Downtime Tracker

A full-stack web application for tracking and reporting public service outages in real-time with community verification.

## 🎯 Features

- **Real-time Outage Reporting**: Report service outages with automatic duplicate detection
- **Community Verification**: Multiple reports increase confidence levels (unverified → likely → confirmed)
- **Live Dashboard**: View all active and resolved outages
- **Analytics**: Service breakdowns, affected areas, and resolution metrics
- **Pattern Insights**: Trends, peak times, and reliability metrics
- **Impact Assessment**: Crisis level tracking and critical service monitoring

## 🛠️ Tech Stack

**Backend:**
- Node.js + Express.js
- MongoDB Atlas (Mongoose)
- CORS enabled
- dotenv for environment variables

**Frontend:**
- React 18 (Vite)
- Tailwind CSS
- Fetch API
- JavaScript (no TypeScript)

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB Atlas account
- npm or yarn

## 🚀 Local Setup

### 1. Clone and Install

```bash
# Backend
cd backend
npm install

# Frontend (in new terminal)
cd frontend
npm install
```

### 2. Configure Backend Environment

Create `backend/.env` file:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/downtime-tracker?retryWrites=true&w=majority
PORT=5000
ADMIN_PASSWORD=your_secure_password_here
```

**Get MongoDB URI:**
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Click "Connect" → "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your database user password

### 3. Run the Application

**Terminal 1 - Backend:**
```bash
cd backend
node server.js
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

**Access:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/outages` | Report new outage or increment existing |
| GET | `/api/outages` | Get all outages (optional `?status=ongoing`) |
| PUT | `/api/outages/:id/restore` | Mark outage as resolved |
| GET | `/api/outages/stats` | Get analytics statistics |
| GET | `/api/outages/insights` | Get pattern insights |
| GET | `/api/outages/impact` | Get impact metrics |
| DELETE | `/api/outages/:id` | Delete outage (requires admin password) |

## 🔒 Admin Features

**Delete Outage:**
- Click "Delete" on any outage
- Enter admin password (from `.env`)
- Uses `x-admin-password` header

## 🌐 Deployment (Render)

### Backend Deployment

1. Create new **Web Service** on Render
2. Connect your repository
3. Configure:
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Environment Variables:**
     ```
     MONGODB_URI=your_mongodb_uri
     PORT=5000
     ADMIN_PASSWORD=your_password
     ```

### Frontend Deployment

1. Create new **Static Site** on Render
2. Connect your repository
3. Configure:
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`
   - **Root Directory:** `frontend`

4. **Update API URL:**
   - Edit `frontend/src/lib/api.js`
   - Change `API_BASE` to your backend URL:
     ```javascript
     const API_BASE = "https://your-backend.onrender.com/api";
     ```

## 📊 Business Logic

### Duplicate Detection
- Same `service` + `area` + `status: "ongoing"` → increments confirmation
- Different area → new outage entry

### Confidence Levels
- 1 confirmation → `unverified`
- 2 confirmations → `likely`
- 3+ confirmations → `confirmed`

### Duration Calculation
```javascript
durationMinutes = (upTime - downTime) / 60000
```

### Crisis Levels
- **Normal:** 0-1 active outages
- **Moderate:** 2-4 active outages
- **High:** 5-9 active outages
- **Critical:** 10+ active outages

## 🎨 Service Types

1. Electricity
2. Water
3. Internet
4. Gas
5. Transportation
6. Healthcare
7. Sanitation
8. Emergency Services

## 🔍 Network Debugging

All API calls are visible in browser DevTools Network tab:
- POST requests for reporting
- GET requests for fetching data
- PUT requests for restoring services
- DELETE requests for admin actions

## 📱 Responsive Design

- Mobile-friendly navigation
- Adaptive grid layouts
- Touch-optimized buttons
- Scrollable tables on small screens

## 🎯 Success Criteria

✅ Outage reporting creates DB records
✅ Duplicate detection increments confirmations
✅ Service restoration calculates duration
✅ Analytics load with live data
✅ Network tab shows all API calls
✅ Deployable to Render without errors

## 🐛 Troubleshooting

**Backend won't start:**
- Check MongoDB URI is correct
- Verify `.env` file exists
- Ensure port 5000 is not in use

**Frontend can't connect:**
- Verify backend is running on port 5000
- Check CORS is enabled
- Inspect Network tab for errors

**Deployment issues:**
- Verify environment variables are set
- Check build logs for errors
- Ensure API_BASE points to deployed backend

## 📄 License

MIT License - feel free to use for any purpose.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open pull request

---

**Built with ❤️ for community resilience**
