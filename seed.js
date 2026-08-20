require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Category = require('./models/Category');
const Event = require('./models/Event');

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  await mongoose.connection.dropDatabase(); // Clear old data

  const admin = await User.create({ name: 'Admin', email: 'admin@eventpulse.com', password: await bcrypt.hash('password123', 12), role: 'admin' });
  const attendee = await User.create({ name: 'Attendee', email: 'user@eventpulse.com', password: await bcrypt.hash('password123', 12), role: 'attendee' });
  
  const cat1 = await Category.create({ name: 'Tech', description: 'Technology events' });
  const cat2 = await Category.create({ name: 'Music', description: 'Music festivals' });

  await Event.create([
    { title: 'Node.js Workshop', description: 'Learn backend', category: cat1._id, date: new Date('2024-12-01'), city: 'Cairo', venue: 'Tech Hub', capacity: 50, organizer: admin._id },
    { title: 'Jazz Night', description: 'Live jazz music', category: cat2._id, date: new Date('2024-12-15'), city: 'Alexandria', venue: 'Opera House', capacity: 100, organizer: admin._id }
  ]);

  console.log('✓ Database seeded successfully');
  process.exit(0);
}
seed().catch(err => { console.error(err); process.exit(1); });