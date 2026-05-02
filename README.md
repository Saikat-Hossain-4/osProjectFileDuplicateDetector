# MERN File Manager

A complete, production-ready MERN stack application for managing files.

## Features
- **User Authentication:** Secure JWT-based login and registration
- **File Upload:** Drag & drop uploading directly to Cloudinary (no local storage)
- **Duplicate Detection:** Automatic MD5 hashing to detect and group duplicate files
- **Recent Files:** Track accessed files by Today, Yesterday, and Last Week
- **File Organization:** Files are categorized by type (Images, PDFs, Word Docs)
- **File Viewer:** Preview images and PDFs directly in the browser

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account (or local MongoDB)
- Cloudinary account for file storage

### 1. Clone & Install
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Environment Variables
Create a `.env` file in the `backend` directory based on the `.env` template provided:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
PORT=5000
```

### 3. Run the Application
Open two terminal windows:

Terminal 1 (Backend):
```bash
cd backend
npm start
```

Terminal 2 (Frontend):
```bash
cd frontend
npm start
```

The application will be running at `http://localhost:3000`.

## Architecture Details
- **Backend:** Node.js, Express, Mongoose, Multer, Cloudinary
- **Frontend:** React, React Router, Axios, Lucide Icons (pure CSS for styling)
- **Security:** Password hashing with bcrypt, JWT authorization, protected routes
- **Performance:** Debounced search inputs, efficient MongoDB aggregations for duplicates
