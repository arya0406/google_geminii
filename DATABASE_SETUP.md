# DWed Database Setup Guide

## Prerequisites
You need PostgreSQL installed and running on your system.

## Step 1: Install PostgreSQL
1. Download PostgreSQL from: https://www.postgresql.org/download/windows/
2. Run the installer and follow the setup wizard
3. Remember the password you set for the `postgres` user

## Step 2: Start PostgreSQL Service
1. Open Services (Windows + R, type `services.msc`)
2. Find "postgresql-x64-XX" service
3. Right-click and select "Start"

## Step 3: Set up the Database
1. Open pgAdmin (installed with PostgreSQL)
2. Connect to your PostgreSQL server
3. Create a new database called `dwed_db`

## Step 4: Configure Environment
Update your `.env` file with your PostgreSQL credentials:
```
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/dwed_db
```

## Step 5: Run the Setup Script
```bash
cd backend
python setup_database.py
```

## Alternative: Using Docker
If you prefer Docker:
```bash
docker run --name postgres-dwed -e POSTGRES_PASSWORD=mypassword -e POSTGRES_DB=dwed_db -p 5432:5432 -d postgres:13
```

Then update your `.env`:
```
DATABASE_URL=postgresql://postgres:mypassword@localhost:5432/dwed_db
```