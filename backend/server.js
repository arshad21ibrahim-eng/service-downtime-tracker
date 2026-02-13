const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => console.error('❌ MongoDB Error:', err));

// Outage Schema
const outageSchema = new mongoose.Schema({
  service: {
    type: String,
    required: true,
    enum: [
      "Electricity",
      "Water",
      "Internet",
      "Gas",
      "Transportation",
      "Healthcare",
      "Sanitation",
      "Emergency Services"
    ]
  },
  area: {
    type: String,
    required: true
  },
  downTime: {
    type: Date,
    required: true,
    default: Date.now
  },
  upTime: {
    type: Date,
    default: null
  },
  durationMinutes: {
    type: Number,
    default: null
  },
  status: {
    type: String,
    enum: ["ongoing", "resolved"],
    default: "ongoing"
  },
  confirmCount: {
    type: Number,
    default: 1
  },
  confidenceLevel: {
    type: String,
    enum: ["unverified", "likely", "confirmed"],
    default: "unverified"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Outage = mongoose.model('Outage', outageSchema);

// Helper: Calculate confidence level
function calculateConfidence(count) {
  if (count >= 3) return "confirmed";
  if (count === 2) return "likely";
  return "unverified";
}

// POST /api/outages - Report new outage or increment existing
app.post('/api/outages', async (req, res) => {
  try {
    const { service, area } = req.body;

    if (!service || !area) {
      return res.status(400).json({ error: 'Service and area are required' });
    }

    // Check for duplicate ongoing outage
    const existing = await Outage.findOne({
      service,
      area: new RegExp(`^${area}$`, 'i'),
      status: "ongoing"
    });

    if (existing) {
      // Increment confirmation count
      existing.confirmCount += 1;
      existing.confidenceLevel = calculateConfidence(existing.confirmCount);
      await existing.save();
      
      return res.status(200).json({
        message: 'Outage confirmation recorded',
        outage: existing,
        isDuplicate: true
      });
    }

    // Create new outage
    const newOutage = new Outage({
      service,
      area,
      downTime: new Date(),
      status: "ongoing",
      confirmCount: 1,
      confidenceLevel: "unverified"
    });

    await newOutage.save();
    
    res.status(201).json({
      message: 'New outage reported',
      outage: newOutage,
      isDuplicate: false
    });
  } catch (error) {
    console.error('Error creating outage:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/outages - Get all outages
app.get('/api/outages', async (req, res) => {
  try {
    const { status } = req.query;
    
    const filter = status ? { status } : {};
    const outages = await Outage.find(filter).sort({ createdAt: -1 });
    
    res.json(outages);
  } catch (error) {
    console.error('Error fetching outages:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/outages/:id/restore - Mark outage as resolved
app.put('/api/outages/:id/restore', async (req, res) => {
  try {
    const outage = await Outage.findById(req.params.id);

    if (!outage) {
      return res.status(404).json({ error: 'Outage not found' });
    }

    if (outage.status === "resolved") {
      return res.status(400).json({ error: 'Outage already resolved' });
    }

    // Calculate duration
    const upTime = new Date();
    const durationMinutes = Math.round((upTime - outage.downTime) / 60000);

    outage.status = "resolved";
    outage.upTime = upTime;
    outage.durationMinutes = durationMinutes;

    await outage.save();

    res.json({
      message: 'Service restored',
      outage
    });
  } catch (error) {
    console.error('Error restoring outage:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/outages/stats - Analytics data
app.get('/api/outages/stats', async (req, res) => {
  try {
    const totalOutages = await Outage.countDocuments();
    const ongoingOutages = await Outage.countDocuments({ status: "ongoing" });
    const resolvedOutages = await Outage.countDocuments({ status: "resolved" });

    // Average resolution time (only for resolved outages)
    const resolved = await Outage.find({ 
      status: "resolved", 
      durationMinutes: { $ne: null } 
    });
    
    const avgResolutionTime = resolved.length > 0
      ? Math.round(resolved.reduce((sum, o) => sum + o.durationMinutes, 0) / resolved.length)
      : 0;

    // Service breakdown
    const serviceBreakdown = await Outage.aggregate([
      {
        $group: {
          _id: "$service",
          count: { $sum: 1 },
          ongoing: {
            $sum: { $cond: [{ $eq: ["$status", "ongoing"] }, 1, 0] }
          }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Most affected areas
    const areaBreakdown = await Outage.aggregate([
      {
        $group: {
          _id: "$area",
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      totalOutages,
      ongoingOutages,
      resolvedOutages,
      avgResolutionTime,
      serviceBreakdown,
      areaBreakdown
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/outages/insights - Pattern insights
app.get('/api/outages/insights', async (req, res) => {
  try {
    // Recent trends (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentOutages = await Outage.countDocuments({
      createdAt: { $gte: sevenDaysAgo }
    });

    // Most reliable service (fewest outages)
    const serviceCounts = await Outage.aggregate([
      {
        $group: {
          _id: "$service",
          count: { $sum: 1 }
        }
      },
      { $sort: { count: 1 } },
      { $limit: 1 }
    ]);

    const mostReliable = serviceCounts[0] || { _id: "N/A", count: 0 };

    // Peak outage time analysis
    const hourlyDistribution = await Outage.aggregate([
      {
        $project: {
          hour: { $hour: "$downTime" }
        }
      },
      {
        $group: {
          _id: "$hour",
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 1 }
    ]);

    const peakHour = hourlyDistribution[0] ? hourlyDistribution[0]._id : 0;

    // Confidence levels
    const confidenceLevels = await Outage.aggregate([
      {
        $group: {
          _id: "$confidenceLevel",
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      recentOutages,
      mostReliableService: mostReliable._id,
      mostReliableCount: mostReliable.count,
      peakOutageHour: peakHour,
      confidenceLevels
    });
  } catch (error) {
    console.error('Error fetching insights:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/outages/impact - Impact metrics
app.get('/api/outages/impact', async (req, res) => {
  try {
    // Critical services affected
    const criticalServices = ["Electricity", "Water", "Healthcare", "Emergency Services"];
    const criticalOutages = await Outage.countDocuments({
      service: { $in: criticalServices },
      status: "ongoing"
    });

    // Total downtime hours
    const resolved = await Outage.find({
      status: "resolved",
      durationMinutes: { $ne: null }
    });

    const totalDowntimeHours = resolved.length > 0
      ? Math.round(resolved.reduce((sum, o) => sum + o.durationMinutes, 0) / 60)
      : 0;

    // Longest outage
    const longestOutage = await Outage.findOne({
      status: "resolved",
      durationMinutes: { $ne: null }
    }).sort({ durationMinutes: -1 });

    // Current crisis level
    const ongoingCount = await Outage.countDocuments({ status: "ongoing" });
    let crisisLevel = "Normal";
    if (ongoingCount >= 10) crisisLevel = "Critical";
    else if (ongoingCount >= 5) crisisLevel = "High";
    else if (ongoingCount >= 2) crisisLevel = "Moderate";

    res.json({
      criticalOutages,
      totalDowntimeHours,
      longestOutage: longestOutage ? {
        service: longestOutage.service,
        area: longestOutage.area,
        durationMinutes: longestOutage.durationMinutes
      } : null,
      crisisLevel,
      ongoingCount
    });
  } catch (error) {
    console.error('Error fetching impact:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/outages/:id - Admin delete
app.delete('/api/outages/:id', async (req, res) => {
  try {
    const adminPassword = req.headers['x-admin-password'];

    if (!adminPassword || adminPassword !== process.env.ADMIN_PASSWORD) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const outage = await Outage.findByIdAndDelete(req.params.id);

    if (!outage) {
      return res.status(404).json({ error: 'Outage not found' });
    }

    res.json({ message: 'Outage deleted', outage });
  } catch (error) {
    console.error('Error deleting outage:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
