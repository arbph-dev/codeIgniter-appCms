# CodeIgniter AppCMS

Light CMS project for CodeIgniter 4.7

---

## 📋 Table of Contents

- [Overview](#overview)
- [Repository Structure](#repository-structure)
- [Technologies](#technologies)
- [Features](#features)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Project Directories](#project-directories)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

AppCMS is a lightweight Content Management System built on **CodeIgniter 4.7**, designed to provide essential CMS functionalities with a clean and maintainable codebase.

**Key Information:**
- 🎯 Framework: CodeIgniter 4.7
- 📦 Repository ID: 1272661040
- 📝 License: GNU General Public License v3.0

---

## Repository Structure

```
codeIgniter-appCms/
├── app/                          # CodeIgniter Application Directory
│   ├── Config/                   # Application Configuration
│   ├── Controllers/              # MVC Controllers
│   ├── Models/                   # Database Models
│   ├── Views/                    # View Templates
│   ├── Filters/                  # HTTP Filters
│   ├── Database/
│   │   └── Migrations/           # Database Migrations
│   ├── Libraries/                # Custom Libraries
│   └── Helpers/                  # Helper Functions
│
├── public/                       # Web Root Directory
│   ├── index.php                 # Application Entry Point
│   ├── assets/                   # Static Assets
│   │   ├── css/                  # Stylesheets
│   │   ├── js/                   # JavaScript Files
│   │   └── images/               # Image Resources
│   └── uploads/                  # User Upload Directory
│
├── writable/                     # Writable Directory (Logs, Cache, Sessions)
│   ├── cache/                    # Cache Files
│   ├── logs/                     # Application Logs
│   └── session/                  # Session Data
│
├── system/                       # CodeIgniter System Files
│
├── tests/                        # Test Suite Directory
│
├── env                           # Environment Configuration Template
├── .gitignore                    # Git Ignore File
├── spark                         # CodeIgniter CLI Tool
├── composer.json                 # PHP Dependencies
├── composer.lock                 # Locked Dependencies
├── phpunit.xml                   # PHPUnit Configuration
├── LICENSE                       # Project License
└── README.md                     # This File

```

---

## Technologies

The project uses a mix of modern web technologies:

| Language | Percentage | Purpose |
|----------|-----------|---------|
| **JavaScript** | 38.8% | Frontend interactions and dynamic features |
| **PHP** | 38.7% | Backend logic and CodeIgniter framework |
| **Hack** | 18.7% | Type-safe PHP extensions |
| **CSS** | 3.8% | Styling and layout |

---

## Features

- ✅ Lightweight CMS built on CodeIgniter 4.7
- ✅ MVC Architecture
- ✅ RESTful routing capabilities
- ✅ Database migrations support
- ✅ Built-in security features (CSRF protection, input validation)
- ✅ Session management
- ✅ Flexible configuration system
- ✅ Modular design for easy extensibility

---

## Installation

### Prerequisites
- PHP 7.4 or higher (CodeIgniter 4.7 requirement)
- Composer
- MySQL/MariaDB or compatible database

### Steps

1. **Clone the Repository**
   ```bash
   git clone https://github.com/arbph-dev/codeIgniter-appCms.git
   cd codeIgniter-appCms
   ```

2. **Install Dependencies**
   ```bash
   composer install
   ```

3. **Configure Environment**
   ```bash
   cp env .env
   # Edit .env with your database credentials and settings
   ```

4. **Create Writable Directories**
   ```bash
   chmod -R 755 writable/
   ```

5. **Run Migrations**
   ```bash
   php spark migrate
   ```

6. **Start Development Server**
   ```bash
   php spark serve
   ```

Visit `http://localhost:8080` in your browser.

---

## Configuration

### Key Configuration Files

- **`.env`** - Environment variables (database, app settings)
- **`app/Config/App.php`** - General application configuration
- **`app/Config/Database.php`** - Database connection settings
- **`app/Config/Routes.php`** - URL routing configuration
- **`app/Config/Security.php`** - Security settings (CSRF, etc.)

### Database Configuration

Edit the `.env` file to set your database credentials:

```env
database.default.hostname = localhost
database.default.database = appCms_db
database.default.username = root
database.default.password = password
database.default.DBDriver = MySQLi
```

---

## Usage

### Running the Application

**Development Mode:**
```bash
php spark serve
```

**Production Build:**
- Set `CI_ENVIRONMENT = production` in `.env`
- Ensure `writable/` directory permissions are correctly set
- Consider using a web server (Nginx, Apache) instead of the development server

### Common Commands

```bash
# List all available commands
php spark list

# Generate a new controller
php spark make:controller ControllerName

# Generate a new model
php spark make:model ModelName

# Run database migrations
php spark migrate

# Run tests
php spark test
```

---

## Project Directories

### `/app` - Application Source

| Directory | Purpose |
|-----------|---------|
| `Config/` | Application configuration files |
| `Controllers/` | HTTP request handlers |
| `Models/` | Data models and database interactions |
| `Views/` | HTML templates and presentation |
| `Filters/` | Request/response middleware |
| `Libraries/` | Reusable custom classes |
| `Helpers/` | Utility functions |
| `Database/Migrations/` | Database schema versioning |

### `/public` - Web Root

- **Entry Point:** `index.php`
- **Static Assets:** CSS, JavaScript, images
- **Uploads:** User-generated files directory

### `/writable` - Application Data

- **Logs:** Application error and info logs
- **Cache:** Temporary cached data
- **Session:** Session file storage

---

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is licensed under the **GNU General Public License v3.0** - see the [LICENSE](LICENSE) file for details.

---

## Support & Documentation

- 📖 [CodeIgniter 4.7 Documentation](https://codeigniter.com/user_guide/)
- 🐛 [Report Issues](https://github.com/arbph-dev/codeIgniter-appCms/issues)
- 💬 [Discussions](https://github.com/arbph-dev/codeIgniter-appCms/discussions)

---

**Last Updated:** June 17, 2026  
**Repository:** [arbph-dev/codeIgniter-appCms](https://github.com/arbph-dev/codeIgniter-appCms)
