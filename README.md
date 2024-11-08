# ASYV LEAP - EP Management System

A web application for managing Enrichment Programs at Agahozo Shalom Youth Village.

## Project Structure

```
asyv_leap/
├── frontend/           # React frontend application
│   ├── src/
│   ├── public/
│   └── package.json
│
└── backend/            # Node.js backend application
    ├── src/
    └── package.json
```

## Features

- User Authentication & Authorization
- Student Management
- EP Program Management
- Rotation Management
- Attendance Tracking
- Reporting System

## Tech Stack

### Frontend
- React
- React Router
- Tailwind CSS
- Shadcn/ui Components
- Axios for API calls

### Backend
- Node.js
- Express
- Sequelize ORM
- MySQL Database
- JWT Authentication

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MySQL (v8 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/asyv_leap.git
cd asyv_leap
```

2. Install Backend Dependencies
```bash
cd backend
npm install
```

3. Install Frontend Dependencies
```bash
cd ../frontend
npm install
```

4. Set up environment variables
- Copy `.env.example` to `.env` in both frontend and backend directories
- Update the variables with your configuration

5. Initialize the database
```bash
cd ../backend
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
```

6. Start the application
```bash
# Start backend (from backend directory)
npm run dev

# Start frontend (from frontend directory)
npm run dev
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE.md file for details

## Acknowledgments

- Agahozo Shalom Youth Village
- All contributors and supporters
