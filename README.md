# Backend Development Test API

A NestJS backend API for managing users, companies, and images with Firebase authentication and AWS S3 storage.

##  Features

- **Firebase Auth** - JWT authentication with role-based access
- **Image Uploads** - AWS S3 storage with admin controls
- **PostgreSQL** - TypeORM with migrations

## Quick Start

### Prerequisites
- Node.js 18+, PostgreSQL, AWS S3 bucket, Firebase project

### Setup
```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env  # Add your config

# Setup database
npm run migration:run

# Start development
npm run start:dev
```

##  Environment Variables

```env
# Application
NODE_ENV=development
PORT=3000

# Database
DB_HOST=your_db_host (e.g localhost if setting up locally)
DB_PORT=your_db_port
DB_USER=your_user
DB_PASSWORD=your_password
DB_NAME=your_database
DB_CA_CERTIFICATE=base64_encoded_ssl_certificate (if using a cloud hosted postgres)

# Firebase
FIREBASE_SERVICE_ACCOUNT_B64=base64_service_account
FIREBASE_API_KEY=your_api_key
FIREBASE_EMAIL_AND_PASSWORD_SIGNIN_URL=signin_url

# AWS S3
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_S3_BUCKET_NAME=your_bucket
AWS_S3_BUCKET_REGION=your_region
```
**NB:** Regardless of the hosting platform of the db (cloud or locally), you still need to provide the `DB_CA_CERTIFICATE` variable and value as the enironment variable will fail validation if it is absent. Genereate a random base64 encoded string if you won't be using the cloud hosted postgres e.g

```env
#ca certficate with random base64 encoded string

DB_CA_CERTIFICATE=dGVzdGluZyBhbiBhcHBsaWNhdGlvbiBpcyBmdW4K
```


##  API Endpoints

**Base URL:** `http://localhost:{PORT}/api/v1`

### Authentication
- `POST /auth/sign-up` - Register user
- `POST /auth/sign-in` - Login user

### User Operations
- `GET /user/` - Get current user profile

### Companies (User Role)
- `GET /companies` - List user's companies
- `POST /companies` - Create company
- `GET /companies/:id` - Get company details
- `PATCH /companies/:id` - Update company
- `DELETE /companies/:id` - Delete company

### Images (User Role)
- `GET /images` - List received images
- `GET /images/:id` - Get image details

### Admin (Admin Role)
- `GET /admin/users` - List all users
- `GET /admin/users/:id` - Get user details
- `GET /admin/users/:id/companies` - Get user's companies
- `POST /admin/images/upload` - Upload image to user

## Authentication

Protected routes require Firebase JWT token:
```
Authorization: Bearer <firebase-jwt-token>
```

**Roles:**
- **User**: Manage own companies and view received images
- **Admin**: Full access to all users, companies, and image uploads


## Development

```bash
npm run start:dev      # Development mode
npm run build          # Build for production
npm run start:prod     # Production mode
npm run migration:run  # Run database migrations
npm run test           # Run tests
```

## Project Structure

```
src/
├── api/              # API modules (auth, user, company, image, admin)
├── config/           # Environment and database config
├── entities/         # TypeORM entities
├── guards/           # Auth guards (Firebase, Roles)
├── dto/              # Data transfer objects
├── filters/          # Global exception handling
└── migrations/       # Database migrations
```

