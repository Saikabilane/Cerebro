# Cerebro — Quiz and Learning Dashboard

Cerebro is a browser-based quiz platform with separate student-facing and administrator-facing pages. The repository contains quiz interaction scripts, dashboards, a leaderboard and Firebase-related configuration/rules.

## Features
- Student and admin dashboard pages.
- Quiz interaction and administration scripts.
- Leaderboard page.
- Firebase integration for application data and storage rules.
- HTML, CSS and JavaScript front end.

## Main files
- `index.html` — entry page.
- `student.html`, `user-dashboard.html`, `user-quiz.js` — student/user experience.
- `admin-dashboard.html`, `admin-quiz.js`, `admin-styles.css` — admin interface.
- `leaderBoard.html` — leaderboard.
- `script.js`, `style.css`, `user-styles.css` — shared and page-specific behavior/styles.
- `firebaseConfig.js`, `storage.rules` — Firebase configuration and storage rules.
- `package.json`, `package-lock.json` — JavaScript dependency metadata.

## Run locally
```bash
git clone https://github.com/Saikabilane/Cerebro.git
cd Cerebro
npm install
```
Open `index.html` through a local static server (recommended rather than opening files directly), and configure the Firebase project required by the application before testing features that read or write remote data.

## Security checklist
Review Firebase Authentication and database/storage rules before deploying. Never commit service-account credentials or private keys. Client-side Firebase configuration is not a substitute for properly secured rules. The repository includes a `firebase-debug.log`; avoid committing logs that may contain local environment details.

## License
No license file is currently included. Contact the repository owner for reuse permission.
