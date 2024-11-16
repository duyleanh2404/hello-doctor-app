# Hello Bacsi

## Medical Appointment Booking System  
**08/2024 - 11/2024**

Hello Bacsi is an online medical appointment booking platform that allows users to easily search for information about doctors, hospitals, and medical specialties, and book appointments. The platform also offers telehealth services with various supporting features.

### Table of Contents
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation Guide](#installation-guide)
- [Illustrations](#illustrations)
- [Contributions](#contributions)
- [Contact Information](#contact-information)

### Illustrations

1. **Main Website Interface**
![Main Website Interface](https://github.com/duyleanh2404/hello-doctor-app/blob/1f9a3fd16791ee675c985492b88dd69c4941dab2/public/readme/readme-1.png)

2. **Appointment Booking Interface**
![Appointment Booking Interface](https://github.com/duyleanh2404/hello-doctor-app/blob/a3a6a4c0e558a48d4f74c2e484c51f55e805d408/public/readme/readme-7.png)

3. **Doctor Detail Page**
![Doctor Detail Page](https://github.com/duyleanh2404/hello-doctor-app/blob/1f9a3fd16791ee675c985492b88dd69c4941dab2/public/readme/readme-2.png)

4. **Clinic Detail Page**
![Clinic Detail Page](https://github.com/duyleanh2404/hello-doctor-app/blob/1f9a3fd16791ee675c985492b88dd69c4941dab2/public/readme/readme-3.png)

5. **Admin Page**
![Admin Page](https://github.com/duyleanh2404/hello-doctor-app/blob/1f9a3fd16791ee675c985492b88dd69c4941dab2/public/readme/readme-5.png)

6. **Schedule Management Page**
![Schedule Management Page](https://github.com/duyleanh2404/hello-doctor-app/blob/1f9a3fd16791ee675c985492b88dd69c4941dab2/public/readme/readme-6.png)

### Features
- **Registration, Login, and Authentication:** Utilizes JWT and OAuth2 for secure user authentication.
- **OTP Authentication:** Sends OTP via email to verify user accounts.
- **Chatbot Support:** Integrates Gemini 1.5 Flash to assist patients with inquiries.
- **Appointment Booking:** Allows users to filter appointments by date, hospital, doctor, and specialty.
- **Payment Integration:**
  - Cash on Delivery (COD) with email verification.
  - Payment via VNPay (test environment).
- **User and Data Management:** Admins can add, edit, or delete user, doctor, hospital, specialty, article, and doctor schedule information.
- **Article Editing:** A professional text editor is available for article editing.
- **Appointment Confirmation:** Sends a confirmation email along with the doctor's prescription image.

### Technologies Used
- **Frontend:** Next.js, Tailwind CSS, Shadcn/UI, Redux Toolkit, React Hook Form.
- **Backend:** NestJS, MongoDB, Nodemailer.
- **Authentication:** JWT and OAuth2.
- **Payment:** VNPay (test environment).
- **Chatbot Support:** Gemini 1.5 Flash.

### Installation Guide

#### Frontend
Clone the repository:
```bash
git clone https://github.com/duyleanh2404/hello-doctor-app
cd hello-doctor-app
