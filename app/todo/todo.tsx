"use client";


import { useState, useEffect, ChangeEvent, KeyboardEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

interface Task {
  id: number;
  text: string;
  completed: boolean;
}

export default function TodoList() {
  // State Management for tasks
  const [task, settask] = useState<Task[]>([]);
  const [Newtask, setNewtask] = useState("");
  const [editingTaskId, seteditingTaskId] = useState<number | null>(null);
  const [editedTaskText, seteditedTaskText] = useState<string>("");
  const [isMounted, setisMounted] = useState<boolean>(false);

  useEffect(() => {
    setisMounted(true);
    const savedTask = localStorage.getItem("task");
    if (savedTask) {
      settask(JSON.parse(savedTask) as Task[]);
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("task", JSON.stringify(task));
    }
  }, [task, isMounted]);

  const addTask = (): void => {
    if (Newtask.trim() !== "") {
      settask([...task, { id: Date.now(), text: Newtask, completed: false }]);
      setNewtask(""); // Clear the input field after adding task
    }
  };

  const toggleTaskCompletion = (id: number): void => {
    settask(
      task.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const startEditingTask = (id: number, text: string): void => {
    seteditingTaskId(id);
    seteditedTaskText(text);
  };

  const updateTask = (): void => {
    if (editedTaskText.trim() !== "") {
      settask(
        task.map((task) =>
          task.id === editingTaskId ? { ...task, text: editedTaskText } : task
        )
      );
      seteditingTaskId(null);
      seteditedTaskText("");
    }
  };

  const deleteTask = (id: number): void => {
    settask(task.filter((task) => task.id !== id));
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 h-screen ">
      <div className="w-full max-w-lg bg-gradient-to-r from-green-400 via-teal-500 to-blue-500 shadow-2xl border-stone-300 rounded-lg p-6">
        <h1 className="text-3xl font-semibold mb-6 text-gray-800 dark:text-gray-200 text-center">
          Todo List
        </h1>

        {/* Task input field */}
        <div className="flex items-center mb-6">
          <Input
            type="text"
            placeholder="Add a new task"
            value={Newtask}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setNewtask(e.target.value)
            }
            className="flex-1 mr-3 px-4 py-2 border rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
          />
          <Button
            onClick={addTask}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg"
          >
            Add
          </Button>
        </div>

        {/* Task List */}
        <div className="space-y-4">
          {task.map((taskItem) => (
            <div
              key={taskItem.id}
              className="flex justify-between items-center p-4 bg-gradient-to-r from-sky-200 to-pink-200 rounded-lg shadow-md"
            >
              <div className="flex items-center w-full">
                <Checkbox
                  checked={taskItem.completed}
                  className="mr-4"
                  onCheckedChange={() => toggleTaskCompletion(taskItem.id)}
                />
                {editingTaskId === taskItem.id ? (
                  <Input
                    type="text"
                    value={editedTaskText}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      seteditedTaskText(e.target.value)
                    }
                    onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
                      if (e.key === "Enter") {
                        updateTask();
                      }
                    }}
                    className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
                  />
                ) : (
                  <span
                    className={`flex-1 text-gray-800 dark:text-gray-200 ${
                      taskItem.completed
                        ? "line-through text-gray-500 dark:text-gray-400"
                        : ""
                    }`}
                  >
                    {taskItem.text}
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2">
                {editingTaskId === taskItem.id ? (
                  <Button
                    onClick={updateTask}
                    className="bg-green-500 hover:bg-green-600 text-white font-medium py-1 px-3 rounded-md"
                  >
                    Save
                  </Button>
                ) : (
                  <Button
                    onClick={() => startEditingTask(taskItem.id, taskItem.text)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-1 px-3 rounded-md"
                  >
                    Edit
                  </Button>
                )}
                <Button
                  onClick={() => deleteTask(taskItem.id)}
                  className="bg-red-500 hover:bg-red-600 text-white font-medium py-1 px-3 rounded-md"
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
          {task.length === 0 && (
            <p className="text-center text-gray-500 dark:text-gray-400">
              No tasks available.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
