import { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../firebaseConfig';



const PlannerForm = ({ onPlanSaved }) => {
  const [subject, setSubject] = useState('');
  const [topics, setTopics] = useState('');
  const [deadline, setDeadline] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "studyPlans"), { subject, topics, deadline, progress: 0 });
      alert("Plan saved successfully!");
      setSubject('');
      setTopics('');
      setDeadline('');
      if (onPlanSaved) onPlanSaved();
    } catch (error) {
      alert("Error saving plan: " + error.message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl shadow-md p-6 w-full flex flex-col space-y-4 h-full"
    >
      <h2 className="text-xl font-bold text-center text-blue-600">Create Study Plan</h2>

      <input
        className="w-full border p-2 rounded"
        placeholder="Subject"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
      />

      <input
        className="w-full border p-2 rounded"
        placeholder="Topics (comma separated)"
        value={topics}
        onChange={(e) => setTopics(e.target.value)}
      />

      <input
        type="date"
        className="w-full border p-2 rounded"
        value={deadline}
        onChange={(e) => setDeadline(e.target.value)}
      />

      <button
        type="submit"
        className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded mt-auto"
      >
        Save Plan
      </button>
    </form>
  );
};

export default PlannerForm;
