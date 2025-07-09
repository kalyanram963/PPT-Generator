/* global __firebase_config, __initial_auth_token, __app_id, firebase, jsPDF, html2canvas, PptxGenJS */
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./styles/App.css";
import "./styles/animations.css";
import "./components/SlidePreview.css"; // Ensure SlidePreview.css is imported for its styles
import "./styles/WelcomePage.css"; // Import the new WelcomePage CSS

import SlidePreview from "./components/SlidePreview";
import SlideThumbnail from "./components/SlideThumbnail";
import Loader from "./components/Loader";
import templates from "./components/templates";
import CustomModal from "./components/CustomModal";
import WelcomePage from "./components/WelcomePage"; // Import the new WelcomePage component

import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import PptxGenJS from 'pptxgenjs';

// Firebase imports
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy, doc, deleteDoc, updateDoc, getDocs, getDoc } from 'firebase/firestore';

// Global variables provided by the Canvas environment (ESLint ignore added at top of file)
const firebaseConfig = typeof __firebase_config !== 'undefined' ?
  JSON.parse(__firebase_config) :
  {
    apiKey: "AIzaSyBxS4mHXP_4eFAgs_ZYRDZTAdtD4wj_g6Q", // Your actual API Key
    authDomain: "ai-ppt-generator-project-27b39.firebaseapp.com", // Your actual Auth Domain
    projectId: "ai-ppt-generator-project-27b39", // Your actual Project ID
    storageBucket: "ai-ppt-generator-project-27b39.firebasestorage.app", // Your actual Storage Bucket
    messagingSenderId: "138509839503", // Your actual Messaging Sender Id
    appId: "1:138509839503:web:3d76c2f4eea4fb44c014fa", // Your actual App Id
    measurementId: "G-VGL8KDQX7P" // Your actual Measurement Id (optional)
  };

const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

function App() {
  // State for welcome page display
  const [showWelcomePage, setShowWelcomePage] = useState(true); // NEW: State to control welcome page visibility

  // State for presentation logic
  const [topic, setTopic] = useState("");
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(false);
  const [numSlides, setNumSlides] = useState(5);
  const [selectedTemplateId, setSelectedTemplateId] = useState(
    templates && templates.length > 0 ? templates[0].id : ''
  );
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [mode, setMode] = useState('auto-generate'); // 'auto-generate' or 'customize'

  // State to track which slide is being edited directly
  const [editingSlideId, setEditingSlideId] = useState(null);
  // Local state to hold changes for the currently edited slide's elements
  const [tempSlideElements, setTempSlideElements] = useState([]);

  // State for PPT Summary
  const [pptSummary, setPptSummary] = useState('');
  const [showSummarySection, setShowSummarySection] = useState(false);

  // State for Speech Synthesis
  const [isSpeaking, setIsSpeaking] = useState(false);
  const utteranceRef = useRef(null); // Ref to store the SpeechSynthesisUtterance object
  const [availableVoices, setAvailableVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);

  // State for Firebase
  const [db, setDb] = useState(null);
  const [auth, setAuth] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  // State for Custom Modal
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState('info');
  const [modalCallback, setModalCallback] = useState(null);
  const [modalInput, setModalInput] = useState('');

  // Ref for the main slide display area to capture for PDF
  const mainSlidesDisplayAreaRef = useRef(null);

  // Derive the active template object based on selectedTemplateId
  const activeTemplate = templates.find(t => t.id === selectedTemplateId);

  // Function to show a custom modal message
  const showCustomModal = (message, type = 'info', callback = null, initialValue = '') => {
    setModalMessage(message);
    setModalType(type);
    setModalCallback(() => callback || (() => {})); // Ensure callback is always a function
    setModalInput(initialValue);
    setShowModal(true);
  };

  // Helper function to resolve CSS variables (re-introduced for PDF/PPTX export)
  const getStyleValue = (cssVar) => {
    if (cssVar && cssVar.startsWith('var(')) {
      const varName = cssVar.replace('var(', '').replace(')', '').trim();
      return getComputedStyle(document.documentElement).getPropertyValue(varName);
    }
    return cssVar;
  };

  // Speech Synthesis Functions
  useEffect(() => {
    // Function to load voices
    const loadVoices = () => {
      const voices = speechSynthesis.getVoices();
      setAvailableVoices(voices);
      // Try to set a default English voice if available
      const defaultEnglishVoice = voices.find(
        (voice) => voice.lang === 'en-US' || voice.lang.startsWith('en-')
      );
      if (defaultEnglishVoice) {
        setSelectedVoice(defaultEnglishVoice);
      } else if (voices.length > 0) {
        setSelectedVoice(voices[0]); // Fallback to first available voice
      }
    };

    // Load voices immediately if they are already available
    if (speechSynthesis.getVoices().length > 0) {
      loadVoices();
    } else {
      // Otherwise, wait for the 'voiceschanged' event
      speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      speechSynthesis.onvoiceschanged = null; // Clean up event listener
    };
  }, []);


  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      stopSpeaking(); // Stop any current speech before starting new one
      const utterance = new SpeechSynthesisUtterance(text);

      if (selectedVoice) {
        utterance.voice = selectedVoice;
      } else {
        utterance.lang = 'en-US'; // Fallback language
      }
      utterance.rate = 1.0; // Speed of speech
      utterance.pitch = 1.0; // Pitch of speech

      utterance.onstart = () => {
        setIsSpeaking(true);
      };
      utterance.onend = () => {
        setIsSpeaking(false);
      };
      utterance.onerror = (event) => {
        console.error('SpeechSynthesisUtterance.onerror', event);
        setIsSpeaking(false);
        showCustomModal(`Speech error: ${event.error}`, 'error');
      };

      speechSynthesis.speak(utterance);
      utteranceRef.current = utterance; // Store utterance object for potential stopping
    } else {
      showCustomModal("Text-to-speech is not supported in your browser.", 'info');
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window && speechSynthesis.speaking) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
      utteranceRef.current = null;
    }
  };

  // Clean up speech synthesis on component unmount
  useEffect(() => {
    return () => {
      stopSpeaking(); // Ensure speech is stopped when component unmounts
    };
  }, []);

  // Effect hook for Firebase initialization and authentication
  useEffect(() => {
    const initializeFirebase = async () => {
      try {
        let appInstance;
        if (typeof firebase !== 'undefined' && firebase.apps.length) {
          appInstance = firebase.app();
        } else {
          appInstance = initializeApp(firebaseConfig);
        }

        const firestoreDb = getFirestore(appInstance);
        const firebaseAuth = getAuth(appInstance);

        setDb(firestoreDb);
        setAuth(firebaseAuth);

        onAuthStateChanged(firebaseAuth, async (user) => {
          if (user) {
            setUserId(user.uid);
            setIsAuthReady(true);
          } else {
            try {
              if (initialAuthToken) {
                await signInWithCustomToken(firebaseAuth, initialAuthToken);
              } else {
                await signInAnonymously(firebaseAuth);
              }
            } catch (error) {
              console.error("Error during Firebase sign-in:", error);
              if (error.code === 'auth/configuration-not-found' || error.code === 'auth/unauthorized-domain') {
                showCustomModal(
                  `Firebase Error: ${error.message}. Please ensure Firebase Authentication is enabled and ` +
                  `'localhost' (or '127.0.0.1') is added to your Authorized Domains in Firebase Console.`,
                  'error'
                );
              } else if (error.code === 'auth/api-key-not-valid') {
                showCustomModal(
                  `Firebase Error: ${error.message}. Please ensure your Firebase API Key in App.js is correct.`,
                  'error'
                );
              } else {
                showCustomModal(`Error signing in: ${error.message}`, 'error');
              }
            }
          }
        });
      } catch (error) {
        console.error("Error initializing Firebase:", error);
        showCustomModal(`Error initializing Firebase: ${error.message}`, 'error');
      }
    };

    initializeFirebase();
  }, []);

  // Effect hook for fetching slides from Firestore
  useEffect(() => {
    if (db && userId && isAuthReady) {
      const slidesCollectionRef = collection(db, `artifacts/${appId}/users/${userId}/slides`);
      const q = query(slidesCollectionRef);

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const fetchedSlides = snapshot.docs.map(doc => {
          const data = doc.data();
          // Ensure every slide has an 'elements' array, providing a fallback for old data
          if (!data.elements) {
            // This is an old slide, create default elements based on old fields
            const defaultElements = [
              { id: 'title-' + doc.id, type: 'title', content: data.title || "Untitled Slide", x: '5%', y: '5%', width: '90%', height: 'auto' },
              { id: 'bullets-' + doc.id, type: 'bullet-points', content: Array.isArray(data.content) ? data.content : (data.content ? String(data.content).split('\n') : []), x: '10%', y: '20%', width: '80%', height: 'auto' }, // height: 'auto'
            ];
            // Only add image element if imageUrl exists in old data
            if (data.imageUrl) {
              defaultElements.push({ id: 'image-' + doc.id, type: 'image', imagePrompt: data.imagePrompt || "", src: data.imageUrl, x: '5%', y: '45%', width: '90%', height: '45%' }); // Set explicit height
            }
            return {
              id: doc.id,
              ...data, // Keep other existing fields if any
              elements: defaultElements,
            };
          }
          return {
            id: doc.id,
            ...data
          };
        });
        fetchedSlides.sort((a, b) => (a.timestamp?.toMillis() || 0) - (b.timestamp?.toMillis() || 0));
        setSlides(fetchedSlides);

        if (currentSlideIndex >= fetchedSlides.length && fetchedSlides.length > 0) {
          setCurrentSlideIndex(fetchedSlides.length - 1);
        } else if (fetchedSlides.length === 0) {
          setCurrentSlideIndex(0);
        }
      }, (error) => {
        console.error("Error fetching slides:", error);
        showCustomModal(`Error fetching slides: ${error.message}`, 'error');
      });

      return () => unsubscribe();
    }
  }, [db, userId, isAuthReady, currentSlideIndex]);

  // Effect hook to apply template-specific CSS variables to the document body
  useEffect(() => {
    if (activeTemplate && activeTemplate.colors) {
      for (const key in activeTemplate.colors) {
        document.documentElement.style.setProperty(key, activeTemplate.colors[key]);
      }
      // Also set CSS variables for the template card preview (used by template gallery)
      // These are no longer directly used by TemplateCard, but might be useful for other previews
      document.documentElement.style.setProperty('--template-card-background', activeTemplate.styles.slideBackground);
      document.documentElement.style.setProperty('--template-card-border', activeTemplate.styles.borderColor);
      document.documentElement.style.setProperty('--template-card-shadow', activeTemplate.styles.boxShadow);
      document.documentElement.style.setProperty('--template-card-text', activeTemplate.styles.bulletColor);
    }
  }, [activeTemplate]);

  /**
   * Asynchronously generates presentation slides by calling the Gemini API.
   * Stores the generated slides in Firestore.
   */
  const generateSlides = async () => {
    if (!topic.trim()) {
      showCustomModal("Please enter a topic to generate slides.", 'info');
      return;
    }

    if (numSlides < 1 || numSlides > 15) {
      showCustomModal("Please enter a number of slides between 1 and 15.", 'info');
      return;
    }

    setLoading(true); // Start overall loading

    if (slides.length > 0) {
      showCustomModal("Generating new slides will replace existing ones. Continue?", 'confirm', async (confirmed) => {
        if (confirmed) {
          await clearAllSlides(); // Clear existing slides from Firestore
          await fetchAndSaveSlidesOutlineAndImages(); // Then fetch and save new ones + images
        } else {
          setLoading(false); // Stop loading if cancelled
        }
      });
    } else {
      await fetchAndSaveSlidesOutlineAndImages();
    }
  };

  // Helper function to fetch slides outline from Gemini AND generate images
  const fetchAndSaveSlidesOutlineAndImages = async () => {
    try {
      const geminiApiKey = "AIzaSyAJU8gPvh7bmNEw8CBJNUp6lIAMe4AC2Sg"; // YOUR GEMINI API KEY HERE
      const geminiApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`;

      const geminiPayload = {
        contents: [
          {
            parts: [
              {
                text: `Generate a ${numSlides}-slide PowerPoint presentation on the topic "${topic}". ` +
                      `For each slide, provide a "title", a "content" field (a JSON array of 3-4 bullet point strings, each starting with '• '), ` +
                      `and an "imagePrompt" field (a concise, descriptive string for an image related to that slide's content, suitable for an image generation AI). ` +
                      `The overall response MUST be a JSON array of slide objects. ` +
                      `Example format: ` +
                      `[{"title": "Slide Title 1", "content": ["• Bullet 1", "• Bullet 2"], "imagePrompt": "A futuristic city skyline"}, ` +
                      `{"title": "Slide Title 2", "content": ["• Bullet A", "• Bullet B"], "imagePrompt": "Abstract network connections"}]`
              }
            ]
          }
        ],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "ARRAY",
            items: {
              type: "OBJECT",
              properties: {
                "title": { "type": "STRING" },
                "content": {
                  "type": "ARRAY",
                  "items": { "type": "STRING" }
                },
                "imagePrompt": { "type": "STRING" } // New field for image prompt
              },
              "propertyOrdering": ["title", "content", "imagePrompt"] // Ensure order
            }
          }
        }
      };

      console.log("Sending Gemini request with payload:", JSON.stringify(geminiPayload, null, 2));

      const geminiResponse = await fetch(geminiApiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(geminiPayload)
      });

      console.log("Gemini Raw Response Object:", geminiResponse);

      if (!geminiResponse.ok) {
        const errorData = await geminiResponse.json();
        console.error("Gemini API Error Response Data:", errorData);
        throw new Error(`Gemini API error: ${geminiResponse.status} ${geminiResponse.statusText} - ${errorData.error?.message || 'Unknown error'}`);
      }

      const geminiResult = await geminiResponse.json();
      console.log("Gemini Parsed JSON Result:", geminiResult);


      let parsedSlides = [];
      if (geminiResult.candidates && geminiResult.candidates.length > 0 &&
          geminiResult.candidates[0].content && geminiResult.candidates[0].content.parts &&
          geminiResult.candidates[0].content.parts.length > 0) {
        const rawJsonText = geminiResult.candidates[0].content.parts[0].text;
        console.log("Raw Gemini Response (for slides & image prompts):", rawJsonText); // DEBUG: Log raw response
        try {
          parsedSlides = JSON.parse(rawJsonText);
          if (!Array.isArray(parsedSlides) || parsedSlides.some(slide => !slide.title || !slide.content)) {
            throw new Error("Parsed JSON is not in the expected array of slide objects format.");
          }
        } catch (jsonError) {
          console.error("Failed to parse JSON response from Gemini:", jsonError);
          showCustomModal(
            `❌ Failed to parse AI response for slides. The AI might have returned malformed JSON. ` +
            `Please try again. Check console for raw response.`,
            'error'
          );
          setLoading(false);
          return;
        }
      } else {
        console.warn("Gemini response did not contain expected candidates structure:", geminiResult);
        showCustomModal("❌ Gemini AI did not return a valid response for slides. Please try again.", 'error');
        setLoading(false);
        return;
      }

      // Clear existing slides from Firestore before saving new ones
      await clearAllSlides();

      // Store slides temporarily to generate images
      const slidesToProcess = [];
      const slidesCollectionRef = collection(db, `artifacts/${appId}/users/${userId}/slides`);

      for (const slide of parsedSlides) {
        const contentArray = Array.isArray(slide.content) ? slide.content : String(slide.content || '').split('\n');
        const docRef = await addDoc(slidesCollectionRef, {
          // NEW DATA MODEL: Store elements instead of separate fields
          elements: [
            // Giving more vertical space and ensuring height: 'auto'
            { id: 'title-' + Date.now(), type: 'title', content: slide.title || "Untitled Slide", x: '5%', y: '5%', width: '90%', height: 'auto' },
            { id: 'bullets-' + Date.now(), type: 'bullet-points', content: contentArray, x: '10%', y: '20%', width: '80%', height: 'auto' }, // Started higher, with auto height
            { id: 'image-' + Date.now(), type: 'image', imagePrompt: slide.imagePrompt || "", src: null, x: '5%', y: '45%', width: '90%', height: '45%' } // Set explicit height
          ],
          timestamp: new Date(),
        });
        slidesToProcess.push({ id: docRef.id, ...slide, content: contentArray }); // Keep old structure for image generation loop
      }

      // Now, generate images for each slide using Pexels API
      // Use Promise.allSettled to allow some image generations to fail without stopping others
      const imageGenerationPromises = slidesToProcess.map(async (slide) => {
        try {
          const imageUrl = await generateImageForSlide(slide.id, slide.title, slide.content, slide.imagePrompt);
          // Update the slide in Firestore with the generated image URL
          if (imageUrl && db && userId) {
            // Find the image element and update its src
            const slideDocRef = doc(db, `artifacts/${appId}/users/${userId}/slides`, slide.id);
            const currentSlideData = (await getDoc(slideDocRef)).data();
            const updatedElements = currentSlideData.elements.map(el =>
              el.type === 'image' ? { ...el, src: imageUrl } : el
            );
            await updateDoc(slideDocRef, {
              elements: updatedElements,
            });
          }
        } catch (imageError) {
          console.error(`Error generating image for slide ${slide.id}:`, imageError);
          // Optionally show a modal for each failed image, or collect errors
          // showCustomModal(`Failed to generate image for slide "${slide.title}": ${imageError.message}`, 'error');
        }
      });

      await Promise.allSettled(imageGenerationPromises); // Wait for all image generations to complete

      showCustomModal('Presentation generated and images processed!', 'info');
      setCurrentSlideIndex(0); // Reset to first slide after generation

    } catch (error) {
      console.error("Error during slide generation/saving:", error);
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        showCustomModal("❌ Network error: Could not connect to the API. Please check your internet connection.", 'error');
      } else if (error.message.includes('API error:')) {
           showCustomModal(`❌ Gemini API Error: ${error.message}`, 'error');
       }
      else {
        showCustomModal(`❌ An unexpected error occurred: ${error.message}`, 'error');
      }
    } finally {
      setLoading(false); // End overall loading
    }
  };

  // Refactored function to generate image for a specific slide using Pexels API
  const generateImageForSlide = async (slideId, slideTitle, slideContentArray, imagePrompt) => {
    try {
      const pexelsApiKey = "wFOYZBCfPQpZJe6f61GqizDZ2F59lR0KmL0l4HuVptdxftB9P8pZsa4m"; // YOUR PEXELS API KEY HERE
      // Use the imagePrompt provided by Gemini, or fall back to a generic one
      const queryText = encodeURIComponent(imagePrompt || slideTitle);
      const pexelsApiUrl = `https://api.pexels.com/v1/search?query=${queryText}&per_page=1`;

      console.log(`Sending Pexels request for slide ${slideId} with prompt: "${queryText}"`);

      const pexelsResponse = await fetch(pexelsApiUrl, {
        method: 'GET', // Pexels search is a GET request
        headers: {
          'Authorization': pexelsApiKey, // Pexels uses 'Authorization' header
          'Content-Type': 'application/json' // Still good practice
        },
      });

      if (!pexelsResponse.ok) {
        const errorData = await pexelsResponse.json();
        console.error("Pexels API Error Response Data:", errorData);
        throw new Error(`Pexels API Error: ${pexelsResponse.status} - ${errorData.error?.message || 'Unknown error'}`);
      }

      const pexelsResult = await pexelsResponse.json();
      console.log(`Pexels Parsed JSON Result for prompt "${queryText}":`, pexelsResult);

      if (pexelsResult.photos && pexelsResult.photos.length > 0) {
        // Choose a suitable image size, e.g., 'large' or 'medium'
        return pexelsResult.photos[0].src.large;
      } else {
        console.warn(`Pexels did not return any photos for prompt: "${queryText}"`);
        return null; // Return null if no image is found
      }
    } catch (error) {
      console.error("Error in generateImageForSlide:", error);
      throw error; // Re-throw to be caught by Promise.allSettled
    }
  };

  /**
   * Generates a summary of the entire presentation using the Gemini API.
   */
  const generatePptSummary = async () => {
    if (slides.length === 0) {
      showCustomModal("No slides to summarize. Please generate a presentation first.", 'info');
      return;
    }

    setLoading(true);
    setPptSummary(''); // Clear previous summary
    setShowSummarySection(true); // Show the summary section, even if loading

    try {
      const geminiApiKey = "AIzaSyAJU8gPvh7bmNEw8CBJNUp6lIAMe4AC2Sg"; // YOUR GEMINI API KEY HERE
      const geminiApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`;

      // Construct the full text of the presentation from all slides' elements
      let fullPresentationText = `Presentation Topic: ${topic}\n\n`;
      slides.forEach((slide, index) => {
        const titleElement = slide.elements.find(el => el.type === 'title');
        const contentElement = slide.elements.find(el => el.type === 'bullet-points' || el.type === 'text');

        fullPresentationText += `Slide ${index + 1}: ${titleElement ? titleElement.content : 'Untitled'}\n`;
        if (contentElement) {
          if (Array.isArray(contentElement.content)) {
            fullPresentationText += contentElement.content.map(bp => `${bp}`).join('\n') + '\n';
          } else {
            fullPresentationText += contentElement.content + '\n';
          }
        }
        fullPresentationText += '\n'; // Add a newline between slides
      });

      const prompt = `Summarize the following presentation content in a concise and informative paragraph. Focus on the main points and overall message.
      \n\n${fullPresentationText}`;

      const geminiPayload = {
        contents: [
          {
            parts: [
              { text: prompt }
            ]
          }
        ],
        generationConfig: {
          responseMimeType: "text/plain" // Request plain text summary
        }
      };

      console.log("Sending Gemini summary request with payload:", JSON.stringify(geminiPayload, null, 2));

      const geminiResponse = await fetch(geminiApiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(geminiPayload)
      });

      if (!geminiResponse.ok) {
        const errorData = await geminiResponse.json();
        console.error("Gemini Summary API Error Response Data:", errorData);
        throw new Error(`Gemini API error: ${geminiResponse.status} ${geminiResponse.statusText} - ${errorData.error?.message || 'Unknown error'}`);
      }

      const geminiResult = await geminiResponse.json();
      console.log("Gemini Summary Parsed JSON Result:", geminiResult);

      if (geminiResult.candidates && geminiResult.candidates.length > 0 &&
          geminiResult.candidates[0].content && geminiResult.candidates[0].content.parts &&
          geminiResult.candidates[0].content.parts.length > 0) {
        const summaryText = geminiResult.candidates[0].content.parts[0].text;
        setPptSummary(summaryText);
        showCustomModal('Presentation summary generated!', 'info');
      } else {
        console.warn("Gemini response did not contain expected summary structure:", geminiResult);
        showCustomModal("❌ Gemini AI did not return a valid summary. Please try again.", 'error');
      }

    } catch (error) {
      console.error("Error generating PPT summary:", error);
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        showCustomModal("❌ Network error: Could not connect to the API for summary. Please check your internet connection.", 'error');
      } else {
        showCustomModal(`❌ An error occurred while generating summary: ${error.message}`, 'error');
      }
      setPptSummary('Failed to generate summary.'); // Show a fallback message
    } finally {
      setLoading(false);
    }
  };

  // Function to speak the entire PPT
  const speakPpt = () => {
    if (slides.length === 0) {
      showCustomModal("No slides to speak. Please generate a presentation first.", 'info');
      return;
    }

    if (isSpeaking) {
      stopSpeaking();
      return;
    }

    let fullText = `Starting presentation on ${topic}. `;
    slides.forEach((slide, index) => {
      const titleElement = slide.elements.find(el => el.type === 'title');
      const contentElement = slide.elements.find(el => el.type === 'bullet-points' || el.type === 'text');
      const imageElement = slide.elements.find(el => el.type === 'image');

      fullText += `Slide ${index + 1}: ${titleElement ? titleElement.content : 'Untitled Slide'}. `;
      if (contentElement) {
        if (Array.isArray(contentElement.content)) {
          fullText += contentElement.content.map(bp => `${bp}. `).join('');
        } else {
          fullText += contentElement.content + '. ';
        }
      }
      if (imageElement && imageElement.imagePrompt) {
        fullText += `Image description: ${imageElement.imagePrompt}. `;
      }
      fullText += 'Next slide. ';
    });
    fullText += 'End of presentation.';

    speakText(fullText);
  };

  // Function to speak the summary
  const speakSummary = () => {
    if (!pptSummary) {
      showCustomModal("No summary to speak. Please generate a summary first.", 'info');
      return;
    }

    if (isSpeaking) {
      stopSpeaking();
      return;
    }

    speakText(pptSummary);
  };


  /**
   * Handles copying the current slide's content to the clipboard.
   */
  const handleCopySlide = () => {
    if (slides.length > 0 && currentSlideIndex < slides.length) {
      const slide = slides[currentSlideIndex];
      // Adapt for new elements structure
      const titleElement = slide.elements.find(el => el.type === 'title');
      const contentElement = slide.elements.find(el => el.type === 'bullet-points' || el.type === 'text');
      const imageElement = slide.elements.find(el => el.type === 'image');

      let textToCopy = '';
      if (titleElement) textToCopy += `Title: ${titleElement.content}\n\n`;
      if (contentElement) {
        if (Array.isArray(contentElement.content)) {
          textToCopy += `Bullet Points:\n${contentElement.content.map(bp => `- ${bp}`).join('\n')}`;
        } else {
          textToCopy += `Content:\n${contentElement.content}`;
        }
      }
      if (imageElement && imageElement.imagePrompt) textToCopy += `\n\nImage Prompt: ${imageElement.imagePrompt}`;


      try {
        // Using document.execCommand('copy') as navigator.clipboard.writeText() might not work in some iframe environments
        const textarea = document.createElement('textarea');
        textarea.value = textToCopy;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showCustomModal('Slide content copied to clipboard!', 'info');
      } catch (err) {
        console.error('Failed to copy text:', err);
        showCustomModal('Failed to copy slide content.', 'error');
      }
    }
  };

  /**
   * Deletes all slides from Firestore for the current user.
   */
  const clearAllSlides = async () => {
    if (db && userId) {
      try {
        const slidesCollectionRef = collection(db, `artifacts/${appId}/users/${userId}/slides`);
        const q = query(slidesCollectionRef);
        const snapshot = await getDocs(q); // Use getDocs for a one-time fetch

        const deletePromises = [];
        snapshot.forEach((document) => {
          deletePromises.push(deleteDoc(doc(db, `artifacts/${appId}/users/${userId}/slides`, document.id)));
        });
        await Promise.all(deletePromises);
        console.log("All previous slides cleared from Firestore.");
      } catch (error) {
        console.error("Error clearing previous slides:", error);
        showCustomModal(`Error clearing previous slides: ${error.message}`, 'error');
      }
    }
  };

  /**
   * Asynchronously downloads the generated slides as a PDF document.
   */
  const downloadPptAsPdf = async () => {
    if (slides.length === 0) {
      showCustomModal("No slides to download. Please generate a presentation first.", 'info');
      return;
    }

    setLoading(true);

    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    // Create a temporary container to render slides for html2canvas
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px'; // Position off-screen
    tempContainer.style.top = '-9999px';
    tempContainer.style.width = '800px'; // Fixed width for consistent rendering
    tempContainer.style.height = 'auto';
    tempContainer.style.overflow = 'hidden';
    tempContainer.style.backgroundColor = 'white'; // Ensure white background for capture
    document.body.appendChild(tempContainer);

    try {
      for (let i = 0; i < slides.length; i++) {
        const slideData = slides[i];

        // Create a temporary slide element mirroring SlidePreview's structure and styles
        const tempSlideElement = document.createElement('div');
        tempSlideElement.className = 'slide-preview'; // Apply base styles from App.css

        // Get computed styles once to resolve CSS variables for more direct application
        const computedStyle = getComputedStyle(document.documentElement);

        // Apply base structural styles
        Object.assign(tempSlideElement.style, {
          width: '100%',
          padding: '40px',
          minHeight: '700px', // Increased for PDF capture consistency
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          position: 'relative',
          overflow: 'hidden',
          boxSizing: 'border-box',
          backdropFilter: 'none',
          webkitBackdropFilter: 'none',
          borderRadius: getStyleValue('--border-radius'),
        });

        // Apply template-specific background and border, simplifying for html2canvas
        let slideBgColor = 'white'; // Safe default
        if (activeTemplate?.styles?.slideBackground) {
            const templateBg = activeTemplate.styles.slideBackground;
            const resolvedBg = templateBg.startsWith('var(') ? computedStyle.getPropertyValue(templateBg.replace('var(', '').replace(')', '').trim()) : templateBg;
            if (resolvedBg && !resolvedBg.includes('gradient')) { // Avoid gradients
                slideBgColor = resolvedBg;
            } else if (!templateBg.includes('gradient')) { // Direct color value and not a gradient
                slideBgColor = templateBg;
            }
        }
        tempSlideElement.style.backgroundColor = slideBgColor;
        tempSlideElement.style.boxShadow = 'none'; // Remove complex shadows for capture
        tempSlideElement.style.borderColor = activeTemplate?.styles?.borderColor?.startsWith('var(') ?
            computedStyle.getPropertyValue(activeTemplate.styles.borderColor.replace('var(', '').replace(')', '').trim()) :
            activeTemplate?.styles?.borderColor || getStyleValue('--border-color');


        // Add accent shape to temporary slide for PDF capture
        if (activeTemplate?.styles?.accentShapeColor) {
          const accentShapeDiv = document.createElement('div');
          accentShapeDiv.className = 'accent-corner-shape';
          accentShapeDiv.style.backgroundColor = activeTemplate.styles.accentShapeColor.startsWith('var(') ?
            computedStyle.getPropertyValue(activeTemplate.styles.accentShapeColor.replace('var(', '').replace(')', '').trim()) :
            activeTemplate.styles.accentShapeColor;
          // Set explicit dimensions for PDF capture consistency
          Object.assign(accentShapeDiv.style, {
            width: '100px',
            height: '100px',
            position: 'absolute',
            top: '0',
            right: '0',
            borderBottomLeftRadius: getStyleValue('--border-radius'),
            boxShadow: '0 0 15px rgba(0, 0, 0, 0.3)', // Keep simple shadow for shape
          });
          tempSlideElement.appendChild(accentShapeDiv);
        }

        // Iterate over elements for PDF capture
        slideData.elements.forEach(element => {
          let elementHtml = null;
          const elementStyle = {
            position: 'absolute',
            left: element.x,
            top: element.y,
            width: element.width,
            height: element.height, // Use element's height property
            boxSizing: 'border-box',
            padding: '5px',
            // Add any other common styles or resolve CSS variables here
          };

          switch (element.type) {
            case 'title':
              elementHtml = document.createElement('h2');
              elementHtml.textContent = element.content;
              Object.assign(elementHtml.style, {
                fontSize: '2.5em',
                marginBottom: '20px',
                paddingBottom: '12px',
                textAlign: 'center',
                fontWeight: '800',
                textShadow: '0 0 10px rgba(0, 201, 255, 0.5)',
                color: getStyleValue(activeTemplate.styles.titleColor),
                borderBottom: `3px solid ${getStyleValue(activeTemplate.styles.borderColor)}`
              });
              break;
            case 'text':
              elementHtml = document.createElement('div');
              elementHtml.innerHTML = element.content.split('\n').map(line => `<p>${line}</p>`).join('');
              Object.assign(elementHtml.style, {
                fontSize: '1.2em',
                lineHeight: '1.5',
                color: getStyleValue(activeTemplate.styles.bulletColor)
              });
              break;
            case 'bullet-points':
              elementHtml = document.createElement('ul');
              Object.assign(elementHtml.style, {
                listStyle: 'none',
                padding: '0',
                margin: '0',
                fontSize: '1.2em',
                lineHeight: '2',
                color: getStyleValue(activeTemplate.styles.bulletColor)
              });
              element.content.forEach(point => {
                const listItem = document.createElement('li');
                listItem.className = 'slide-bullet-point';
                Object.assign(listItem.style, {
                  display: 'flex',
                  alignItems: 'flex-start',
                  marginBottom: '15px',
                });
                const bulletIcon = document.createElement('span');
                bulletIcon.className = 'bullet-icon';
                bulletIcon.textContent = '•';
                Object.assign(bulletIcon.style, {
                  fontSize: '1.8em',
                  marginRight: '15px',
                  lineHeight: '1',
                  flexShrink: '0',
                  textShadow: '0 0 8px rgba(255, 107, 107, 0.7)',
                  color: getStyleValue(activeTemplate.colors['--template-accent'])
                });
                const textSpan = document.createElement('span');
                // Ensure no leading bullet from AI content
                textSpan.textContent = point.replace(/^[\s\-\*\•]+\s*/, '');
                listItem.appendChild(bulletIcon);
                listItem.appendChild(textSpan);
                elementHtml.appendChild(listItem);
              });
              break;
            case 'image':
              if (element.src) {
                elementHtml = document.createElement('img');
                elementHtml.src = element.src;
                Object.assign(elementHtml.style, {
                  width: '100%',
                  height: '100%', // Use 100% of its container
                  objectFit: 'contain',
                  borderRadius: getStyleValue('--border-radius'),
                  boxShadow: getStyleValue('--box-shadow'),
                });
              }
              break;
            default:
              break;
          }

          if (elementHtml) {
            Object.assign(elementHtml.style, elementStyle); // Apply common element styles
            tempSlideElement.appendChild(elementHtml);
          }
        });

        tempContainer.appendChild(tempSlideElement);

        // A small delay to ensure rendering is complete before capture
        await new Promise(resolve => setTimeout(resolve, 100));

        const canvas = await html2canvas(tempSlideElement, {
          scale: 2, // Higher scale for better quality PDF
          useCORS: true,
          logging: false, // Set to true for debugging html2canvas issues
          // Ensure html2canvas background color is also simple
          backgroundColor: tempSlideElement.style.backgroundColor || 'white',
          windowWidth: tempSlideElement.scrollWidth, // Capture full width
          windowHeight: tempSlideElement.scrollHeight // Capture full height
        });

        const imgData = canvas.toDataURL('image/png');

        const imgWidth = pdfWidth - 20; // 10mm margin on each side
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        if (i > 0) {
          pdf.addPage();
        }

        // Center image on the page
        const xOffset = (pdfWidth - imgWidth) / 2;
        const yOffset = (pdfHeight - imgHeight) / 2;
        pdf.addImage(imgData, 'PNG', xOffset, yOffset, imgWidth, imgHeight);

        tempContainer.removeChild(tempSlideElement); // Clean up the temporary slide element
      }

      pdf.save(`presentation_${topic || "untitled"}.pdf`);
      showCustomModal('PDF downloaded successfully!', 'info');

    } catch (error) {
      console.error("Error during PDF generation:", error);
      showCustomModal(`Failed to generate PDF. Please try again. Error: ${error.message}`, 'error');
    } finally {
      if (tempContainer.parentNode) {
        tempContainer.parentNode.removeChild(tempContainer);
      }
      setLoading(false);
    }
  };

/**
 * Exports the presentation as a PowerPoint file (PPTX) by capturing rendered HTML.
 */
const exportToPPTX = async () => {
  if (slides.length === 0) {
    showCustomModal("No slides to export. Please generate a presentation first.", 'info');
    return;
  }

  setLoading(true); // Start loading for PPTX export

  let tempContainer = null; // Declare tempContainer outside the try block

  try {
    const pptx = new PptxGenJS();
    pptx.author  = "AI PPT Generator";
    pptx.company = "Your Company";
    pptx.title   = topic || "AI Generated Presentation";
    pptx.layout = 'LAYOUT_WIDE'; // Standard 16:9 layout (10 inches wide, 7.5 inches high)

    // Create a temporary container to render slides for html2canvas, similar to PDF export
    tempContainer = document.createElement('div'); // Initialize here
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px'; // Position off-screen
    tempContainer.style.top = '-9999px';
    tempContainer.style.width = '950px'; // Match main-slides-display-area max-width for consistent capture
    tempContainer.style.height = 'auto';
    tempContainer.style.overflow = 'hidden';
    tempContainer.style.backgroundColor = 'white'; // Ensure white background for capture
    document.body.appendChild(tempContainer);

    // Get computed styles once to resolve CSS variables for more direct application
    const computedStyle = getComputedStyle(document.documentElement);

    for (let i = 0; i < slides.length; i++) {
      const slideData = slides[i];

      // Create a temporary slide element mirroring SlidePreview's structure and styles
      const tempSlideElement = document.createElement('div');
      tempSlideElement.className = 'slide-preview'; // Apply base styles from App.css

      // Apply base structural styles
      Object.assign(tempSlideElement.style, {
        width: '100%',
        padding: '40px',
        minHeight: '700px', // Increased for PPTX capture consistency
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        position: 'relative',
        overflow: 'hidden',
        boxSizing: 'border-box',
        backdropFilter: 'none',
        webkitBackdropFilter: 'none',
        borderRadius: getStyleValue('--border-radius'),
      });

      // Apply template-specific background and border, simplifying for html2canvas
      let slideBgColor = 'white'; // Safe default
      if (activeTemplate?.styles?.slideBackground) {
          const templateBg = activeTemplate.styles.slideBackground;
          const resolvedBg = templateBg.startsWith('var(') ? computedStyle.getPropertyValue(templateBg.replace('var(', '').replace(')', '').trim()) : templateBg;
          if (resolvedBg && !resolvedBg.includes('gradient')) { // Avoid gradients
              slideBgColor = resolvedBg;
          } else if (!templateBg.includes('gradient')) { // Direct color value and not a gradient
              slideBgColor = templateBg;
          }
      }
      tempSlideElement.style.backgroundColor = slideBgColor;
      tempSlideElement.style.boxShadow = 'none'; // Remove complex shadows for capture
      tempSlideElement.style.borderColor = activeTemplate?.styles?.borderColor?.startsWith('var(') ?
          computedStyle.getPropertyValue(activeTemplate.styles.borderColor.replace('var(', '').replace(')', '').trim()) :
          activeTemplate?.styles?.borderColor || getStyleValue('--border-color');

      // Add accent shape to temporary slide for PPTX capture
      if (activeTemplate?.styles?.accentShapeColor) {
        const accentShapeDiv = document.createElement('div');
        accentShapeDiv.className = 'accent-corner-shape';
        accentShapeDiv.style.backgroundColor = activeTemplate.styles.accentShapeColor.startsWith('var(') ?
          computedStyle.getPropertyValue(activeTemplate.styles.accentShapeColor.replace('var(', '').replace(')', '').trim()) :
          activeTemplate.styles.accentShapeColor;
        // Set explicit dimensions for capture consistency
        Object.assign(accentShapeDiv.style, {
          width: '100px',
          height: '100px',
          position: 'absolute',
          top: '0',
          right: '0',
          borderBottomLeftRadius: getStyleValue('--border-radius'),
          boxShadow: '0 0 15px rgba(0, 0, 0, 0.3)', // Keep simple shadow for shape
        });
        tempSlideElement.appendChild(accentShapeDiv);
      }

      // Iterate over elements for PPTX capture
      slideData.elements.forEach(element => {
        let elementHtml = null;
        const elementStyle = {
          position: 'absolute',
          left: element.x,
          top: element.y,
          width: element.width,
          height: element.height, // Use element's height property
          boxSizing: 'border-box',
          padding: '5px',
          // Add any other common styles or resolve CSS variables here
        };

        switch (element.type) {
          case 'title':
            elementHtml = document.createElement('h2');
            elementHtml.textContent = element.content;
            Object.assign(elementHtml.style, {
              fontSize: '2.5em',
              marginBottom: '20px',
              paddingBottom: '12px',
              textAlign: 'center',
              fontWeight: '800',
              textShadow: '0 0 10px rgba(0, 201, 255, 0.5)',
              color: getStyleValue(activeTemplate.styles.titleColor),
              borderBottom: `3px solid ${getStyleValue(activeTemplate.styles.borderColor)}`
            });
            break;
          case 'text':
            elementHtml = document.createElement('div');
            elementHtml.innerHTML = element.content.split('\n').map(line => `<p>${line}</p>`).join('');
            Object.assign(elementHtml.style, {
              fontSize: '1.2em',
              lineHeight: '1.5',
              color: getStyleValue(activeTemplate.styles.bulletColor)
            });
            break;
          case 'bullet-points':
            elementHtml = document.createElement('ul');
            Object.assign(elementHtml.style, {
              listStyle: 'none',
              padding: '0',
              margin: '0',
              fontSize: '1.2em',
              lineHeight: '2',
              color: getStyleValue(activeTemplate.styles.bulletColor)
            });
            element.content.forEach(point => {
              const listItem = document.createElement('li');
              listItem.className = 'slide-bullet-point';
              Object.assign(listItem.style, {
                display: 'flex',
                alignItems: 'flex-start',
                marginBottom: '15px',
              });
              const bulletIcon = document.createElement('span');
              bulletIcon.className = 'bullet-icon';
              bulletIcon.textContent = '•';
              Object.assign(bulletIcon.style, {
                  fontSize: '1.8em',
                  marginRight: '15px',
                  lineHeight: '1',
                  flexShrink: '0',
                  textShadow: '0 0 8px rgba(255, 107, 107, 0.7)',
                  color: getStyleValue(activeTemplate.colors['--template-accent'])
                });
                const textSpan = document.createElement('span');
                // Ensure no leading bullet from AI content
                textSpan.textContent = point.replace(/^[\s\-\*\•]+\s*/, '');
                listItem.appendChild(bulletIcon);
                listItem.appendChild(textSpan);
                elementHtml.appendChild(listItem);
              });
              break;
            case 'image':
              if (element.src) {
                elementHtml = document.createElement('img');
                elementHtml.src = element.src;
                Object.assign(elementHtml.style, {
                  width: '100%',
                  height: '100%', // Use 100% of its container
                  objectFit: 'contain',
                  borderRadius: getStyleValue('--border-radius'),
                  boxShadow: getStyleValue('--box-shadow'),
                });
              }
              break;
            default:
              break;
          }

          if (elementHtml) {
            Object.assign(elementHtml.style, elementStyle); // Apply common element styles
            tempSlideElement.appendChild(elementHtml);
          }
        });

        tempContainer.appendChild(tempSlideElement);

        // A small delay to ensure rendering is complete before capture
        await new Promise(resolve => setTimeout(resolve, 100)); // Give browser time to render

        const canvas = await html2canvas(tempSlideElement, {
          scale: 2, // Higher scale for better quality
          useCORS: true,
          logging: false,
          backgroundColor: tempSlideElement.style.backgroundColor || 'white',
          windowWidth: tempSlideElement.scrollWidth,
          windowHeight: tempSlideElement.scrollHeight
        });

        const imgData = canvas.toDataURL('image/png');

        // Add a new slide to the PPTX and add the captured image to it
        const slide = pptx.addSlide();
        // Position the image to cover the entire slide
        slide.addImage({ data: imgData, x: 0, y: 0, w: pptx.presLayout.width, h: pptx.presLayout.height });

        tempContainer.removeChild(tempSlideElement); // Clean up the temporary slide element
      }

      pptx.writeFile({ fileName: `presentation_${topic || "untitled"}.pptx` });
      showCustomModal("PPTX exported successfully! (Note: Text is now part of images)", 'info');
    }
    catch (err) {
      console.error("Error exporting PPTX:", err);
      showCustomModal(`Error exporting PPTX: ${err.message}`, 'error');
    } finally {
      // Ensure tempContainer is defined before trying to remove it
      if (tempContainer && tempContainer.parentNode) {
        tempContainer.parentNode.removeChild(tempContainer);
      }
      setLoading(false); // End loading
    }
  };

  /**
   * Adds a new blank slide to Firestore when in 'customize' mode.
   */
  const addNewSlide = async () => {
    if (!db || !userId) {
      showCustomModal("Firebase is not ready. Please wait or check your connection.", 'error');
      return;
    }
    setLoading(true);
    try {
      const slidesCollectionRef = collection(db, `artifacts/${appId}/users/${userId}/slides`);
      const newSlideData = {
        // NEW DATA MODEL: Elements array with default content, adjusted for more space
        elements: [
          { id: `title-${Date.now()}-1`, type: 'title', content: "New Custom Slide", x: '5%', y: '5%', width: '90%', height: 'auto' },
          { id: `text-${Date.now()}-2`, type: 'bullet-points', content: ["• Add your first bullet point here.", "• Add another point."], x: '10%', y: '20%', width: '80%', height: 'auto' },
          { id: `image-${Date.now()}-3`, type: 'image', imagePrompt: "", src: null, x: '5%', y: '45%', width: '90%', height: '45%' } // Set explicit height
        ],
        timestamp: new Date(),
      };
      await addDoc(slidesCollectionRef, newSlideData);
      showCustomModal("New blank slide added! You can now edit its content.", 'info');
      // After adding, set current slide to the new one (which will be the last one)
      // The onSnapshot listener will update 'slides' state, so we just need to set index
      setCurrentSlideIndex(slides.length); // This will point to the newly added slide
    } catch (error) {
      console.error("Error adding new slide:", error);
      showCustomModal(`Failed to add new slide: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };


  // Function to initiate direct editing of a slide
  const handleEditSlide = (slideId) => {
    setEditingSlideId(slideId);
    // When starting edit, copy current slide's elements to temp state
    const slideToEdit = slides.find(s => s.id === slideId);
    if (slideToEdit) {
      // Deep copy elements array and its objects to ensure independent state for editing
      setTempSlideElements(slideToEdit.elements.map(el => ({ ...el })));
    }
  };

  // Handler for changes to elements within the editable SlidePreview
  const handleElementChangeInPreview = (slideId, updatedElements) => {
    // This handler receives the full updated elements array from SlidePreview
    setTempSlideElements(updatedElements);
  };

  // Function to save changes from direct editing to Firestore
  const saveSlideChanges = async () => {
    if (!editingSlideId || !db || !userId) {
      showCustomModal("No slide is currently being edited or Firebase is not ready.", 'error');
      return;
    }
    setLoading(true);
    try {
      await updateDoc(doc(db, `artifacts/${appId}/users/${userId}/slides`, editingSlideId), {
        elements: tempSlideElements, // Save the entire updated elements array
      });
      showCustomModal('Slide updated successfully!', 'info');
      setEditingSlideId(null); // Exit editing mode
      setTempSlideElements([]); // Clear temp changes
    } catch (error) {
      console.error("Error saving slide changes:", error);
      showCustomModal(`Failed to save slide changes: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Function to cancel direct editing
  const cancelSlideEditing = () => {
    setEditingSlideId(null); // Exit editing mode
    setTempSlideElements([]); // Discard temp changes
  };

  // Function to delete a slide from Firestore (remains the same)
  const handleDeleteSlide = (slideId) => {
    showCustomModal("Are you sure you want to delete this slide?", 'confirm', async (confirmed) => {
      if (confirmed) {
        if (db && userId) {
          try {
            await deleteDoc(doc(db, `artifacts/${appId}/users/${userId}/slides`, slideId));
            showCustomModal('Slide deleted successfully!', 'info');
            // If the deleted slide was the current one, adjust currentSlideIndex
            if (slideId === currentSlide?.id) {
              setCurrentSlideIndex(prevIndex => Math.max(0, prevIndex - 1));
            }
          } catch (error) {
            console.error("Error deleting slide:", error);
            showCustomModal(`Error deleting slide: ${error.message}`, 'error');
          }
        }
      }
    });
  };

  // Ensure currentSlide is always valid
  // If in editing mode, use tempSlideElements for the current slide preview
  const currentSlide = slides.length > 0 ?
    (editingSlideId === slides[currentSlideIndex]?.id
      ? { ...slides[currentSlideIndex], elements: tempSlideElements }
      : slides[currentSlideIndex])
    : null;

  return (
    <div className="app">
      {/* Custom Modal Component */}
      {showModal && (
        <CustomModal
          message={modalMessage}
          type={modalType}
          onClose={() => setShowModal(false)}
          onConfirm={modalCallback}
          initialInput={modalInput}
        />
      )}

      {/* Conditional rendering of WelcomePage or main app content */}
      {showWelcomePage ? (
        <WelcomePage onGetStarted={() => setShowWelcomePage(false)} />
      ) : (
        <>
          <img src="/logo.png" alt="AI Logo" className="logo" />
          <h1>AI PPT Generator</h1>

          {/* Mode Selection Buttons */}
          <div className="mode-selection-group">
            <button
              className={`mode-button ${mode === 'auto-generate' ? 'active' : ''}`}
              onClick={() => {
                setMode('auto-generate');
                setEditingSlideId(null); // Exit edit mode when changing modes
                setTempSlideElements([]);
              }}
              disabled={loading || isSpeaking}
            >
              Generate Automatically
            </button>
            <button
              className={`mode-button ${mode === 'customize' ? 'active' : ''}`}
              onClick={() => {
                setMode('customize');
                setEditingSlideId(null); // Exit edit mode when changing modes
                setTempSlideElements([]);
              }}
              disabled={loading || isSpeaking}
            >
              Customize My PPT
            </button>
          </div>

          {/* Conditional Rendering based on mode */}
          {mode === 'auto-generate' && (
            <div className="input-group">
              <input
                type="text"
                placeholder="Enter presentation topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="topic-input"
                disabled={loading || isSpeaking}
              />
              <input
                type="number"
                placeholder="Number of slides (e.g., 5)"
                value={numSlides}
                onChange={(e) => setNumSlides(parseInt(e.target.value))}
                className="num-slides-input"
                min="1"
                max="15"
                disabled={loading || isSpeaking}
              />
              <button onClick={generateSlides} disabled={loading || !topic || !numSlides || isSpeaking}>
                {loading ? 'Generating...' : 'Generate Presentation'}
              </button>
            </div>
          )}

          {mode === 'customize' && (
            <div className="input-group customize-controls">
              <button onClick={addNewSlide} disabled={loading || !isAuthReady || isSpeaking}>
                {loading ? 'Adding...' : 'Add New Slide'}
              </button>
              {editingSlideId && (
                <>
                  <button onClick={saveSlideChanges} disabled={loading || isSpeaking}>
                    Save Changes
                  </button>
                  <button onClick={cancelSlideEditing} disabled={loading || isSpeaking}>
                    Cancel Edit
                  </button>
                </>
              )}
            </div>
          )}

          {/* Template & Voice Selection Dropdowns */}
          <div className="selection-group">
            <div className="template-selection-group">
              <label htmlFor="template-select">Choose a Template:</label>
              <select
                id="template-select"
                className="template-select"
                value={selectedTemplateId}
                onChange={(e) => setSelectedTemplateId(e.target.value)}
                disabled={loading || editingSlideId !== null || isSpeaking}
              >
                {templates && templates.length > 0 ? (
                  templates.map((template) => (
                    <option key={template.id} value={template.id}>
                      {template.name}
                    </option>
                  ))
                ) : (
                  <option value="">Loading templates...</option>
                )}
              </select>
            </div>

            {/* Speak Language Selection */}
            <div className="voice-selection-group">
              <label htmlFor="voice-select">Choose Voice:</label>
              <select
                id="voice-select"
                className="voice-select"
                value={selectedVoice ? selectedVoice.name : ''}
                onChange={(e) => {
                  const voice = availableVoices.find(v => v.name === e.target.value);
                  setSelectedVoice(voice);
                }}
                disabled={availableVoices.length === 0 || isSpeaking}
              >
                {availableVoices.length === 0 ? (
                  <option value="">Loading voices...</option>
                ) : (
                  availableVoices.map((voice) => (
                    <option key={voice.name} value={voice.name}>
                      {voice.name} ({voice.lang})
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>


          {slides.length > 0 && (
            <div className="slides-display-wrapper">
              <div className="slide-navigator-sidebar">
                {slides.map((slide, index) => (
                  <SlideThumbnail
                    key={slide.id}
                    slide={slide}
                    index={index}
                    currentSlideIndex={currentSlideIndex}
                    setCurrentSlideIndex={setCurrentSlideIndex}
                    templateStyles={activeTemplate.styles}
                    templateColors={activeTemplate.colors}
                    onEdit={handleEditSlide}
                    onDelete={handleDeleteSlide}
                    isEditing={editingSlideId === slide.id}
                  />
                ))}
              </div>

              <div className="main-slides-display-area" ref={mainSlidesDisplayAreaRef}>
                {currentSlide && (
                  <SlidePreview
                    slide={currentSlide}
                    templateStyles={activeTemplate.styles}
                    templateColors={activeTemplate.colors}
                    isEditing={editingSlideId === currentSlide.id}
                    onElementChange={handleElementChangeInPreview} // New handler for element changes
                  />
                )}
              </div>
            </div>
          )}

          {slides.length > 0 && (
            <div className="download-buttons-group">
              <button
                onClick={() => setCurrentSlideIndex(prev => Math.max(0, prev - 1))}
                disabled={currentSlideIndex === 0 || editingSlideId !== null || isSpeaking}
              >
                Previous Slide
              </button>
              <button
                onClick={() => setCurrentSlideIndex(prev => Math.min(slides.length - 1, prev + 1))}
                disabled={slides.length === 0 || currentSlideIndex === slides.length - 1 || editingSlideId !== null || isSpeaking}
              >
                Next Slide
              </button>
              <button className="download-button" onClick={downloadPptAsPdf} disabled={loading || slides.length === 0 || editingSlideId !== null || isSpeaking}>
                Download PDF
              </button>
              <button className="download-button export-ppt-button" onClick={exportToPPTX} disabled={loading || slides.length === 0 || editingSlideId !== null || isSpeaking}>
                Export PPT
              </button>
              {/* Copy Slide Button */}
              <button
                className="download-button copy-slide-button"
                onClick={handleCopySlide}
                disabled={loading || slides.length === 0 || isSpeaking}
              >
                Copy Slide Content
              </button>
              {/* PPT Summary Button */}
              <button
                className="download-button summary-button"
                onClick={generatePptSummary}
                disabled={loading || slides.length === 0 || isSpeaking}
              >
                Generate PPT Summary
              </button>
              {/* Speak PPT Button */}
              <button
                className="download-button speak-ppt-button"
                onClick={speakPpt}
                disabled={loading || slides.length === 0}
              >
                {isSpeaking && utteranceRef.current && speechSynthesis.speaking && utteranceRef.current.text.includes('Starting presentation') ? 'Stop Speaking' : 'Speak PPT'}
              </button>
            </div>
          )}

          {/* PPT Summary Display Section */}
          {showSummarySection && pptSummary && (
            <div className="ppt-summary-section">
              <h2>Presentation Summary</h2>
              <p>{pptSummary}</p>
              {/* Speak Summary Button */}
              <button
                className="download-button speak-summary-button"
                onClick={speakSummary}
                disabled={loading || !pptSummary}
              >
                {isSpeaking && utteranceRef.current && speechSynthesis.speaking && utteranceRef.current.text === pptSummary ? 'Stop Speaking' : 'Speak Summary'}
              </button>
              <button onClick={() => setShowSummarySection(false)} className="close-summary-button">
                Close Summary
              </button>
            </div>
          )}

          {loading && <Loader />}
        </>
      )}
    </div>
  );
}

export default App;
