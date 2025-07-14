-- Database migrations for Travels database

-- Create database if not exists
CREATE DATABASE IF NOT EXISTS Travels;
USE Travels;

-- USER Table (extended from original schema)
CREATE TABLE IF NOT EXISTS USER (
  User_ID VARCHAR(10) PRIMARY KEY,
  Name VARCHAR(255) NOT NULL,
  Email VARCHAR(255) UNIQUE NOT NULL,
  Phone_Number VARCHAR(20) UNIQUE,
  Address TEXT,
  Password VARCHAR(255) NOT NULL, -- Added password field
  Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  Updated_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- DESTINATION Table (extended from original schema)
CREATE TABLE IF NOT EXISTS DESTINATION (
  Destination_ID VARCHAR(10) PRIMARY KEY,
  Name VARCHAR(255) NOT NULL,
  Location VARCHAR(255),
  Description TEXT,
  Long_Description TEXT,
  Best_Season VARCHAR(100),
  Popular_Attractions TEXT,
  Weather_Info TEXT,
  Category VARCHAR(50),
  Featured BOOLEAN DEFAULT FALSE,
  Rating DECIMAL(3,1),
  Review_Count INT DEFAULT 0,
  Image_URL VARCHAR(500),
  Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  Updated_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- DESTINATION_IMAGES Table (for multiple images per destination)
CREATE TABLE IF NOT EXISTS DESTINATION_IMAGES (
  Image_ID VARCHAR(10) PRIMARY KEY,
  Destination_ID VARCHAR(10) NOT NULL,
  Image_URL VARCHAR(500) NOT NULL,
  Image_Order INT DEFAULT 0,
  FOREIGN KEY (Destination_ID) REFERENCES DESTINATION(Destination_ID) ON DELETE CASCADE
);

-- DESTINATION_ACTIVITIES Table (for activities at destinations)
CREATE TABLE IF NOT EXISTS DESTINATION_ACTIVITIES (
  Activity_ID VARCHAR(10) PRIMARY KEY,
  Destination_ID VARCHAR(10) NOT NULL,
  Activity_Name VARCHAR(255) NOT NULL,
  Description TEXT,
  FOREIGN KEY (Destination_ID) REFERENCES DESTINATION(Destination_ID) ON DELETE CASCADE
);

-- DATA Table (as per original schema)
CREATE TABLE IF NOT EXISTS DATA (
  Data_ID VARCHAR(10) PRIMARY KEY,
  Destination_ID VARCHAR(10) UNIQUE,
  Most_Visited_Destination VARCHAR(255),
  FOREIGN KEY (Destination_ID) REFERENCES DESTINATION(Destination_ID) ON DELETE CASCADE
);

-- PACKAGE Table (extended from original schema)
CREATE TABLE IF NOT EXISTS PACKAGE (
  Package_ID VARCHAR(10) PRIMARY KEY,
  Package_Name VARCHAR(255) NOT NULL,
  Description TEXT,
  Location VARCHAR(255),
  Destination_ID VARCHAR(10),
  Price DECIMAL(10,2),
  Original_Price DECIMAL(10,2),
  Duration INT,
  Category VARCHAR(50),
  Featured BOOLEAN DEFAULT FALSE,
  Rating DECIMAL(3,1) DEFAULT 0,
  Review_Count INT DEFAULT 0,
  Hotel_Details TEXT,
  Flight_Details TEXT,
  Activities_Status TEXT,
  Image_URL VARCHAR(500),
  Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  Updated_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (Destination_ID) REFERENCES DESTINATION(Destination_ID) ON DELETE SET NULL
);

-- PACKAGE_IMAGES Table (for multiple images per package)
CREATE TABLE IF NOT EXISTS PACKAGE_IMAGES (
  Image_ID VARCHAR(10) PRIMARY KEY,
  Package_ID VARCHAR(10) NOT NULL,
  Image_URL VARCHAR(500) NOT NULL,
  Image_Order INT DEFAULT 0,
  FOREIGN KEY (Package_ID) REFERENCES PACKAGE(Package_ID) ON DELETE CASCADE
);

-- PACKAGE_ACTIVITIES Table (for activities included in packages)
CREATE TABLE IF NOT EXISTS PACKAGE_ACTIVITIES (
  Activity_ID VARCHAR(10) PRIMARY KEY,
  Package_ID VARCHAR(10) NOT NULL,
  Activity_Name VARCHAR(255) NOT NULL,
  Description TEXT,
  FOREIGN KEY (Package_ID) REFERENCES PACKAGE(Package_ID) ON DELETE CASCADE
);

-- PACKAGE_AVAILABILITY Table (for available dates)
CREATE TABLE IF NOT EXISTS PACKAGE_AVAILABILITY (
  Availability_ID VARCHAR(10) PRIMARY KEY,
  Package_ID VARCHAR(10) NOT NULL,
  Available_Date DATE NOT NULL,
  Price DECIMAL(10,2), -- Special price for this date, if different
  Slots_Available INT DEFAULT 10,
  FOREIGN KEY (Package_ID) REFERENCES PACKAGE(Package_ID) ON DELETE CASCADE
);

-- BOOKING Table (extended from original schema)
CREATE TABLE IF NOT EXISTS BOOKING (
  Booking_ID VARCHAR(10) PRIMARY KEY,
  User_ID VARCHAR(10),
  Package_ID VARCHAR(10),
  Booking_Date DATE,
  Travel_Date DATE,
  Number_Of_Travelers INT DEFAULT 1,
  Total_Amount DECIMAL(10,2),
  Payment_Status ENUM('Pending', 'Completed', 'Failed', 'Cancelled'),
  Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  Updated_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (User_ID) REFERENCES USER(User_ID) ON DELETE SET NULL,
  FOREIGN KEY (Package_ID) REFERENCES PACKAGE(Package_ID) ON DELETE SET NULL
);

-- TRAVELER_DETAILS Table (for storing information about each traveler in a booking)
CREATE TABLE IF NOT EXISTS TRAVELER_DETAILS (
  Traveler_ID VARCHAR(10) PRIMARY KEY,
  Booking_ID VARCHAR(10) NOT NULL,
  Title VARCHAR(10),
  First_Name VARCHAR(255) NOT NULL,
  Last_Name VARCHAR(255) NOT NULL,
  Date_Of_Birth DATE,
  Passport_Number VARCHAR(50),
  Special_Requirements TEXT,
  FOREIGN KEY (Booking_ID) REFERENCES BOOKING(Booking_ID) ON DELETE CASCADE
);

-- PAYMENT Table (extended from original schema)
CREATE TABLE IF NOT EXISTS PAYMENT (
  Payment_ID VARCHAR(10) PRIMARY KEY,
  Booking_ID VARCHAR(10) UNIQUE,
  Payment_Method VARCHAR(100),
  Card_Last_Four VARCHAR(4), -- Store only last 4 digits for security
  Amount DECIMAL(10,2),
  Payment_Date DATE,
  Payment_Status ENUM('Pending', 'Completed', 'Failed', 'Refunded'),
  Transaction_ID VARCHAR(100),
  FOREIGN KEY (Booking_ID) REFERENCES BOOKING(Booking_ID) ON DELETE CASCADE
);

-- REVIEW_RATING Table (extended from original schema)
CREATE TABLE IF NOT EXISTS REVIEW_RATING (
  Review_ID VARCHAR(10) PRIMARY KEY,
  User_ID VARCHAR(10),
  Package_ID VARCHAR(10),
  Review_Text TEXT,
  Rating INT CHECK (Rating BETWEEN 1 AND 5),
  Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  Updated_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (User_ID) REFERENCES USER(User_ID) ON DELETE SET NULL,
  FOREIGN KEY (Package_ID) REFERENCES PACKAGE(Package_ID) ON DELETE CASCADE
);

-- WISHLIST Table (for users to save packages)
CREATE TABLE IF NOT EXISTS WISHLIST (
  Wishlist_ID VARCHAR(10) PRIMARY KEY,
  User_ID VARCHAR(10) NOT NULL,
  Package_ID VARCHAR(10) NOT NULL,
  Added_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (User_ID) REFERENCES USER(User_ID) ON DELETE CASCADE,
  FOREIGN KEY (Package_ID) REFERENCES PACKAGE(Package_ID) ON DELETE CASCADE
);

-- Insert sample data into USER table
INSERT INTO USER (User_ID, Name, Email, Phone_Number, Address, Password) VALUES
('USER1001', 'John Doe', 'john.doe@example.com', '+1 555-123-4567', '123 Main St, New York, NY 10001', '$2a$10$XDNKxXOavYXpX0/CjWvt5.Jlr0YDLOxFRWUc/p3XtmkHkW7Bvsmni'), -- hashed 'password123'
('USER1002', 'Jane Smith', 'jane.smith@example.com', '+1 555-987-6543', '456 Elm St, Los Angeles, CA 90001', '$2a$10$XDNKxXOavYXpX0/CjWvt5.Jlr0YDLOxFRWUc/p3XtmkHkW7Bvsmni'),
('USER1003', 'Robert Johnson', 'robert.johnson@example.com', '+1 555-555-5555', '789 Oak St, Chicago, IL 60007', '$2a$10$XDNKxXOavYXpX0/CjWvt5.Jlr0YDLOxFRWUc/p3XtmkHkW7Bvsmni');

-- Insert sample data into DESTINATION table
INSERT INTO DESTINATION (Destination_ID, Name, Location, Description, Best_Season, Popular_Attractions, Category, Featured, Rating, Review_Count, Image_URL) VALUES
('DEST1001', 'Lofoten Islands', 'Norway', 'Dramatic peaks, pristine beaches, and authentic fishing villages.', 'May to September', 'Reine, Haukland Beach, Lofotr Viking Museum', 'mountains', TRUE, 4.9, 250, '/images/packages/mountain-view.jpg'),
('DEST1002', 'Santorini', 'Greece', 'Iconic sunsets, white-washed buildings, and crystal-clear waters.', 'June to September', 'Oia Village, Red Beach, Ancient Thera', 'beaches', TRUE, 4.8, 380, '/images/packages/beach-aerial.jpg'),
('DEST1003', 'Kyoto', 'Japan', 'Ancient temples, traditional gardens, and vibrant cultural heritage.', 'March to May', 'Fushimi Inari Shrine, Arashiyama Bamboo Grove, Kinkaku-ji', 'cities', FALSE, 4.9, 420, '/images/packages/mountain-cabin.jpg'),
('DEST1004', 'Machu Picchu', 'Peru', 'Ancient Incan citadel set amidst breathtaking mountain scenery.', 'May to October', 'The Citadel, Huayna Picchu, Inca Trail', 'mountains', TRUE, 4.9, 310, '/images/packages/mountain-traveler.jpg'),
('DEST1005', 'Maldives', 'Indian Ocean', 'Pristine beaches, overwater bungalows, and vibrant coral reefs.', 'November to April', 'Underwater diving spots, Bioluminescent beaches', 'beaches', TRUE, 4.8, 290, '/images/packages/beach-palm.jpg');

-- Insert sample data into PACKAGE table
INSERT INTO PACKAGE (Package_ID, Package_Name, Description, Location, Destination_ID, Price, Original_Price, Duration, Category, Featured, Rating, Review_Count, Image_URL) VALUES
('PKG1001', 'Lofoten Adventure', 'Experience the beauty of the Lofoten Islands with this complete adventure package.', 'Lofoten Islands, Norway', 'DEST1001', 1299, 1499, 5, 'adventure', TRUE, 4.9, 124, '/images/packages/winter-cabin.jpg'),
('PKG1002', 'Greek Islands Escape', 'Relax on beautiful beaches and explore ancient ruins in this Greek paradise.', 'Santorini, Greece', 'DEST1002', 1099, 1299, 7, 'beach', FALSE, 4.8, 98, '/images/packages/beach-aerial.jpg'),
('PKG1003', 'Japan Cultural Tour', 'Immerse yourself in Japanese culture with traditional experiences and historic sites.', 'Kyoto, Japan', 'DEST1003', 1899, 2099, 10, 'cultural', TRUE, 4.9, 156, '/images/packages/mountain-cabin.jpg'),
('PKG1004', 'Machu Picchu Explorer', 'Trek the famous Inca Trail and discover the ancient ruins of Machu Picchu.', 'Cusco, Peru', 'DEST1004', 1699, 1899, 8, 'adventure', FALSE, 4.9, 112, '/images/packages/mountain-traveler.jpg'),
('PKG1005', 'Maldives Luxury Retreat', 'Enjoy overwater bungalows and coral reefs in this luxurious beach getaway.', 'Maldives, Indian Ocean', 'DEST1005', 2499, 2799, 6, 'luxury', TRUE, 4.8, 87, '/images/packages/beach-palm.jpg');

-- Insert sample data into PACKAGE_ACTIVITIES table
INSERT INTO PACKAGE_ACTIVITIES (Activity_ID, Package_ID, Activity_Name) VALUES
('ACT1001', 'PKG1001', 'Hiking'),
('ACT1002', 'PKG1001', 'Fishing'),
('ACT1003', 'PKG1001', 'Northern Lights Viewing'),
('ACT1004', 'PKG1002', 'Beach Relaxation'),
('ACT1005', 'PKG1002', 'Ancient Ruins Tour'),
('ACT1006', 'PKG1003', 'Temple Visits'),
('ACT1007', 'PKG1003', 'Tea Ceremony'),
('ACT1008', 'PKG1004', 'Inca Trail Hike'),
('ACT1009', 'PKG1005', 'Snorkeling'),
('ACT1010', 'PKG1005', 'Spa Treatments');

-- Insert sample data into BOOKING table
INSERT INTO BOOKING (Booking_ID, User_ID, Package_ID, Booking_Date, Travel_Date, Number_Of_Travelers, Total_Amount, Payment_Status) VALUES 
('BK1001', 'USER1001', 'PKG1001', '2025-02-15', '2025-06-10', 2, 2598, 'Completed'), 
('BK1002', 'USER1001', 'PKG1005', '2024-11-20', '2025-01-15', 2, 4998, 'Completed'),
('BK1003', 'USER1002', 'PKG1002', '2025-01-05', '2025-08-20', 3, 3297, 'Completed'), 
('BK1004', 'USER1003', 'PKG1003', '2025-03-10', '2025-11-15', 2, 3798, 'Pending');

-- Insert sample data into PAYMENT table
INSERT INTO PAYMENT (Payment_ID, Booking_ID, Payment_Method, Card_Last_Four, Amount, Payment_Date, Payment_Status, Transaction_ID) VALUES
('PAY1001', 'BK1001', 'Credit Card', '4567', 2598, '2025-02-15', 'Completed', 'TRX123456789'),
('PAY1002', 'BK1002', 'Credit Card', '4567', 4998, '2024-11-20', 'Completed', 'TRX987654321'),
('PAY1003', 'BK1003', 'PayPal', NULL, 3297, '2025-01-05', 'Completed', 'TRX456789123'),
('PAY1004', 'BK1004', 'Credit Card', '8765', 1899, '2025-03-10', 'Pending', 'TRX789123456');

-- Insert sample data into REVIEW_RATING table
INSERT INTO REVIEW_RATING (Review_ID, User_ID, Package_ID, Review_Text, Rating) VALUES
('REV1001', 'USER1001', 'PKG1005', 'Amazing experience! The overwater bungalow was spectacular and the snorkeling was incredible.', 5),
('REV1002', 'USER1002', 'PKG1002', 'Beautiful location and great activities. The hotel was comfortable and the staff was friendly.', 4),
('REV1003', 'USER1003', 'PKG1001', 'One of the best trips I have ever taken. The scenery was breathtaking and the guides were knowledgeable.', 5);

-- Insert sample data into WISHLIST table
INSERT INTO WISHLIST (Wishlist_ID, User_ID, Package_ID) VALUES
('WL1001', 'USER1001', 'PKG1002'),
('WL1002', 'USER1001', 'PKG1003'),
('WL1003', 'USER1002', 'PKG1001'),
('WL1004', 'USER1003', 'PKG1004');

-- Trigger to update package rating when a new review is added
DELIMITER //
CREATE TRIGGER update_package_rating AFTER INSERT ON REVIEW_RATING
FOR EACH ROW
BEGIN
  DECLARE avg_rating DECIMAL(3,1);
  DECLARE review_count INT;
  
  -- Calculate new average rating
  SELECT AVG(Rating), COUNT(*) 
  INTO avg_rating, review_count
  FROM REVIEW_RATING 
  WHERE Package_ID = NEW.Package_ID;
  
  -- Update package rating and review count
  UPDATE PACKAGE 
  SET Rating = avg_rating, Review_Count = review_count
  WHERE Package_ID = NEW.Package_ID;
END//

-- Trigger to update destination rating based on package ratings
CREATE TRIGGER update_destination_rating AFTER UPDATE ON PACKAGE
FOR EACH ROW
BEGIN
  DECLARE avg_rating DECIMAL(3,1);
  DECLARE review_count INT;
  
  IF NEW.Destination_ID IS NOT NULL THEN
    -- Calculate new average rating for destination
    SELECT AVG(Rating), SUM(Review_Count) 
    INTO avg_rating, review_count
    FROM PACKAGE 
    WHERE Destination_ID = NEW.Destination_ID;
    
    -- Update destination rating and review count
    UPDATE DESTINATION 
    SET Rating = avg_rating, Review_Count = review_count
    WHERE Destination_ID = NEW.Destination_ID;
  END IF;
END//

DELIMITER ;