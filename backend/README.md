\# Campus Lost \& Found Portal — Backend



Backend API for the Campus Lost \& Found Portal, developed using Node.js, Express.js and MongoDB.



\## Features



\- Student registration and login

\- Admin and student dashboards

\- Lost and Found report management

\- Report approval and rejection

\- Ownership claims and verification

\- Notifications

\- Dashboard statistics

\- Demo data generation



\## Requirements



\- Node.js and npm

\- MongoDB Community Server (running locally)



\## Installation



\*\*1. Clone the backend branch\*\*



```bash

git clone -b backend-v2-latest https://github.com/amar9653/campus-lost-found.git

cd campus-lost-found

```



\*\*2. Install dependencies\*\*



```bash

npm install

```



\*\*3. Configure environment variables\*\*



Create a `.env` file inside the backend directory:



```env

PORT=5000

MONGO\_URI=mongodb://127.0.0.1:27017/campus\_lost\_found

JWT\_SECRET=replace\_with\_your\_own\_secure\_random\_secret

```



\*\*4. Generate categories\*\*



```bash

node seedCategories.js

```



\*\*5. Generate sample data\*\*



```bash

npm run seed:demo

```



The demo seeder is intended to create:



\- 3 demo accounts

\- 5 Lost Item reports

\- 3 Found Item reports

\- 2 ownership claims

\- 5 notifications



It does not delete existing database records and is designed to avoid duplicate demo entries.



\*\*6. Start the backend\*\*



```bash

npm run dev

```



Backend URL: `http://localhost:5000`



\## Demo Login Credentials



| Role | Email | Password |

|---|---|---|

| Admin | demo.admin@example.com | Demo@12345 |

| Student 1 | demo.student1@example.com | Demo@12345 |

| Student 2 | demo.student2@example.com | Demo@12345 |



These credentials apply to newly created demo accounts. Use them only in a local development environment.



\## Frontend



The React frontend is available in the `frontend-v2-latest` branch.



\[View Frontend Branch](https://github.com/amar9653/campus-lost-found/tree/frontend-v2-latest)



\## Notes



\- MongoDB must be running before generating demo data.

\- The seeder uses the database specified by `MONGO\_URI`.

\- Do not run the demo seeder against a production database.

\- Demo reports are created without uploaded images.

\- Never commit `.env` or real credentials to GitHub.



\## Tech Stack



Node.js • Express.js • MongoDB • Mongoose • JWT Authentication



\## Project Status



Portfolio / development project.



