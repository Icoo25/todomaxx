"use client";

import { useEffect, useState } from "react";
import { User } from '@supabase/supabase-js';
import Auth from "../components/Auth";
import AddTask from "../components/AddTask";
import TaskList from "../components/TaskList";
import supabase from "../lib/supabase";

interface Task {
  id: number;
  task_text: string;
  is_completed: boolean;
}

const TASKS_PER_PAGE = 10;

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const fetchTasks = async (pageNum = page) => {
    setLoading(true);
    const from = (pageNum - 1) * TASKS_PER_PAGE;
    const to = from + TASKS_PER_PAGE - 1;
    const { data, error } = await supabase.from("tasks").select("*").range(from, to).order('id', { ascending: false });
    if (error) {
      console.error('Грешка при fetch:', error.message);
    }
    setTasks(data || []);
    setLoading(false);
    setInitialLoad(false);
    setHasMore((data?.length || 0) === TASKS_PER_PAGE);
  };

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) setUser(data.session.user);
    };
    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      if (session?.user) fetchTasks(1);
    });

    if (user && initialLoad) fetchTasks(1);

    return () => {
      listener?.subscription.unsubscribe();
    };
    // eslint-disable-next-line
  }, [user]);

  useEffect(() => {
    if (user && !initialLoad) fetchTasks(page);
    // eslint-disable-next-line
  }, [page]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setTasks([]);
    setInitialLoad(true);
    setPage(1);
  };

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (hasMore) setPage(page + 1);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      {!user ? (
        <Auth setUser={setUser} />
      ) : (
        <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center relative">
          <h1 className="text-3xl font-bold mb-6 text-blue-600 tracking-wide">TodoMax</h1>
          <button
            type="button"
            onClick={handleLogout}
            className="absolute top-6 right-6 p-2 bg-gray-200 hover:bg-gray-300 rounded text-gray-800"
          >
            Изход
          </button>
          <AddTask fetchTasks={() => fetchTasks(page)} />
          {(loading && initialLoad) ? (
            <div className="text-center p-4">Зареждане...</div>
          ) : (
            <>
              <TaskList tasks={tasks} fetchTasks={() => fetchTasks(page)} />
              <div className="flex justify-center gap-4 mt-4">
                <button
                  type="button"
                  onClick={handlePrevPage}
                  disabled={page === 1}
                  className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                >
                  Предишна
                </button>
                <span>Страница {page}</span>
                <button
                  type="button"
                  onClick={handleNextPage}
                  disabled={!hasMore}
                  className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                >
                  Следваща
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
