# Collaborative Text Editor

A real-time collaborative text editor built using Laravel, React, Inertia.js, Reverb, and MySQL.

## Description

This project is a web-based collaborative text editing platform that allows multiple users to edit and collaborate on the same document in real time. Or use it as personal workspace.

### Key Features

- Real-time collaboration
- Rich-text editing with support for formatting and document structure
- User authentication and document access control
- Personal pr shared workspaces

### Technologies Used

- **Laravel** – for backend logic and API handling
- **React** – for dynamic frontend rendering
- **Inertia.js** – to bridge Laravel and React in a monolithic setup
- **Reverb** – to power real-time WebSocket communication
- **MySQL** – for persistent storage of user data and documents

## Installation

### Requirements

- PHP >= 8.1
- Node.js >= 18
- MySQL
- Composer
- Laravel Reverb configured and running

### Steps

1. Clone the repository:
```bash
git clone https://github.com/den47k/docnest.git
cd docnest
```

2. Install PHP dependencies:
```bash
composer install
```
3. Install JS dependencies:
```bash
npm install
```
4. Configure environment:
```bash
cp .env.example .env
php artisan key:generate
```
5. Run database migrations:
```bash
php artisan migrate
```
6. Compile frontend assets:
```bash
npm run dev
```
7. Start Laravel server and Reverb:
```bash
php artisan serve
php artisan reverb:start
php artisan queue:start
```
   
### Demo Credentials (for testing)

```makefile
Email: admin@blog.com
Password: qwe123
```
