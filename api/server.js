const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware
app.use(cors());
app.use(express.json());


app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
  });


// Database connection
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'Travels',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: {
    rejectUnauthorized: true
  }
});
// Authentication middleware
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    const decoded = jwt.verify(token, JWT_SECRET);
    
 
    const [rows] = await pool.execute(
      'SELECT User_ID, Name, Email FROM USER WHERE User_ID = ?',
      [decoded.userId]
    );
    
    if (rows.length === 0) {
      return res.status(401).json({ message: 'User not found' });
    }
    
   
    req.user = rows[0];
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};



app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;
    

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }
    
    // Check if user already exists
    const [existingUsers] = await pool.execute(
      'SELECT * FROM USER WHERE Email = ?',
      [email]
    );
    
    if (existingUsers.length > 0) {
      return res.status(409).json({ message: 'User with this email already exists' });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Generate user ID

    const userId = 'U' + Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    

    await pool.execute(
      'INSERT INTO USER (User_ID, Name, Email, Phone_Number, Address, Password) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, name, email, phone || null, address || null, hashedPassword]
    );
    
    // Create token
    const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '24h' });
    
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: userId,
        name,
        email
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      
      console.log('Login attempt for:', email);
      

      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
      }
      
 
      const [users] = await pool.execute(
        'SELECT User_ID, Name, Email, Password FROM USER WHERE Email = ?',
        [email]
      );
      
      console.log('User found:', users.length > 0);
      
      if (users.length === 0) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      
      const user = users[0];
      

      console.log('Comparing password with hash:', password, user.Password.substring(0, 10) + '...');
      const isPasswordValid = await bcrypt.compare(password, user.Password);
      
      console.log('Password valid:', isPasswordValid);
      
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      
 
      const token = jwt.sign({ userId: user.User_ID }, JWT_SECRET, { expiresIn: '24h' });
      
      res.json({
        message: 'Login successful',
        token,
        user: {
          id: user.User_ID,
          name: user.Name,
          email: user.Email
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

app.get('/api/auth/me', authenticateToken, (req, res) => {
  res.json({ user: req.user });
});


app.get('/api/destinations', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM DESTINATION'
    );
    
    res.json(rows);
  } catch (error) {
    console.error('Error fetching destinations:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/destinations/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const [rows] = await pool.execute(
      'SELECT * FROM DESTINATION WHERE Destination_ID = ?',
      [id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Destination not found' });
    }
    

    const destination = rows[0];
    

    
    res.json(destination);
  } catch (error) {
    console.error('Error fetching destination:', error);
    res.status(500).json({ message: 'Server error' });
  }
});




app.get('/api/airports/search', async (req, res) => {
    try {
      const { query } = req.query;
      
      if (!query || query.length < 2) {
        return res.json([]);
      }
      
      const searchQuery = `%${query}%`;
      
      const [rows] = await pool.execute(
        `SELECT Airport_Code, Name, City, Country 
         FROM AIRPORT 
         WHERE Airport_Code LIKE ? OR Name LIKE ? OR City LIKE ? OR Country LIKE ?
         LIMIT 10`,
        [searchQuery, searchQuery, searchQuery, searchQuery]
      );
      
      res.json(rows);
    } catch (error) {
      console.error('Error searching airports:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  app.get('/api/flights/search', async (req, res) => {
    try {
      const { 
        departureAirport, 
        arrivalAirport, 
        departureDate, 
        returnDate, 
        passengers = 1 
      } = req.query;
      

      if (!departureAirport || !arrivalAirport || !departureDate) {
        return res.status(400).json({ 
          message: 'Departure airport, arrival airport, and departure date are required' 
        });
      }
      

      const formattedDepartureDate = new Date(departureDate).toISOString().split('T')[0];
      

      let outboundQuery = `
        SELECT f.Flight_ID, f.Flight_Number, f.Departure_Time, f.Arrival_Time, 
               f.Base_Price, f.Available_Seats, a.Name AS Airline_Name, a.Logo_URL,
               dep.Airport_Code AS Departure_Code, dep.City AS Departure_City,
               arr.Airport_Code AS Arrival_Code, arr.City AS Arrival_City
        FROM FLIGHT f
        JOIN AIRLINE a ON f.Airline_ID = a.Airline_ID
        JOIN AIRPORT dep ON f.Departure_Airport = dep.Airport_Code
        JOIN AIRPORT arr ON f.Arrival_Airport = arr.Airport_Code
        WHERE f.Departure_Airport = ? 
        AND f.Arrival_Airport = ? 
        AND DATE(f.Departure_Time) = ?
        AND f.Available_Seats >= ?
        ORDER BY f.Base_Price ASC
      `;
      

      const [outboundFlights] = await pool.execute(
        outboundQuery,
        [departureAirport, arrivalAirport, formattedDepartureDate, parseInt(passengers)]
      );
      

      let returnFlights = [];
      if (returnDate) {
        const formattedReturnDate = new Date(returnDate).toISOString().split('T')[0];
        
        const returnQuery = `
          SELECT f.Flight_ID, f.Flight_Number, f.Departure_Time, f.Arrival_Time, 
                 f.Base_Price, f.Available_Seats, a.Name AS Airline_Name, a.Logo_URL,
                 dep.Airport_Code AS Departure_Code, dep.City AS Departure_City,
                 arr.Airport_Code AS Arrival_Code, arr.City AS Arrival_City
          FROM FLIGHT f
          JOIN AIRLINE a ON f.Airline_ID = a.Airline_ID
          JOIN AIRPORT dep ON f.Departure_Airport = dep.Airport_Code
          JOIN AIRPORT arr ON f.Arrival_Airport = arr.Airport_Code
          WHERE f.Departure_Airport = ? 
          AND f.Arrival_Airport = ? 
          AND DATE(f.Departure_Time) = ?
          AND f.Available_Seats >= ?
          ORDER BY f.Base_Price ASC
        `;
        
        [returnFlights] = await pool.execute(
          returnQuery,
          [arrivalAirport, departureAirport, formattedReturnDate, parseInt(passengers)]
        );
      }
      
      res.json({
        outboundFlights,
        returnFlights
      });
    } catch (error) {
      console.error('Error searching flights:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  

  app.post('/api/flights/booking', authenticateToken, async (req, res) => {
    try {
      const { 
        outboundFlightId, 
        returnFlightId, 
        passengers, 
        passengerDetails 
      } = req.body;
      
      const userId = req.user.User_ID;
      
   
      if (!outboundFlightId || !passengers || !passengerDetails || !Array.isArray(passengerDetails)) {
        return res.status(400).json({ message: 'Missing required booking information' });
      }
      

      const connection = await pool.getConnection();
      await connection.beginTransaction();
      
      try {

        const [outboundFlightRows] = await connection.execute(
          'SELECT * FROM FLIGHT WHERE Flight_ID = ?',
          [outboundFlightId]
        );
        
        if (outboundFlightRows.length === 0) {
          await connection.rollback();
          return res.status(404).json({ message: 'Outbound flight not found' });
        }
        
        const outboundFlight = outboundFlightRows[0];
        

        if (outboundFlight.Available_Seats < passengers) {
          await connection.rollback();
          return res.status(400).json({ message: 'Not enough seats available on outbound flight' });
        }
        

        let returnFlight = null;
        if (returnFlightId) {
          const [returnFlightRows] = await connection.execute(
            'SELECT * FROM FLIGHT WHERE Flight_ID = ?',
            [returnFlightId]
          );
          
          if (returnFlightRows.length === 0) {
            await connection.rollback();
            return res.status(404).json({ message: 'Return flight not found' });
          }
          
          returnFlight = returnFlightRows[0];
          

          if (returnFlight.Available_Seats < passengers) {
            await connection.rollback();
            return res.status(400).json({ message: 'Not enough seats available on return flight' });
          }
        }
        

        let totalPrice = outboundFlight.Base_Price * passengers;
        if (returnFlight) {
          totalPrice += returnFlight.Base_Price * passengers;
        }
        

        const bookingId = 'FB' + Math.floor(Math.random() * 10000000).toString().padStart(7, '0');
        

        await connection.execute(
          `INSERT INTO FLIGHT_BOOKING 
          (Booking_ID, User_ID, Outbound_Flight_ID, Return_Flight_ID, 
           Booking_Date, Number_Of_Passengers, Total_Amount, Payment_Status) 
          VALUES (?, ?, ?, ?, CURDATE(), ?, ?, ?)`,
          [bookingId, userId, outboundFlightId, returnFlightId, passengers, totalPrice, 'Pending']
        );
        

        for (const passenger of passengerDetails) {
          await connection.execute(
            `INSERT INTO FLIGHT_PASSENGER 
            (Passenger_ID, Booking_ID, Title, First_Name, Last_Name, Date_Of_Birth, Passport_Number) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
              'FP' + Math.floor(Math.random() * 10000000).toString().padStart(7, '0'),
              bookingId,
              passenger.title,
              passenger.firstName,
              passenger.lastName,
              passenger.dateOfBirth,
              passenger.passportNumber
            ]
          );
        }
        

        await connection.execute(
          'UPDATE FLIGHT SET Available_Seats = Available_Seats - ? WHERE Flight_ID = ?',
          [passengers, outboundFlightId]
        );
        
 
        if (returnFlightId) {
          await connection.execute(
            'UPDATE FLIGHT SET Available_Seats = Available_Seats - ? WHERE Flight_ID = ?',
            [passengers, returnFlightId]
          );
        }
        

        await connection.commit();
        
        res.status(201).json({
          message: 'Flight booking created successfully',
          bookingId,
          totalAmount: totalPrice
        });
      } catch (error) {
        await connection.rollback();
        throw error;
      } finally {
        connection.release();
      }
    } catch (error) {
      console.error('Flight booking error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  

  app.get('/api/users/flight-bookings', authenticateToken, async (req, res) => {
    try {
      const userId = req.user.User_ID;
      
      const [bookingRows] = await pool.execute(
        `SELECT fb.*, 
         outbound.Flight_Number AS Outbound_Flight_Number,
         outbound.Departure_Time AS Outbound_Departure_Time,
         outbound.Arrival_Time AS Outbound_Arrival_Time,
         outbound_dep.City AS Outbound_Departure_City,
         outbound_arr.City AS Outbound_Arrival_City,
         outbound_airline.Name AS Outbound_Airline,
         return_flight.Flight_Number AS Return_Flight_Number,
         return_flight.Departure_Time AS Return_Departure_Time,
         return_flight.Arrival_Time AS Return_Arrival_Time,
         return_dep.City AS Return_Departure_City,
         return_arr.City AS Return_Arrival_City,
         return_airline.Name AS Return_Airline
         FROM FLIGHT_BOOKING fb
         JOIN FLIGHT outbound ON fb.Outbound_Flight_ID = outbound.Flight_ID
         JOIN AIRPORT outbound_dep ON outbound.Departure_Airport = outbound_dep.Airport_Code
         JOIN AIRPORT outbound_arr ON outbound.Arrival_Airport = outbound_arr.Airport_Code
         JOIN AIRLINE outbound_airline ON outbound.Airline_ID = outbound_airline.Airline_ID
         LEFT JOIN FLIGHT return_flight ON fb.Return_Flight_ID = return_flight.Flight_ID
         LEFT JOIN AIRPORT return_dep ON return_flight.Departure_Airport = return_dep.Airport_Code
         LEFT JOIN AIRPORT return_arr ON return_flight.Arrival_Airport = return_arr.Airport_Code
         LEFT JOIN AIRLINE return_airline ON return_flight.Airline_ID = return_airline.Airline_ID
         WHERE fb.User_ID = ?
         ORDER BY fb.Booking_Date DESC`,
        [userId]
      );
      
      res.json(bookingRows);
    } catch (error) {
      console.error('Error fetching user flight bookings:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  

app.get('/api/packages', async (req, res) => {
  try {

    const { destinationId } = req.query;
    
    let query = 'SELECT * FROM PACKAGE';
    let params = [];
    
    if (destinationId) {
      query += ' WHERE Destination_ID = ?';
      params.push(destinationId);
    }
    
    const [rows] = await pool.execute(query, params);
    
    res.json(rows);
  } catch (error) {
    console.error('Error fetching packages:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/packages/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const [rows] = await pool.execute(
      'SELECT * FROM PACKAGE WHERE Package_ID = ?',
      [id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Package not found' });
    }
    

    const packageData = rows[0];
    
    res.json(packageData);
  } catch (error) {
    console.error('Error fetching package:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


app.post('/api/bookings', authenticateToken, async (req, res) => {
  try {
    const { packageId, travelDate, travelers } = req.body;
    const userId = req.user.User_ID;
    

    if (!packageId || !travelDate || !travelers) {
      return res.status(400).json({ message: 'Package ID, travel date, and number of travelers are required' });
    }
    

    const [packageRows] = await pool.execute(
      'SELECT * FROM PACKAGE WHERE Package_ID = ?',
      [packageId]
    );
    
    if (packageRows.length === 0) {
      return res.status(404).json({ message: 'Package not found' });
    }
    

    const bookingId = 'BK' + Math.floor(Math.random() * 10000000).toString().padStart(7, '0');
    

    const packagePrice = packageRows[0].Price;
    const totalAmount = packagePrice * travelers;
    

    await pool.execute(
      'INSERT INTO BOOKING (Booking_ID, User_ID, Package_ID, Booking_Date, Travel_Date, Number_Of_Travelers, Total_Amount, Payment_Status) VALUES (?, ?, ?, CURDATE(), ?, ?, ?, ?)',
      [bookingId, userId, packageId, travelDate, travelers, totalAmount, 'Pending']
    );
    
    res.status(201).json({
      message: 'Booking created successfully',
      bookingId,
      packageId,
      travelDate,
      travelers,
      totalAmount
    });
  } catch (error) {
    console.error('Booking creation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/bookings/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.User_ID;
    

    const [bookingRows] = await pool.execute(
      'SELECT * FROM BOOKING WHERE Booking_ID = ? AND User_ID = ?',
      [id, userId]
    );
    
    if (bookingRows.length === 0) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    const booking = bookingRows[0];
    

    const [packageRows] = await pool.execute(
      'SELECT * FROM PACKAGE WHERE Package_ID = ?',
      [booking.Package_ID]
    );
    
    const packageData = packageRows[0];
    

    const [paymentRows] = await pool.execute(
      'SELECT * FROM PAYMENT WHERE Booking_ID = ?',
      [id]
    );
    
    const payment = paymentRows.length > 0 ? paymentRows[0] : null;
    
    res.json({
      booking,
      package: packageData,
      payment
    });
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.put('/api/bookings/:id/cancel', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.User_ID;
    
  
    const [bookingRows] = await pool.execute(
      'SELECT * FROM BOOKING WHERE Booking_ID = ? AND User_ID = ?',
      [id, userId]
    );
    
    if (bookingRows.length === 0) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    const booking = bookingRows[0];
    

    if (booking.Payment_Status === 'Cancelled') {
      return res.status(400).json({ message: 'Booking is already cancelled' });
    }
    

    await pool.execute(
      'UPDATE BOOKING SET Payment_Status = ? WHERE Booking_ID = ?',
      ['Cancelled', id]
    );
    
 
    await pool.execute(
      'UPDATE PAYMENT SET Payment_Status = ? WHERE Booking_ID = ?',
      ['Refunded', id]
    );
    
    res.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


app.get('/api/users/bookings', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.User_ID;
    

    const [bookingRows] = await pool.execute(
      `SELECT b.*, p.Package_Name, p.Location, p.Image_URL 
       FROM BOOKING b 
       JOIN PACKAGE p ON b.Package_ID = p.Package_ID 
       WHERE b.User_ID = ?
       ORDER BY b.Booking_Date DESC`,
      [userId]
    );
    
    res.json(bookingRows);
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


app.post('/api/reviews', authenticateToken, async (req, res) => {
  try {
    const { packageId, rating, reviewText } = req.body;
    const userId = req.user.User_ID;
    

    if (!packageId || !rating || !reviewText) {
      return res.status(400).json({ message: 'Package ID, rating, and review text are required' });
    }
    

    const [packageRows] = await pool.execute(
      'SELECT * FROM PACKAGE WHERE Package_ID = ?',
      [packageId]
    );
    
    if (packageRows.length === 0) {
      return res.status(404).json({ message: 'Package not found' });
    }
    

    const [existingReviews] = await pool.execute(
      'SELECT * FROM REVIEW_RATING WHERE User_ID = ? AND Package_ID = ?',
      [userId, packageId]
    );
    
    if (existingReviews.length > 0) {
      return res.status(409).json({ message: 'You have already reviewed this package' });
    }
    

    const reviewId = 'REV' + Math.floor(Math.random() * 10000000).toString().padStart(7, '0');
    

    await pool.execute(
      'INSERT INTO REVIEW_RATING (Review_ID, User_ID, Package_ID, Review_Text, Rating) VALUES (?, ?, ?, ?, ?)',
      [reviewId, userId, packageId, reviewText, rating]
    );
    
    res.status(201).json({
      message: 'Review submitted successfully',
      reviewId,
      packageId,
      rating,
      reviewText
    });
  } catch (error) {
    console.error('Review submission error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/reviews', async (req, res) => {
  try {
    const { packageId } = req.query;
    
    if (!packageId) {
      return res.status(400).json({ message: 'Package ID is required' });
    }
    

    const [reviewRows] = await pool.execute(
      `SELECT r.*, u.Name as UserName 
       FROM REVIEW_RATING r 
       JOIN USER u ON r.User_ID = u.User_ID 
       WHERE r.Package_ID = ?
       ORDER BY r.Review_ID DESC`,
      [packageId]
    );
    
    res.json(reviewRows);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


app.post('/api/users/wishlist', authenticateToken, async (req, res) => {
  try {
    const { packageId } = req.body;
    const userId = req.user.User_ID;
    

    if (!packageId) {
      return res.status(400).json({ message: 'Package ID is required' });
    }
    

    const [packageRows] = await pool.execute(
      'SELECT * FROM PACKAGE WHERE Package_ID = ?',
      [packageId]
    );
    
    if (packageRows.length === 0) {
      return res.status(404).json({ message: 'Package not found' });
    }
    
  
    const [existingItems] = await pool.execute(
      'SELECT * FROM WISHLIST WHERE User_ID = ? AND Package_ID = ?',
      [userId, packageId]
    );
    
    if (existingItems.length > 0) {
      return res.status(409).json({ message: 'Package already in wishlist' });
    }
    
  
    const wishlistId = 'WL' + Math.floor(Math.random() * 10000000).toString().padStart(7, '0');
    

    await pool.execute(
      'INSERT INTO WISHLIST (Wishlist_ID, User_ID, Package_ID) VALUES (?, ?, ?)',
      [wishlistId, userId, packageId]
    );
    
    res.status(201).json({
      message: 'Package added to wishlist',
      wishlistId,
      packageId
    });
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/api/users/wishlist', authenticateToken, async (req, res) => {
  try {
    const { packageId } = req.body;
    const userId = req.user.User_ID;
    

    if (!packageId) {
      return res.status(400).json({ message: 'Package ID is required' });
    }
    

    await pool.execute(
      'DELETE FROM WISHLIST WHERE User_ID = ? AND Package_ID = ?',
      [userId, packageId]
    );
    
    res.json({ message: 'Package removed from wishlist' });
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/users/wishlist', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.User_ID;
    

    const [wishlistRows] = await pool.execute(
      `SELECT w.*, p.Package_Name, p.Location, p.Price, p.Duration, p.Image_URL 
       FROM WISHLIST w 
       JOIN PACKAGE p ON w.Package_ID = p.Package_ID 
       WHERE w.User_ID = ?`,
      [userId]
    );
    
    res.json(wishlistRows);
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


app.get('/api/search', async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({ message: 'Search query is required' });
    }
    
    const searchTerm = `%${q}%`;
    

    const [packageRows] = await pool.execute(
      `SELECT * FROM PACKAGE 
       WHERE Package_Name LIKE ? OR Location LIKE ? OR Description LIKE ?`,
      [searchTerm, searchTerm, searchTerm]
    );
    

    const [destinationRows] = await pool.execute(
      `SELECT * FROM DESTINATION 
       WHERE Name LIKE ? OR Location LIKE ? OR Description LIKE ?`,
      [searchTerm, searchTerm, searchTerm]
    );
    
    res.json({
      packages: packageRows,
      destinations: destinationRows
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
