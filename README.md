# Vaultarix

Vaultarix is a secure personal password management platform built with modern web technologies and designed with DevSecOps principles.

## Table of Contents

- [Overview](#overview)
- [Stack](#stack)
- [Features](#features)
- [Getting Started](#getting-started)
- [Security Considerations](#security-considerations)
- [Docker & Deployment](#docker--deployment)
- [CI/CD](#cicd)

## Overview

Vaultarix provides a secure environment for storing and managing personal passwords. The system is designed to protect sensitive data both in transit and at rest, using strong encryption, MFA, and strict access control.

## Stack

- **Backend**: Node.js + Express
- **Frontend**: Angular
- **Database**: PostgreSQL
- **Security Libraries**:
  - JWT (RS256) for authentication
  - Argon2 for password hashing
  - AES-256-GCM for password encryption
  - Libsodium for internal encrypted communication
  - TOTP (Google Authenticator compatible) for MFA

## Features

- User registration and login with JWT-based authentication
- Role-Based Access Control (RBAC): user, admin
- Multi-Factor Authentication (MFA) via TOTP
- CRUD operations for password entries
- Client-side encryption for sensitive data
- Secure storage of credentials in PostgreSQL with encrypted backups
- Logging and auditing of access

## Getting Started

1. Clone the repository
```bash
git clone https://github.com/yourusername/vaultarix.git
cd vaultarix
```
2. Configure environment variables in .env file for backend and database credentials.
3. Run Docker Compose for development:
```bash
docker-compose up --build
```
4. Access the frontend at http://localhost:80 and backend at https://localhost:443.

## Security Considerations
- All passwords are hashed using Argon2 and encrypted with AES-256-GCM.
- JWT tokens use RS256 signing with short-lived access tokens and refresh tokens.
- MFA is enforced via TOTP compatible with Google Authenticator.
- Internal backend communication is encrypted with Libsodium.
- TLS 1.3 is mandatory for external communications.

## Docker & Deployment
- Backend, frontend, and database are fully containerized.
- Docker Compose is configured for development and production.
- Recommended deployment: OCI Compute or OCI Container Engine for Kubernetes.
- Reverse proxy (Nginx/Traefik) with TLS termination.
- Database encrypted at rest (TDE if supported).

## CI/CD
- GitHub Actions or GitLab CI for build, test, lint.
- Dependency scanning via Snyk or OWASP Dependency-Check.
- Container vulnerability scanning with Trivy.
- Secure automatic deployment to OCI.


Vaultarix ensures that sensitive credentials are protected following modern security standards, making it a secure solution for personal password management.