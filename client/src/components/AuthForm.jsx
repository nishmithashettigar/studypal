import { useState } from 'react';
import { auth } from '../firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';

const AuthForm = ({ onAuthSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      alert('Registration successful!');
      onAuthSuccess(user.email);  // Pass email to App.js
    } catch (error) {
      alert('Registration failed: ' + error.message);
    }
  };

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      alert('Login successful!');
      onAuthSuccess(user.email);  // Pass email to App.js
    } catch (error) {
      alert('Login failed: ' + error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.reload();  // Simple reload to reset state
    } catch (error) {
      alert('Logout failed: ' + error.message);
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow-md mb-6">
      <h2 className="text-2xl font-semibold text-center text-purple-700 mb-4">Login / Register</h2>
      <input 
        type="email" 
        placeholder="Email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
        className="border p-2 mb-2 w-full rounded" 
      />
      <input 
        type="password" 
        placeholder="Password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
        className="border p-2 mb-2 w-full rounded" 
      />
      <div className="flex justify-between">
        <button onClick={handleLogin} className="bg-green-500 text-white px-4 py-2 rounded">Login</button>
        <button onClick={handleRegister} className="bg-blue-500 text-white px-4 py-2 rounded">Register</button>
        <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded">Logout</button>
      </div>
    </div>
  );
};

export default AuthForm;
