Bitespeed Identity Reconciliation (MySQL Version)

A full-stack application that performs identity reconciliation using:

✅ Frontend → HTML + JavaScript

✅ Backend → Node.js + Express

✅ Database → MySQL

📁 Project Structure
bitespeed-project/
│
├── server.js
├── db.js
├── package.json
├── .env
│
└── public/
    └── index.html
🚀 Features

Create primary contact

Create secondary contact

Link contacts using email and phone

Fetch consolidated identity response

Simple frontend interface

🛠 Tech Stack
Layer	Technology
Frontend	HTML, JavaScript
Backend	Node.js, Express
Database	MySQL
Driver	mysql2
Environment	dotenv
🗄 Database Setup
1️⃣ Create Database
CREATE DATABASE bitespeed;
USE bitespeed;
2️⃣ Create Table
CREATE TABLE Contact (
  id INT AUTO_INCREMENT PRIMARY KEY,
  phoneNumber VARCHAR(20),
  email VARCHAR(255),
  linkedId INT,
  linkPrecedence ENUM('primary','secondary'),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deletedAt TIMESTAMP NULL
);
⚙️ Backend Setup
1️⃣ Initialize Project
npm init -y
2️⃣ Install Dependencies
npm install express mysql2 dotenv cors
🔐 Environment Variables

Create a .env file in root folder:

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=bitespeed

⚠ Replace yourpassword with your MySQL password.

▶️ Running the Project

Start the server:

node server.js

Server will run at:

http://localhost:3000
🌐 Frontend Usage

Open browser:

http://localhost:3000

Enter:

Email

Phone number

Click Identify

You will receive a consolidated response like:

{
  "contact": {
    "primaryContactId": 1,
    "emails": ["abc@gmail.com"],
    "phoneNumbers": ["9999999999"],
    "secondaryContactIds": [2]
  }
}
🔄 How Identity Logic Works
✅ If No Contact Exists

→ Create a new primary contact.

✅ If Contact Exists

→ Find primary contact
→ Add new record as secondary (if new combination)
→ Return all linked contacts

📌 API Endpoint
POST /identify
Request Body
{
  "email": "abc@gmail.com",
  "phoneNumber": "9999999999"
}
Response
{
  "contact": {
    "primaryContactId": 1,
    "emails": ["abc@gmail.com"],
    "phoneNumbers": ["9999999999"],
    "secondaryContactIds": []
  }
}
🧠 Key Differences from PostgreSQL Version
PostgreSQL	MySQL
pg package	mysql2
$1, $2	? placeholders
SERIAL	AUTO_INCREMENT
RETURNING *	result.insertId
🧪 Testing with Postman (Optional)

Method: POST

URL: http://localhost:3000/identify

Body → Raw → JSON

{
  "email": "test@gmail.com",
  "phoneNumber": "8888888888"
}
📦 Future Improvements

Add foreign key constraint for linkedId

Add soft delete support

Add validation (Joi / express-validator)

Convert to MVC structure

Deploy on Render / Railway / AWS

👨‍💻 Author

Developed as part of Identity Reconciliation Backend Task.