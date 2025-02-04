require('dotenv').config()
const mongoose = require('mongoose');

// Ensure the connection string is correct
mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log('Connection Error:', err));

const deleteAttendance = async () => {
  try {
    const db = mongoose.connection; // Ensure db is accessed after connection
    await db.collection('attendances').deleteMany({}); // Access the collection directly
    console.log('All attendances deleted successfully.');
  } catch (error) {
    console.error('Error deleting attendances:', error);
  }
};

// Ensure this runs after connection is open
mongoose.connection.once('open', deleteAttendance);
