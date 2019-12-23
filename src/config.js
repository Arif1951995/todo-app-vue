import firebase from "firebase";
var firebaseConfig = {
  apiKey: "AIzaSyCgY_dxmsMW4JbQ2JW8T4Y5V2EcwcEG1OM",
  authDomain: "todo-app-vue-e26e7.firebaseapp.com",
  databaseURL: "https://todo-app-vue-e26e7.firebaseio.com",
  projectId: "todo-app-vue-e26e7",
  storageBucket: "todo-app-vue-e26e7.appspot.com",
  messagingSenderId: "717708945558",
  appId: "1:717708945558:web:ad0dca31e773eada833ab7"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
export const db = firebase.firestore();
