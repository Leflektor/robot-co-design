# Robot Co-Design Web Application

A web platform created as part of my engineering thesis at Poznan University of Technology.  
The application allows users to select and evaluate preferred features of assistive robots designed to help elderly people.  
Collected responses are stored in a MySQL database for further analysis.

## 🧠 Features
- Questionnaire for selecting robot characteristics (6 sections, 39 questions).  
- AI image generation of robot concepts using OpenAI DALL·E 3.  
- User feedback through 1–5 ratings and free-text comments.  
- Admin panel for CSV export and data overview.  
- Support for different user roles: guest, affiliated user, and admin.

## 🛠️ Technologies Used
- **Frontend:** Vanilla JavaScript, Tailwind CSS  
- **Backend:** Node.js (Express)  
- **Database:** MySQL  
- **AI Integration:** OpenAI DALL·E 3  
- **Data Analysis:** Python (pandas, statsmodels – Two-Way ANOVA)

## 🧭 Architecture Overview
Monolithic Node/Express app serving static pages and JSON endpoints with session handling.  
The typical flow: **Login/Register → Questionnaire → Robot Co-Design → Image Generation → Rating & Feedback → CSV Export (Admin)**.  
Prompt builder automatically generates DALL·E prompts based on user answers, stores images on the server.

