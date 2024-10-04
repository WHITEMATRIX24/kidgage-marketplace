const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');


// Import routes
const userRoutes = require('./routes/userRoutes'); // Existing routes for business sign-up
const personalRoutes = require('./routes/personalRoutes'); // New routes for personal sign-up
const courseCategoryRoutes = require('./routes/courseCategoryRoutes'); // New routes for course category
const courseRoutes = require('./routes/course');// New routes for courses
const bannerRoutes = require('./routes/bannerRoutes'); // New routes for banners
const posterRoutes = require('./routes/posterRoutes');
const advertisementRoutes = require('./routes/advertisementRoutes');
const VerificationRequest = require('../models/VerificationRequest');


const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json()); // To parse JSON bodies

// Connect to MongoDB
mongoose.connect('mongodb+srv://whitematrix2024:5ah1qr0qo50c7yI7@kidgage.gafztzs.mongodb.net/kidgage?retryWrites=true&w=majority&appName=kidgage', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console
    .error('MongoDB connection error:', err));

// Add routes
app.use('/api/users', userRoutes);
app.use('/api/personal', personalRoutes); // Add the personal routes here
app.use('/api/course-category', courseCategoryRoutes); // Add the course category routes here
app.use('/api/courses', courseRoutes);
app.use('/api/banners', bannerRoutes); // Add the banner routes here
app.use('/api/posters', posterRoutes);
app.use('/api/advertisement', advertisementRoutes);

// Endpoint to handle verification requests
app.post('/api/verify-account', async (req, res) => {
    try {
      // Extract form data from request body
      const { username, email, phoneNumber, description, location, fullName, designation, agreeTerms } = req.body;
      const crFile = req.files ? req.files.crFile : null; // Handle file if present
  
      // Create a new verification request
      const newRequest = new VerificationRequest({
        username,
        email,
        phoneNumber,
        description,
        location,
        fullName,
        designation,
        agreeTerms,
        crFile,
        status: 'Pending', // Initially set status as 'Pending'
      });
  
      await newRequest.save();
      res.status(201).json({ success: true, message: 'Account verification request submitted!' });
    } catch (error) {
      console.error('Error submitting verification request:', error);
      res.status(500).json({ success: false, message: 'Failed to submit verification request.' });
    }
  });
  
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
  });

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
