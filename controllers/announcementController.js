const Message = require('../models/Message');
const asyncHandler = require('../utils/asyncHandler');

exports.sendAnnouncement = asyncHandler(async (req, res) => {
  const { eventId, text } = req.body;
  const io = req.app.get('io');
  
  const message = await Message.create({ event: eventId, sender: req.user.userId, text });
  const populatedMsg = await Message.findById(message._id).populate('sender', 'name email');
  
  io.to(eventId).emit('announcement', populatedMsg);
  res.status(201).json({ status: 'success', data: populatedMsg });
});

exports.getAnnouncementHistory = asyncHandler(async (req, res) => {
  const messages = await Message.find({ event: req.params.eventId })
    .populate('sender', 'name email')
    .sort({ createdAt: 1 });
  res.status(200).json({ status: 'success', data: messages });
});