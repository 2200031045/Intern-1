Haett Partner Portal
Built this as part of a 1-day intern assessment for Haett. It's a full-stack web app where users can apply to become affiliate partners, and admins can review and manage those applications.

What it does
For users:

Sign up / log in
Submit a partner application (type, business name, social link, etc.)
See their application status — pending, approved, or rejected
If rejected, view the reason and reapply with updated details
If approved, access a dashboard with their discount codes and usage stats

For admins:

Log in to a review panel
See all applications filtered by status (Pending / Approved / Rejected)
Approve or reject applications (rejection requires a typed reason)
Activate or deactivate partner discount codes


Tech Stack

Frontend: React + Vite
Backend: Node.js + Express
Database: SQLite
Auth: JWT + bcryptjs

I went with SQLite to keep setup dead simple — no database server to configure, just seed and run.

Project Structure
haett-partner-app/
├── client/
│   ├── src/
│   ├── public/
│   └── package.json
├── server/
│   ├── server.js
│   ├── db.js
│   ├── seed.js
│   ├── .env
│   └── package.json
└── README.md

Running the App
1. Clone the repo
bashgit clone <repository-url>
cd haett-partner-app
2. Set up the backend
bashcd server
npm install
npm run seed
npm run dev
Runs on → http://localhost:5000
3. Set up the frontend
bashcd client
npm install
npm run dev
Runs on → http://localhost:5173

Test Credentials
RoleEmailPasswordAdminadmin@haett.compassword123Test Useruser@haett.compassword123
You can also create a new account using the Signup page.

How the flow works

User signs up or logs in
Fills out the partner application form
Application goes into Pending state
Admin logs in, reviews it, and either Approves or Rejects it
If approved → user gets a partner dashboard with discount codes
If rejected → user sees the reason and can reapply


Screenshots
<img width="1600" height="734" alt="image" src="https://github.com/user-attachments/assets/7196e354-86db-48c5-84e3-5308bf952b8f" />
<img width="1600" height="735" alt="image" src="https://github.com/user-attachments/assets/eed3b6cb-d911-4572-93d2-fb3a400160e5" />
<img width="1600" height="726" alt="image" src="https://github.com/user-attachments/assets/42eefe19-51fe-44ce-a788-b7f6696b5bbb" />
<img width="1600" height="733" alt="image" src="https://github.com/user-attachments/assets/6632e387-c60c-4e43-a3ca-82f16719b155" />
<img width="1600" height="727" alt="image" src="https://github.com/user-attachments/assets/b86eeeb1-59ce-4a09-b15d-d7110693a63a" />
<img width="1600" height="724" alt="image" src="https://github.com/user-attachments/assets/e59f2e91-d92f-4198-ade1-c092a7abeec7" />
<img width="1600" height="722" alt="image" src="https://github.com/user-attachments/assets/1af31638-553c-4e6c-815e-ea98eeb7cc6e" />


Author
GitHub:
