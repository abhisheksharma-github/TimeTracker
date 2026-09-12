# 🚀 TimeTracker Cloud Deployment & Neon PostgreSQL Guide

This comprehensive guide walks you through deploying the full-stack **TimeTracker** application:
- **Database**: Cloud PostgreSQL on [Neon DB](https://neon.tech)
- **Backend**: Spring Boot REST API on [Render](https://render.com)
- **Frontend**: React + Vite Application on [Vercel](https://vercel.com)

---

## 🗄️ Step 1: Create PostgreSQL Database on Neon DB

1. **Sign Up / Log In**:
   - Go to [neon.tech](https://neon.tech) and create a free account.
2. **Create New Project**:
   - Click **"New Project"**.
   - Project Name: `timetracker-db`
   - Region: Select the region closest to your users (e.g. `US East (N. Virginia)` or `Singapore / Frankfurt`).
   - Click **"Create Project"**.
3. **Copy Connection Details**:
   - In the Neon Dashboard, locate your **Connection Details**.
   - Select **"JDBC"** or **"Parameters only"**.
   - You will receive credentials formatted as:
     ```text
     Host:      ep-xyz-123456.us-east-2.aws.neon.tech
     Database:  neondb
     User:      neondb_owner
     Password:  <YOUR_NEON_PASSWORD>
     ```
   - Your Spring Boot JDBC Connection String will look like:
     ```text
     jdbc:postgresql://ep-xyz-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
     ```

---

## ☕ Step 2: Deploy Spring Boot Backend on Render

1. **Push your code to GitHub**:
   ```bash
   git add .
   git commit -m "Add timestamps, Neon DB configuration, and Docker support"
   git push origin main
   ```
2. **Create Web Service on Render**:
   - Log into [dashboard.render.com](https://dashboard.render.com).
   - Click **New +** → **Web Service**.
   - Connect your GitHub repository.
3. **Configure Service Settings**:
   - **Name**: `timetracker-backend`
   - **Root Directory**: `timetracker`
   - **Language / Environment**: `Docker` (Render will automatically detect `timetracker/Dockerfile`) or `Java`
   - **Branch**: `main`
   - **Plan**: `Free`
4. **Set Environment Variables**:
   Click **Advanced** → **Add Environment Variable** and add the following:

   | Key | Value (from your Neon Dashboard) |
   | :--- | :--- |
   | `SPRING_DATASOURCE_URL` | `jdbc:postgresql://<neon-host>/neondb?sslmode=require` |
   | `SPRING_DATASOURCE_USERNAME` | `<neon-username>` (e.g. `neondb_owner`) |
   | `SPRING_DATASOURCE_PASSWORD` | `<neon-password>` |
   | `PORT` | `8080` |

5. **Deploy**:
   - Click **"Create Web Service"**.
   - Render will build the Docker container and start your Spring Boot API.
   - Once deployed, copy your live backend URL (e.g. `https://timetracker-backend.onrender.com`).
   - Test by opening: `https://timetracker-backend.onrender.com/api/time-entries`

---

## ⚡ Step 3: Deploy React Frontend on Vercel

1. **Log in to Vercel**:
   - Go to [vercel.com](https://vercel.com) and log in with your GitHub account.
2. **Import Repository**:
   - Click **"Add New..."** → **"Project"**.
   - Select your `TimeTracker` repository.
3. **Configure Project Settings**:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click **Edit** and select `front` (IMPORTANT!).
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. **Add Environment Variable**:
   - Expand the **Environment Variables** section:
     - **Key**: `VITE_API_BASE_URL`
     - **Value**: `https://timetracker-backend.onrender.com/api/time-entries` *(replace with your actual Render backend URL)*
5. **Deploy**:
   - Click **"Deploy"**.
   - Vercel will build the frontend and provide your live production URL (e.g. `https://timetracker-app.vercel.app`).

---

## 🔄 Step 4: Verification & End-to-End Flow

1. Open your live Vercel URL.
2. Log a new shift or run the live stopwatch.
3. Verify that the entry appears immediately in the table with the **Recorded At** timestamp.
4. Check your **Neon DB Dashboard** → **Tables** → `time_entries` to see your rows stored in the cloud PostgreSQL database!
