import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

const STORAGE_KEY = '@hac_ibadeti_progress';

type ProgressData = {
  completedTasks: number[]; // 1-8 arası ana görev numaraları
};

type Ctx = {
  completedTasks: number[];
  toggleTask: (taskIndex: number) => void;
  isTaskComplete: (taskIndex: number) => boolean;
  completedCount: number;
};

const ProgressContext = createContext<Ctx | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [completedTasks, setCompletedTasks] = useState<number[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (!raw) return;
        const data: ProgressData = JSON.parse(raw);
        setCompletedTasks(data.completedTasks ?? []);
      })
      .catch(() => {});
  }, []);

  const persist = useCallback((tasks: number[]) => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ completedTasks: tasks })).catch(() => {});
  }, []);

  const toggleTask = useCallback((taskIndex: number) => {
    setCompletedTasks((prev) => {
      const next = prev.includes(taskIndex)
        ? prev.filter((t) => t !== taskIndex)
        : [...prev, taskIndex];
      persist(next);
      return next;
    });
  }, [persist]);

  const isTaskComplete = useCallback(
    (taskIndex: number) => completedTasks.includes(taskIndex),
    [completedTasks],
  );

  const completedCount = completedTasks.length;

  const value = useMemo(
    () => ({ completedTasks, toggleTask, isTaskComplete, completedCount }),
    [completedTasks, toggleTask, isTaskComplete, completedCount],
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress() {
  const v = useContext(ProgressContext);
  if (!v) throw new Error('useProgress must be used within ProgressProvider');
  return v;
}
