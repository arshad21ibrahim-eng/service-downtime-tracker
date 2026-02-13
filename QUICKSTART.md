# 🚀 QUICK START GUIDE - Public Service Downtime Tracker

## ⚡ 5-Minute Setup

### Step 1: Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend (new terminal)
cd frontend
npm install
```

### Step 2: Configure Database

1. **Get MongoDB Atlas URI:**
   - Go to https://www.mongodb.com/cloud/atlas/register
   - Create FREE cluster (M0 Sandbox)
   - Click "Connect" → "Connect your application"
   - Copy connection string

2. **Create backend/.env:**
   ```env
   MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/downtime-tracker?retryWrites=true&w=majority
   PORT=5000
   ADMIN_PASSWORD=admin123
   ```

### Step 3: Start Application

**Terminal 1 - Backend:**
```bash
cd backend
node server.js
```
✅ Should see: "✅ MongoDB Connected" and "🚀 Server running on port 5000"

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
✅ Should see: "VITE ready" with local URL

### Step 4: Test

1. Open http://localhost:3000
2. Click "Report Outage"
3. Select service (e.g., "Electricity")
4. Enter area (e.g., "Downtown")
5. Click "Report Outage"
6. ✅ Should see success message
7. Click "Live Dashboard" to see your outage

### Step 5: Verify API Calls

1. Open browser DevTools (F12)
2. Go to Network tab
3. Report another outage
4. ✅ You should see POST request to `/api/outages`
5. ✅ Response should show outage data

## 🌐 Deploy to Production (Render.com)

### Backend Deployment

1. Go to https://render.com (sign up free)
2. Click "New +" → "Web Service"
3. Connect your GitHub repo
4. Configure:
   - **Name:** downtime-tracker-api
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Environment Variables:**
     - `MONGODB_URI` = your MongoDB connection string
     - `PORT` = 5000
     - `ADMIN_PASSWORD` = your_secure_password
5. Click "Create Web Service"
6. Wait for deployment (2-3 minutes)
7. Copy your backend URL (e.g., `https://downtime-tracker-api.onrender.com`)

### Frontend Deployment

1. **Update API URL First:**
   - Edit `frontend/src/lib/api.js`
   - Change line 1:
     ```javascript
     const API_BASE = "https://YOUR-BACKEND-URL.onrender.com/api";
     ```
   - Commit and push changes

2. On Render, click "New +" → "Static Site"
3. Connect your GitHub repo
4. Configure:
   - **Name:** downtime-tracker-frontend
   - **Root Directory:** `frontend`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`
5. Click "Create Static Site"
6. Wait for deployment (2-3 minutes)
7. Your app is live! 🎉

## ✅ Post-Deployment Checklist

- [ ] Backend health check: `https://your-backend.onrender.com/health`
- [ ] Frontend loads without errors
- [ ] Can report an outage
- [ ] Outage appears in Live Dashboard
- [ ] Network tab shows API requests
- [ ] Analytics page loads data
- [ ] Insights page loads data
- [ ] Impact page loads data

## 🐛 Common Issues

**"Cannot connect to MongoDB"**
→ Check MongoDB URI in .env (remove brackets, use actual password)

**"CORS error"**
→ Backend must be running before frontend

**"Network request failed"**
→ Verify API_BASE URL in frontend/src/lib/api.js

**"Render deployment failed"**
→ Check build logs, ensure all dependencies in package.json

## 📊 Test Data

Report these to see the app in action:

1. Electricity - Downtown (ongoing)
2. Water - North District (ongoing)
3. Internet - West End (ongoing)
4. Report "Electricity - Downtown" again (increases confirmation)
5. Mark "Water - North District" as restored
6. View Analytics → See statistics
7. View Insights → See patterns
8. View Impact → See crisis level

## 🎯 Features to Try

1. **Duplicate Detection:** Report same outage twice → confirmation count increases
2. **Confidence Levels:** 1 report = unverified, 2 = likely, 3+ = confirmed
3. **Service Restoration:** Click "Mark Restored" to calculate duration
4. **Admin Delete:** Enter password to delete any outage
5. **Real-time Updates:** Click refresh buttons to see latest data

## 📱 Mobile Testing

- Responsive design works on all screen sizes
- Test on mobile browser
- Navigation tabs scroll horizontally
- Forms are touch-optimized

## 🔒 Security Notes

- Admin password stored in backend .env only
- No user authentication (as specified)
- MongoDB credentials never exposed to frontend
- CORS properly configured

## 💡 Next Steps

- Add more test data
- Explore analytics patterns
- Test on different devices
- Share with community
- Monitor impact dashboard

---

**Questions? Check the main README.md for detailed documentation.**
