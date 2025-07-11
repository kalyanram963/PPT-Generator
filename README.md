🚀 AI PPT Generator: Your Smart Presentation Assistant
Welcome to the AI PPT Generator, an innovative web application that revolutionizes the way you create presentations! Say goodbye to tedious slide design and content creation. With the power of AI, you can generate stunning, content-rich presentations in minutes, customize them with ease, and even have them spoken aloud.

✨ Features at a Glance
🧠 AI-Powered Generation: Simply provide a topic and the desired number of slides, and our intelligent AI will generate a complete presentation outline, including titles, bullet points, and image prompts for each slide.

🖼️ Automatic Image Integration: Leveraging the Pexels API, the application automatically fetches and integrates relevant, high-quality images for each slide based on the AI-generated prompts.

✍️ Intuitive Customization: Take full control! Edit slide content (titles, text, bullet points), upload your own images, and even rearrange elements with a user-friendly drag-and-drop interface.

🎨 Dynamic Template Selection: Choose from a variety of pre-defined templates to instantly change the visual style and theme of your entire presentation.

🗣️ Text-to-Speech Narration: Bring your presentations to life! The app can speak the content of your slides or a generated summary, perfect for practice or accessibility.

📊 Presentation Summary: Get a concise, AI-generated summary of your entire presentation, ideal for quick overviews or sharing key takeaways.

📥 Export Options: Download your presentations as professional PDF documents or editable PPTX files (images embedded).

☁️ Cloud Storage: Your presentations are securely saved in Firestore, allowing you to access them anytime, anywhere.

🛠️ Technologies Under the Hood
Frontend:

React.js: For building a dynamic and responsive user interface.

HTML2Canvas & jsPDF: For converting slides to PDF format.

PptxGenJS: For exporting presentations to PPTX format.

React Draggable: For intuitive drag-and-drop slide element customization.

Backend/APIs:

Google Gemini API: The core AI engine for generating presentation content and summaries.

Pexels API: For fetching high-quality, royalty-free images.

Firebase (Firestore & Authentication): For secure user authentication and real-time cloud data storage.

🚀 Getting Started
Follow these steps to get your AI PPT Generator up and running on your local machine.

Prerequisites
Node.js (LTS version recommended)

npm or Yarn

Installation
Clone the repository:

git clone https://github.com/your-username/ai-ppt-generator.git
cd ai-ppt-generator

(Replace https://github.com/your-username/ai-ppt-generator.git with your actual repository URL)

Install dependencies:

npm install
# OR
yarn install

Firebase Project Setup
Create a Firebase Project:

Go to the Firebase Console.

Click "Add project" and follow the steps.

Enable Firestore Database:

In your Firebase project, navigate to "Firestore Database" from the left menu.

Click "Create database" and choose "Start in production mode" (or "test mode" for quick setup, but remember to update security rules later). Select a location.

Set up Firestore Security Rules:

In the Firestore Database section, go to the "Rules" tab.

Replace the existing rules with the following to allow authenticated users to read and write their own data:

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /artifacts/{appId}/users/{userId}/{documents=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}

Click "Publish".

Enable Authentication:

In your Firebase project, navigate to "Authentication" from the left menu.

Go to the "Sign-in method" tab.

Enable the "Anonymous" provider. This is used for initial user sign-in in the Canvas environment.

If you plan to use custom tokens or other methods, enable those as well.

Get Firebase Configuration:

In your Firebase project settings (click the gear icon next to "Project overview" -> "Project settings").

Scroll down to the "Your apps" section.

If you don't have a web app yet, click the </> icon to "Add app to get started" and register your web app.

Copy the firebaseConfig object. It will look something like this:

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};

Update App.js with Firebase Config:

Open src/App.js.

Locate the firebaseConfig constant.

Crucially, ensure the firebaseConfig variable is correctly set up to use the __firebase_config global variable provided by the Canvas environment. If you're running outside Canvas, you'll need to hardcode your actual config here. The current code handles this:

const firebaseConfig = typeof __firebase_config !== 'undefined' ?
  JSON.parse(__firebase_config) :
  {
    // YOUR HARDCODED FIREBASE CONFIG IF RUNNING OUTSIDE CANVAS
    apiKey: "AIzaSyBxS4mHXP_4eFAgs_ZYRDZTAdtD4wj_g6Q", // Replace with your actual API Key
    authDomain: "ai-ppt-generator-project-27b39.firebaseapp.com", // Replace with your actual Auth Domain
    projectId: "ai-ppt-generator-project-27b39", // Replace with your actual Project ID
    storageBucket: "ai-ppt-generator-project-27b39.firebasestorage.app", // Replace with your actual Storage Bucket
    messagingSenderId: "138509839503", // Replace with your actual Messaging Sender ID
    appId: "1:138509839503:web:3d76c2f4eea4fb44c014fa", // Replace with your actual App ID
    measurementId: "G-VGL8KDQX7P" // Replace with your actual Measurement ID (optional)
  };

API Keys Setup
Google Gemini API Key:

Go to the Google AI Studio to generate a Gemini API key.

Open src/App.js.

Locate const geminiApiKey = "YOUR_GEMINI_API_KEY";

Replace "YOUR_GEMINI_API_KEY" with your actual Gemini API key.

Pexels API Key:

Go to the Pexels API website to request a free API key.

Open src/App.js.

Locate const pexelsApiKey = "YOUR_PEXELS_API_KEY";

Replace "YOUR_PEXELS_API_KEY" with your actual Pexels API key.

Run the Application
npm start
# OR
yarn start

This will open the application in your browser, usually at http://localhost:3000.

💡 Usage
Welcome Page: Click "Get Started" to enter the main application.

Generate Automatically:

Select "Generate Automatically" mode.

Enter your desired presentation topic in the input field.

Specify the number of slides (1-15).

Click "Generate Presentation". The AI will create slides with content and images.

Customize My PPT:

Select "Customize My PPT" mode.

Click "Add New Slide" to add a blank slide.

Use the navigation buttons to switch between slides.

Click "Edit Slide" to enable editing for the current slide.

Editing Elements: Click on text fields to type, or use the file input to upload images. Drag and resize elements as needed.

Click "Save Changes" to persist your edits to Firestore.

Templates: Use the "Choose a Template" dropdown to apply different visual styles.

Speech:

"Speak PPT": Narrates the entire presentation.

"Speak Summary": Narrates the AI-generated summary.

"Choose Voice": Select a preferred voice for narration.

Export:

"Download PDF": Exports the current presentation as a PDF.

"Export PPT": Exports the current presentation as a PPTX file (note: text and images are embedded as part of the slide image in PPTX).

Summary: Click "Generate PPT Summary" to get a concise overview of your presentation.

🤝 Contributing
Contributions are welcome! If you have suggestions for improvements, new features, or bug fixes, please feel free to:

Fork the repository.

Create a new branch (git checkout -b feature/YourFeature or fix/BugFix).

Make your changes.

Commit your changes (git commit -m 'Add YourFeature').

Push to the branch (git push origin feature/YourFeature).

Open a Pull Request.

📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

✉️ Contact
If you have any questions or feedback, feel free to reach out:

Your Name/Handle: [Your Name or GitHub Handle]

Email: [Your Email Address]

LinkedIn: [Link to your LinkedIn Profile (Optional)]

Enjoy creating amazing presentations with the power of AI! 🚀