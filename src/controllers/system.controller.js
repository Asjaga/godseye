/**
 * System Actions Controller
 * - Alarm control
 * - Notifications (mock)
 * - Emergency call (mock)
 */

// GET system health
export const getSystemStatus = async (req, res) => {
  res.status(200).json({
    status: "OK",
    alarm: "idle",
    notificationService: "mock",
    callService: "mock",
    timestamp: new Date()
  });
};

// POST silence alarm
export const silenceAlarm = async (req, res) => {
  res.status(200).json({
    message: "🔇 Alarm silenced successfully",
    alarm: "silenced",
    timestamp: new Date()
  });
};

// POST notify contacts (mock)
export const notifyContacts = async (req, res) => {
  const { message, contacts } = req.body;

  if (!message) {
    return res.status(400).json({
      message: "Notification message is required"
    });
  }

  res.status(200).json({
    message: "📩 Notifications sent (mock)",
    sentTo: contacts || "default emergency contacts",
    content: message,
    timestamp: new Date()
  });
};

// POST emergency call (mock)
export const triggerEmergencyCall = async (req, res) => {
  const { contact } = req.body;

  res.status(200).json({
    message: "📞 Emergency call triggered (mock)",
    contact: contact || "nearest authority",
    timestamp: new Date()
  });
};
