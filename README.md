# NestJS Template

A production-ready NestJS template with best practices, TypeScript, MongoDB, Authentication, Testing, and CI/CD setup.

## Template Features

- ⚡️ Production-Ready Architecture
- 🔐 JWT Authentication & Authorization
- 📚 Swagger API Documentation
- 🗄️ MongoDB with Prisma ORM
- ✅ Comprehensive Testing Setup
- 🔄 CI/CD with GitHub Actions
- 📊 Monitoring & Logging
- 🛡️ Security Best Practices
- 🎯 Input Validation & Error Handling

## Using This Template

1. **Create New Repository**
```bash
# Use this template from GitHub
Click "Use this template" button on GitHub
# OR clone and reinitialize
git clone https://github.com/yourusername/nestjs-template.git my-project
cd my-project
rm -rf .git
git init
```

2. **Update Project Configuration**
```bash
# Update package.json
- Change name, description, and author
- Update repository URLs

# Update environment variables
cp .env.example .env

# Update deployment configurations
- Edit deploy.sh with your app name
- Update .github/workflows/* with your deployment details
```

## Technology Stack

- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: MongoDB
- **Authentication**: JWT
- **Testing**: Jest
- **Documentation**: Swagger/OpenAPI

## Prerequisites

- Node.js (v22 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## Quick Start

1. **Clone and Install**
```bash
git clone https://github.com/yourusername/personal-template-nestjs-back.git
cd personal-template-nestjs-back
npm install
```

2. **Environment Setup**
```bash
cp .env.example .env
```
> Note: Ensure you have a MongoDB instance running and the DATABASE_URL environment variable set in your .env file. If you don't, create one or update the variable accordingly.

3. **Post-Installation (Prisma)**
```bash
# If you don't have a database set up or your database is empty,
# push the Prisma schema to initialize MongoDB collections:
npx prisma db push

# Generate the Prisma Client after pushing the schema or installing dependencies
npx prisma generate
```
> Note: Ensure DATABASE_URL is correctly set in your .env file.

4. **Development**
```bash
npm run start:dev
```

5. **Production Build**
```bash
npm run build
npm run start:prod
```

## Prisma & Schema Updates

Note: Prisma Migrate is not supported for MongoDB. Ensure you have a MongoDB instance running and the DATABASE_URL environment variable set in your .env file. Then, synchronize your Prisma schema with:
```bash
npx prisma db push
```
This command updates your MongoDB collections to match the Prisma schema. After pushing changes, update the Prisma Client with:
```bash
npx prisma generate
```
Ensure you have a backup of your MongoDB data before modifying the schema.

## API Documentation

API documentation is available at `/api/docs` when running the server.

## Project Structure

```
src/
├── app.module.ts
├── core
│   ├── common
│   │   ├── filters
│   │   ├── guards
│   │   │   └── auth.guard.ts
│   │   ├── interceptors
│   │   ├── middleware
│   │   │   └── logger.middleware.ts
│   │   └── pipes
│   ├── config
│   │   ├── env.validation.ts
│   │   └── swagger.config.ts
│   ├── constants
│   ├── exceptions
│   ├── services
│   │   ├── base.service.ts
│   │   └── prisma.service.ts
│   └── utils
│       ├── auth.ts
│       ├── helpers.ts
│       ├── logger.ts
│       └── validation.ts
├── main.ts
├── modules
│   └── user
│       ├── dto
│       │   └── user.dto.ts
│       ├── user.controller.spec.ts
│       ├── user.controller.ts
│       ├── user.module.ts
│       ├── user.service.spec.ts
│       └── user.service.ts
└── templates
    ├── reset-password.hbs
    └── verify-account.hbs
```

## Testing

```bash
# Unit tests - runs fast unit tests
npm run test

# Watch mode tests - continuously runs tests on file changes
npm run test:watch

# Debug tests - enables debug mode for troubleshooting test failures
npm run test:debug

# End-to-end tests - verifies API endpoints and integrations
npm run test:e2e

# Test coverage - generates comprehensive coverage reports
npm run test:cov

# Performance tests - simulates load using k6 performance testing
npm run test:performance

# Security audit - checks for vulnerabilities in project dependencies
npm run security:audit
```

## Testing Strategy

### Unit Tests
```bash
npm run test
```
- Tests individual components in isolation
- Located in `*.spec.ts` files next to the implementation
- Coverage threshold: 80% for all metrics

### Integration Tests
```bash
npm run test:e2e
```
- Tests API endpoints and service interactions
- Located in `test/` directory
- Includes database integration tests

### Performance Tests
```bash
npm run test:performance
```
- Uses k6 for load testing
- Tests API endpoints under load
- Measures response times and error rates
- Located in `tests/performance/`

### Security Tests
```bash
npm run security:audit
```
- npm audit for dependency vulnerabilities
- CodeQL analysis for code security
- Regular security patches

### Code Quality
```bash
npm run lint        # ESLint checks
npm run quality:sonar  # SonarCloud analysis
```
- Enforces coding standards
- Identifies code smells and bugs
- Maintains maintainability metrics

## Development Tools

### Available Scripts
```bash
npm run start:dev   # Development with hot reload
npm run start:debug # Debug mode
npm run start:prod  # Production mode
npm run build       # Production build
npm run format      # Format code with Prettier
```

### API Documentation
- Swagger UI: `/api/docs`

## Docker Support

```bash
# Build the container
docker build -t personal-template-nestjs-api .

# Run with Docker Compose
docker-compose up -d
```

## Monitoring & Logging

- Application metrics: Prometheus
- Logging: Winston
- Error tracking: Sentry

## Monitoring & Observability

### Logging
- Structured logging with Pino
- Log levels: error, warn, info, debug
- Request/Response logging middleware

### Health Checks
- Endpoint: `/health`
- Checks database connection
- Monitors external service dependencies

### Performance Monitoring
- Response time metrics
- Request rate tracking
- Error rate monitoring
- Resource usage stats

## Security Features

- JWT Authentication
- Rate limiting
- CORS protection
- Helmet security headers
- Input validation
- SQL injection protection
- XSS prevention

## Secrets Configuration

Ensure the following secrets are defined in your CI/CD environment (e.g., GitHub repository settings):

- PROD_HOST: Production server hostname or IP.
- PROD_SSH_USERNAME: SSH username for production deployments.
- PROD_SSH_PRIVATE_KEY: SSH private key for production deployments.
- DEV_HOST: Development server hostname or IP.
- DEV_SSH_USERNAME: SSH username for development deployments.
- DEV_SSH_PRIVATE_KEY: SSH private key for development deployments.
- SONAR_TOKEN: Token for SonarCloud analysis.

## Template Customization

### 1. Application Name
- Update `package.json`
- Modify `deploy.sh`
- Update GitHub workflow files
- Change name in Swagger configuration

### 2. Environment Configuration
```bash
# Required variables in .env
DATABASE_URL=
JWT_SECRET=
API_PREFIX=
PORT=
```

### 3. Module Structure
The template follows a modular architecture:
```
src/
├── modules/           # Feature modules
│   ├── auth/         # Authentication module
│   ├── user/         # User management
│   └── your-module/  # Add your modules here
```

### 4. Adding New Modules
```bash
# Generate new module
nest g module modules/your-module

# Generate CRUD resources
nest g resource modules/your-module
```

### 5. Database Configuration
- Update `prisma/schema.prisma` with your models
- Run `npx prisma generate` after changes
- Modify `PrismaService` if needed

## Template Maintenance

### Updating Dependencies
```bash
# Check outdated packages
npm outdated

# Update packages
npm update

# Update major versions
npx npm-check-updates -u
```

### Contributing to Template
1. Fork the template repository
2. Create feature branch
3. Commit changes
4. Create Pull Request

## Support & Updates

- 📦 Regular dependency updates
- 🐛 Bug fixes via GitHub issues
- 💡 Feature requests welcome
- 📖 Documentation improvements
