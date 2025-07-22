import React from 'react';
import supabase from '../lib/supabase'

interface Task {
  id: number
  task_text: string
  is_completed: boolean
}

interface TaskListProps {
  tasks: Task[]
  fetchTasks: () => void
}

const TaskList = React.memo(function TaskList({ tasks, fetchTasks }: TaskListProps) {
  const toggleCompletion = async (taskId: number, currentStatus: boolean) => {
    const { error } = await supabase
      .from('tasks')
      .update({ is_completed: !currentStatus })
      .eq('id', taskId);
    if (error) {
      console.error('Грешка при update:', error.message);
    }
    fetchTasks();
  }

  const handleDelete = async (taskId: number) => {
    console.log('Изтривам задача с id:', taskId);
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId);
    if (error) {
      console.error('Грешка при изтриване:', error.message);
    }
    fetchTasks();
  }

  return (
    <div className="p-4">
      <ul>
        {tasks.map((task) => (
          <li key={task.id} className="flex justify-between items-center mb-2">
            <span
              className={`text-xl ${task.is_completed ? 'line-through' : ''}`}
            >
              {task.task_text}
            </span>
            <div>
              <button
                type="button"
                onClick={() => toggleCompletion(task.id, task.is_completed)}
                className="p-1 bg-yellow-500 text-white"
              >
                {task.is_completed ? 'Undo' : 'Complete'}
              </button>
              <button
                type="button"
                onClick={() => handleDelete(task.id)}
                className="p-1 bg-red-500 text-white ml-2"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
});

export default TaskList; 