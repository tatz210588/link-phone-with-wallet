import { initializeApp } from 'firebase/app'
// import 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyCgy4iqSdipAokM8Q3ELjSSfHJ0sA4_wFc',
  authDomain: 'phone-login-65bf1.firebaseapp.com',
  projectId: 'phone-login-65bf1',
  storageBucket: 'phone-login-65bf1.appspot.com',
  messagingSenderId: '1025676520962',
  appId: '1:1025676520962:web:a953259235cee1d228011b',
}

// Initialize Firebase
const getFirebaseApp = async () => initializeApp(firebaseConfig)

export default getFirebaseApp
