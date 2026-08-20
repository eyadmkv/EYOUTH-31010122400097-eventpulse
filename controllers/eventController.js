const Event = require('../models/Event');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');

exports.createEvent = asyncHandler(async (req, res) => {
  const event = await Event.create({ ...req.body, organizer: req.user.userId });
  res.status(201).json({ status: 'success', data: event });
});

exports.getEvents = asyncHandler(async (req, res) => {
  const { category, city, startDate, endDate, page = 1, limit = 10, sortBy = 'date', order = 'asc', search } = req.query;
  const filter = {};

  if (category) filter.category = category;
  if (city) filter.city = city;
  if (startDate || endDate) {
    filter.date = {};
    if (startDate) filter.date.$gte = new Date(startDate);
    if (endDate) filter.date.$lte = new Date(endDate);
  }
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }

  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;
  const allowedSort = ['date', 'registrations'].includes(sortBy) ? sortBy : 'date';
  const sortDir = order === 'desc' ? -1 : 1;

  const [data, total] = await Promise.all([
    Event.find(filter).populate('category').sort({ [allowedSort]: sortDir }).skip(skip).limit(limitNum),
    Event.countDocuments(filter)
  ]);

  res.status(200).json({ status: 'success', total, page: pageNum, limit: limitNum, totalPages: Math.ceil(total / limitNum), data });
});

exports.getEventById = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id).populate('category').populate('organizer', 'name email');
  if (!event) throw new AppError('Event not found', 404);
  res.status(200).json({ status: 'success', data: event });
});

exports.updateEvent = asyncHandler(async (req, res) => {
  const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!event) throw new AppError('Event not found', 404);
  res.status(200).json({ status: 'success', data: event });
});

exports.deleteEvent = asyncHandler(async (req, res) => {
  const event = await Event.findByIdAndDelete(req.params.id);
  if (!event) throw new AppError('Event not found', 404);
  res.status(200).json({ status: 'success', message: 'Event deleted' });
});