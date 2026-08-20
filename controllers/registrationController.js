const Registration = require('../models/Registration');
const Event = require('../models/Event');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');

exports.registerForEvent = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const { event: eventId } = req.body;
  
  const event = await Event.findById(eventId);
  if (!event) throw new AppError('Event not found', 404);

  const existing = await Registration.findOne({ event: eventId, attendee: userId });
  if (existing) throw new AppError('You are already registered for this event', 400);

  const currentCount = await Registration.countDocuments({ event: eventId });
  if (currentCount >= event.capacity) throw new AppError('This event is full', 400);

  const registration = await Registration.create({ event: eventId, attendee: userId });
  res.status(201).json({ status: 'success', data: registration });
});

exports.getMyRegistrations = asyncHandler(async (req, res) => {
  const registrations = await Registration.find({ attendee: req.user.userId }).populate('event');
  res.status(200).json({ status: 'success', data: registrations });
});

exports.cancelRegistration = asyncHandler(async (req, res) => {
  const registration = await Registration.findById(req.params.id);
  if (!registration) throw new AppError('Registration not found', 404);
  if (registration.attendee.toString() !== req.user.userId) throw new AppError('You can only cancel your own registration', 403);
  
  await registration.deleteOne();
  res.status(200).json({ status: 'success', message: 'Registration cancelled successfully' });
});