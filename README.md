# 💰 Invest-D - Modern Investment Management System

<div align="center">

![Laravel](https://img.shields.io/badge/Laravel-11-red?style=for-the-badge&logo=laravel)
![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)
![Inertia](https://img.shields.io/badge/Inertia.js-black?style=for-the-badge)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)

**A modern, responsive investment management system built with Laravel, Inertia.js, and React**

[🚀 Live Demo](#) • [📖 Documentation](#) • [ Report Bug](#)

</div>

---

## ✨ Features

- 🔐 **Modern Authentication** - Clean login interface with form validation
- 📱 **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- ⚡ **Fast Development** - Hot reloading with Vite for instant feedback
-  **Beautiful UI** - Modern design with Tailwind CSS
-  **SPA Experience** - Single Page Application with Inertia.js
- 🌐 **Indonesian Support** - Localized interface in Indonesian
- 🛡️ **Security First** - Built with Laravel's security best practices
- 💼 **Investment Tracking** - Monitor your investment portfolio
- 📊 **Portfolio Analytics** - Track performance and returns
- 👥 **Role Management** - Admin and user roles with different permissions

## 🛠️ Tech Stack

- **Backend**: Laravel 11
- **Frontend**: React 18 + Inertia.js
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Database**: MySQL/PostgreSQL/SQLite
- **Authentication**: Laravel Sanctum (ready to implement)

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

### Required Software

| Software | Version | Download |
|----------|---------|----------|
| **PHP** | 8.2+ | [Download](https://www.php.net/downloads.php) |
| **Composer** | Latest | [Download](https://getcomposer.org/) |
| **Node.js** | 18+ | [Download](https://nodejs.org/) |
| **Git** | Latest | [Download](https://git-scm.com/) |
| **Database** | MySQL 8.0+ | [Download](https://dev.mysql.com/downloads/) |

### Quick Check

```bash
# Check if everything is installed
php --version
composer --version
node --version
npm --version
git --version
```

##  Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/Trieser/invest-d.git
cd invest-d
```

### 2. Install Dependencies

```bash
# Install PHP dependencies
composer install

# Install Node.js dependencies
npm install
```

### 3. Environment Setup

```bash
# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate
```

### 4. Configure Database

Edit `.env` file and update database settings:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=invest_d
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

### 5. Setup Database

```bash
# Create database (run in MySQL/phpMyAdmin)
CREATE DATABASE invest_d;

# Run migrations
php artisan migrate

# Seed database (optional)
php artisan db:seed
```

### 6. Build Assets

```bash
# For development (with hot reloading)
npm run dev

# For production
npm run build
```

### 7. Start the Server

```bash
# Using Laravel's built-in server
php artisan serve

# Or using Laragon/XAMPP/MAMP
# Access via your local web server URL
```

## 🌐 Access the Application

- **URL**: `http://localhost:8000`
- **Default Route**: Login page
- **Admin Panel**: `/admin/dashboard`
- **User Dashboard**: `/user/dashboard`

## 🔐 Default Users

After running `php artisan db:seed`, you can login with:

- **Admin User**:
  - Email: `admin@example.com`
  - Password: `password`

- **Regular User**:
  - Email: `user@example.com`
  - Password: `password`

## 📝 License

This project is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).

