import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebaseConfig';
import AuthForm from './components/AuthForm';
import PlannerForm from './components/PlannerForm';
import ChatBot from './components/ChatBot';
import ProgressTracker from './components/ProgressTracker';
import { getAuth, signOut } from 'firebase/auth';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    const querySnapshot = await getDocs(collection(db, "studyPlans"));
    const tasksData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setTasks(tasksData);
  };

  const handleAuthSuccess = (email) => {
    setIsAuthenticated(true);
    setUserEmail(email);
    fetchTasks();
  };

  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth).then(() => {
      setIsAuthenticated(false);
      setUserEmail('');
    }).catch(() => {
      alert("Logout Failed");
    });
  };

  useEffect(() => {
    if (isAuthenticated) fetchTasks();
  }, [isAuthenticated]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <div className="bg-indigo-700 text-white p-4 flex flex-wrap justify-between items-center">
        <h1 className="text-3xl font-bold">StudyPal</h1>
        {isAuthenticated && (
          <div className="flex items-center space-x-4 mt-2 md:mt-0">
            <span>Logged in as: {userEmail}</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded-lg"
            >
              Logout
            </button>
          </div>
        )}
      </div>

      {!isAuthenticated ? (
        <div className="flex-grow flex items-center justify-center">
          <AuthForm onAuthSuccess={handleAuthSuccess} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 p-4 md:p-6 flex-grow overflow-y-auto">

          {/* Left Column */}
          <div className="flex flex-col space-y-4 overflow-visible md:h-[calc(100vh-120px)]">
            <div className="bg-white p-4 rounded-2xl shadow h-auto">
              <PlannerForm onPlanSaved={fetchTasks} />
            </div>
          </div>

          {/* Middle Column - Progress Tracker */}
          <div className="flex flex-col md:h-[calc(100vh-120px)]">
            <div className="flex-grow rounded-2xl overflow-y-auto" style={{ maxHeight: '500px' }}>
              <ProgressTracker tasks={tasks} refreshTasks={fetchTasks} />
            </div>
          </div>

          {/* Right Column - ChatBot */}
          <div className="flex flex-col md:h-[calc(100vh-120px)]">
            <div className="flex-grow overflow-y-auto" style={{ maxHeight: '500px' }}>
              <ChatBot />
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
