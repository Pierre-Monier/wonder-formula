// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFunctions } from "firebase/functions";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const GA_ENDPOINT = "https://www.google-analytics.com/mp/collect";
const API_SECRET = "9JUHg9eSRaussIangn95dA";
const MEASUREMENT_ID = "G-4L84PHQE9Y";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB3WEu8_HXbI2Xx76JdPnFwFNEv7uxMkNc",
  authDomain: "wonder-formula.firebaseapp.com",
  projectId: "wonder-formula",
  storageBucket: "wonder-formula.appspot.com",
  messagingSenderId: "623944834472",
  appId: "1:623944834472:web:43be43c5593d993e22919d",
  measurementId: MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const functions = getFunctions(app);

export const getOrCreateClientId = () => {
  let clientId = localStorage.getItem("clientId");
  if (!clientId) {
    // Generate a unique client ID, the actual value is not relevant
    clientId = self.crypto.randomUUID();
    localStorage.setItem("clientId", clientId);
  }
  return clientId;
};

export const reportEvent = async (
  eventName: string,
  eventParams?: Record<string, unknown>,
) => {
  await fetch(
    `${GA_ENDPOINT}?measurement_id=${MEASUREMENT_ID}&api_secret=${API_SECRET}`,
    {
      method: "POST",
      body: JSON.stringify({
        client_id: getOrCreateClientId(),
        events: [
          {
            name: eventName,
            params: eventParams,
          },
        ],
      }),
    },
  );
};

export const analytics = getAnalytics(app);
