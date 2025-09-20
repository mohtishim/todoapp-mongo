import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Pencil } from "lucide-react";
import axios from "axios";
import { VercelLink } from "./utlis/VercelLink";

const TodoApp = () => {
  const [task, setTask] = useState("");
  const [todos, setTodos] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  // Fetch all todos on load
  useEffect(() => {
    axios
      .get(`${VercelLink}/todos`)
      .then((res) => setTodos(res.data))
      .catch((err) => console.error(err));
  }, []);

  // Add todo
  const addTask = () => {
    if (task.trim() === "") return;

    axios
      .post(`${VercelLink}/todos`, { todo: task })
      .then((res) => {
        setTodos((prev) => [...prev, res.data]); // ✅ FIXED
        setTask("");
      })
      .catch((err) => console.error(err));
  };

  // Delete todo
  const deleteTask = (id) => {
    axios
      .delete(`${VercelLink}/todos/${id}`)
      .then(() => {
        setTodos((prev) => prev.filter((t) => t._id !== id));
      })
      .catch((err) => console.error(err));
  };

  // Start editing
  const startEditing = (id, text) => {
    setEditingId(id);
    setEditText(text);
  };

  // Save edit
  const saveEdit = (id) => {
    if (editText.trim() === "") return;

    axios
      .put(`${VercelLink}/todos/${id}`, { todo: editText })
      .then(() => {
        setTodos((prev) =>
          prev.map((t) => (t._id === id ? { ...t, todo: editText } : t))
        );
        setEditingId(null);
        setEditText("");
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-6">
      {/* MAIN TODO CARD */}
      <div className="bg-gray-800 rounded-2xl w-full max-w-md p-6 shadow-[0_0_30px_8px_rgba(59,130,246,0.6)]">
        <h1 className="text-2xl font-bold text-white mb-6 text-center select-none">
          📝 My To-Do List
        </h1>

        {/* Input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTask()}
            placeholder="Add a new task..."
            className="flex-1 px-4 py-2 rounded-lg border border-gray-700 
                       bg-gray-700 text-white placeholder-gray-400 
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={addTask}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 
                       text-white font-medium shadow transition"
          >
            <Plus size={18} />
          </button>
        </div>

        {/* List with numbering */}
        <ul className="mt-6 space-y-3 list-decimal list-inside text-white">
          <AnimatePresence>
            {todos.map((todo) => (
              <motion.li
                key={todo._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.2 }}
                className="flex items-center justify-between px-4 py-3 
                           rounded-lg border border-gray-700 
                           bg-gray-700 hover:bg-gray-600"
              >
                {editingId === todo._id ? (
                  <div className="flex items-center gap-2 w-full">
                    <input
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === "Enter" ? saveEdit(todo._id) : null
                      }
                      className="flex-1 px-3 py-2 rounded-lg border border-gray-600 
                                 bg-gray-800 text-white placeholder-gray-400 
                                 focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <button
                      onClick={() => saveEdit(todo._id)}
                      className="px-3 py-2 bg-green-600 hover:bg-green-700 
                                 text-white rounded-lg transition"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <>
                    <span className="flex-1">{todo.todo}</span>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => startEditing(todo._id, todo.todo)}
                        className="text-yellow-400 hover:text-yellow-500 transition"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => deleteTask(todo._id)}
                        className="text-red-400 hover:text-red-600 transition"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </>
                )}
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </div>
    </div>
  );
};

export default TodoApp;
