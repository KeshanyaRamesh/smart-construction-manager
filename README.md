# 🏗️ Smart Construction Project Manager

A modern **AI-assisted construction project management web application** designed to help construction teams manage projects, tasks, materials, expenses, workers, and project performance from a centralized dashboard.

The application combines **construction management features with AI-powered insights and recommendations** to help users identify potential issues, monitor project performance, and make better decisions based on project data.

---

## ✨ Key Features

### 🤖 AI-Powered Construction Insights

The main feature of this application is its **AI-assisted construction analysis system**.

The application sends relevant construction data to an AI service and generates useful insights and recommendations based on the current project information.

AI features include:

* 📊 **Project Performance Analysis**

  * Analyzes current project and task data.
  * Identifies potential project progress issues.

* 💰 **Budget & Expense Analysis**

  * Reviews project budgets and recorded expenses.
  * Detects potential budget overruns.
  * Highlights high spending patterns.
  * Provides recommendations for better cost monitoring.

* 📦 **Material Stock Recommendations**

  * Analyzes material inventory information.
  * Identifies materials that may require restocking.
  * Helps reduce the risk of material shortages.

* 👷 **Workforce Insights**

  * Reviews worker and project information.
  * Provides suggestions related to workforce allocation and project requirements.

* 📋 **Task & Progress Analysis**

  * Examines pending and completed tasks.
  * Identifies areas where project progress may need attention.

* 💡 **AI-Generated Recommendations**

  * Provides practical recommendations based on the submitted construction data.
  * Helps project managers make more informed decisions.

---

## 📊 Dashboard

The dashboard provides a centralized overview of the construction management system.

It includes:

* Total projects
* Active projects
* Completed projects
* Task completion percentage
* Total expenses
* Active workers
* Budget usage
* Remaining budget
* Material inventory status
* Low-stock alerts
* Expense distribution charts
* Project status charts
* Task status charts
* Recent projects
* Recent expenses
* Smart construction insights

---

## 🏗️ Project Management

Users can manage construction projects by recording:

* Project name
* Location
* Start date
* End date
* Project budget
* Project status
* Project progress

Projects can be monitored from the dashboard to understand their current status and progress.

---

## 📋 Task Management

The task management module allows users to:

* Create construction tasks
* Assign tasks to workers
* Set task priorities
* Set deadlines
* Track task status
* Monitor completed, in-progress, and pending tasks

Task information is also used by the dashboard and AI insight system.

---

## 📦 Materials Management

The materials module allows construction teams to track:

* Material name
* Quantity
* Unit price
* Supplier
* Minimum stock level
* Delivery status
* Stock status

The system can identify low-stock materials and provide recommendations for restocking.

---

## 💰 Expense Management

Users can record and manage project expenses including:

* Project
* Expense category
* Description
* Amount
* Date

Supported categories include:

* Materials
* Labour
* Equipment
* Transport
* Other

The dashboard automatically calculates:

* Total expenses
* Material expenses
* Labour expenses
* Equipment expenses
* Budget usage
* Remaining budget

Expense information can also be analyzed by the AI system.

---

## 👷 Worker Management

The worker management module allows users to maintain worker information such as:

* Worker name
* Role
* Contact information
* Worker status
* Project-related information

Worker data can contribute to AI-based workforce recommendations.

---

## 📈 Data Visualization

The dashboard uses interactive charts to visualize construction data.

Charts include:

* Task Status Distribution
* Project Status Distribution
* Expense Distribution
* Budget Usage

These visualizations make it easier to understand project performance at a glance.

---

## 🧠 How the AI Feature Works

The application follows a simple AI-assisted workflow:

```text
Construction Data
       ↓
Projects
Tasks
Materials
Expenses
Workers
       ↓
AI Analysis API
       ↓
AI Processing
       ↓
Construction Insights
       ↓
Recommendations
```

The frontend collects relevant project information and sends it to the backend AI endpoint.

The AI service analyzes the provided information and returns construction-related insights that are displayed to the user.

---

## 🛠️ Technologies Used

### Frontend

* React.js
* JavaScript
* Tailwind CSS
* Recharts
* React Router
* Vite

### Backend

* Node.js
* Express.js
* REST API

### AI

* AI-powered construction data analysis
* AI-generated recommendations
* AI-assisted project, budget, material, task, and workforce insights

### Data Management

* LocalStorage
* JSON-based application data

### Development Tools

* Visual Studio Code
* Git
* GitHub
* npm

---

## 📁 Project Structure

```text
smart-construction-manager/
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── App.jsx
│   └── main.jsx
│
├── public/
│
├── backend/
│   ├── server.js
│   └── ...
│
├── package.json
├── README.md
└── .gitignore
```

> Project structure may vary depending on the current implementation.

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/KeshanyaRamesh/smart-construction-manager.git
```

### 2. Navigate to the project

```bash
cd smart-construction-manager
```

### 3. Install frontend dependencies

```bash
npm install
```

### 4. Start the frontend

```bash
npm run dev
```

### 5. Start the backend

Navigate to the backend directory if applicable:

```bash
cd backend
```

Install backend dependencies:

```bash
npm install
```

Start the backend server:

```bash
node server.js
```

The AI functionality requires the backend AI service to be running.

---

## 🔐 Environment Variables

If the AI service requires an API key, store it in an environment file rather than directly inside the source code.

Example:

```env
AI_API_KEY=your_api_key_here
```

**Never commit API keys or other secrets to GitHub.**

The `.env` file should be included in `.gitignore`.

---

## 🎯 Purpose of the Project

This project was developed to demonstrate how modern web technologies and AI can be combined to solve practical problems in the **construction management domain**.

Rather than functioning only as a CRUD application, the system uses project data to provide **AI-assisted analysis and recommendations**, helping users understand project performance and potential issues.

---

## 🔮 Future Improvements

Possible future improvements include:

* Real-time database integration
* User authentication and role-based access
* Advanced AI project forecasting
* AI-based cost prediction
* AI-based material demand forecasting
* Automated project risk detection
* Worker performance analytics
* PDF and Excel report generation
* Real-time notifications
* Cloud deployment
* Advanced construction analytics

---

## 👩‍💻 Developer

**Keshanya Ramesh**

BSc IT Undergraduate | Aspiring Software Engineer

GitHub:
https://github.com/KeshanyaRamesh

---

## ⭐ Project Highlights

**Smart Construction Project Manager** demonstrates:

* Full-stack web development
* React.js application development
* REST API integration
* AI integration
* Construction data analysis
* Data visualization
* CRUD operations
* Responsive UI design
* Budget and expense management
* Inventory management
* Workforce management
* AI-assisted decision support

---

## 📄 License

This project is developed for educational and portfolio purposes.
