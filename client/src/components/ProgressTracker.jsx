import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useMemo, useState } from 'react';
import { Trash2 } from 'lucide-react';

const ProgressTracker = ({ tasks, refreshTasks }) => {
  const [filter, setFilter] = useState('all');

  const handleMarkDone = async (taskId, isDone) => {
    const taskRef = doc(db, "studyPlans", taskId);
    await updateDoc(taskRef, { progress: isDone ? 100 : 0 });
    refreshTasks();
  };

  const handleDelete = async (taskId) => {
    if (window.confirm("Delete this task?")) {
      await deleteDoc(doc(db, "studyPlans", taskId));
      refreshTasks();
    }
  };

  const filteredTasks = useMemo(() => {
    if (filter === 'pending') return tasks.filter(task => task.progress < 100);
    if (filter === 'completed') return tasks.filter(task => task.progress === 100);
    return tasks;
  }, [tasks, filter]);

  const overallProgress = useMemo(() => {
    if (tasks.length === 0) return 0;
    const total = tasks.reduce((acc, task) => acc + (task.progress || 0), 0);
    return Math.round(total / tasks.length);
  }, [tasks]);

  return (
    <div className="bg-white rounded-xl shadow-md h-full flex flex-col">
      <h2 className="text-xl font-bold text-center text-purple-600 py-4">Progress Tracker</h2>

      {/* Overall Progress Bar */}
      <div className="px-6">
        <div className="w-full bg-gray-200 rounded h-4 mb-2">
          <div className="bg-green-500 h-4 rounded" style={{ width: `${overallProgress}%` }}></div>
        </div>
        <p className="text-center font-semibold mb-4">Overall Progress: {overallProgress}%</p>
      </div>

      {/* Filter Buttons */}
      <div className="flex justify-center space-x-2 mb-4">
        {['all', 'pending', 'completed'].map(status => (
          <button
            key={status}
            className={`px-3 py-1 rounded ${filter === status ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setFilter(status)}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Tasks List Scrollable */}
      <div className="flex-grow overflow-y-auto px-4 space-y-4 pb-4">
        {filteredTasks.length === 0 ? (
          <p className="text-center text-gray-500">No tasks to show.</p>
        ) : (
          filteredTasks.map(task => (
            <div key={task.id} className="flex items-center justify-between p-3 bg-gray-100 rounded-lg shadow-sm">
              <div>
                <h3 className="font-semibold">{task.subject}</h3>
                <p className="text-sm text-gray-600">Topics: {task.topics}</p>
                <p className="text-sm text-gray-600">Deadline: {task.deadline}</p>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={task.progress === 100}
                  onChange={(e) => handleMarkDone(task.id, e.target.checked)}
                  className="w-5 h-5"
                />
                <button onClick={() => handleDelete(task.id)}>
                  <Trash2 className="text-red-500 hover:text-red-700 w-5 h-5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProgressTracker;
