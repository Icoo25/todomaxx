import { useState } from 'react'
import supabase from '../lib/supabase'

interface AddTaskProps {
  fetchTasks: () => void
}

export default function AddTask({ fetchTasks }: AddTaskProps) {
  const [taskText, setTaskText] = useState('')

  const handleAddTask = async () => {
    if (taskText.trim()) {
      await supabase
        .from('tasks')
        .insert([{ task_text: taskText }])
      fetchTasks()
      setTaskText('')
    }
  }

  return (
    <div className="p-4">
      <input
        type="text"
        placeholder="New Task"
        value={taskText}
        onChange={(e) => setTaskText(e.target.value)}
        className="p-2 mb-2 border"
      />
      <button type="button" onClick={handleAddTask} className="p-2 bg-blue-500 text-white">
        Add Task
      </button>
    </div>
  )
} 