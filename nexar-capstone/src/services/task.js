import { Timestamp } from "firebase/firestore";

const cloneDate = (date) => new Date(date.getTime());

export const toDate = (value) => {
  if (!value) return null;
  if (value.toDate) return value.toDate(); 
  if (value.seconds) return new Date(value.seconds * 1000);
  const d = new Date(value);
  return isNaN(d.getTime()) ? null : d;
};

export const getOverdueTasks = (tasks, now = new Date()) => {
  return tasks.filter((task) => {
    const due = toDate(task.dueDate);
    return isActive(task) && due && due < now;
  });
};
  
export const getUpcomingTasks = (tasks, now = new Date()) => {
  // Set to start of day (00:00:00) to ensure "Today" stays in "Upcoming"
  const startOfToday = cloneDate(now);
  startOfToday.setHours(0, 0, 0, 0);

  const nextWeek = cloneDate(startOfToday);
  nextWeek.setDate(startOfToday.getDate() + 7);

  return tasks
  .filter((task) => {
    const due = toDate(task.dueDate);
    return (
      task.status !== "completed" &&
      due &&
      due >= startOfToday && // Better for UX
      due <= nextWeek
    );
  })
  .sort((a, b) => toDate(a.dueDate) - toDate(b.dueDate));
};
  
  export const getTodayTasks = (tasks) => {
    const todayKey = new Date().toDateString();
  
    return tasks.filter((task) => {
      const due = toDate(task.dueDate);
      return isActive(task) && due?.toDateString() === todayKey;
    });
  };
  
  export const calculateWorkload = (tasks) => {
    const WEEK_HOURS = 40;
    const now = new Date();
    const todayKey = now.toDateString();
    
    const endOfWeek = cloneDate(now);
    endOfWeek.setDate(now.getDate() + 7);
  
    let dueToday = 0;
    let dueThisWeek = 0;
    let upcoming = 0;
  
    const totalMinutes = tasks.reduce((sum, task) => {
      if (task.status === "completed") return sum;
      
      const due = toDate(task.dueDate);
      if (!due) return sum;
  
      // Check ranges
      if (due.toDateString() === todayKey) {
        dueToday++;
      }
      
      if (due >= now && due <= endOfWeek) {
        dueThisWeek++;
      } else if (due > endOfWeek) {
        upcoming++;
      }
  
      return sum + (Number(task.estimatedTime) || 0);
    }, 0);
  
    const percent = Math.min((totalMinutes / (WEEK_HOURS * 60)) * 100, 100);
  
    return {
      totalMinutes,
      percent: Math.round(percent),
      dueToday,
      dueThisWeek,
      upcoming,
    };
  };
 
  const isActive = (task) => task.status !== "completed";

  export const detectOverload = (tasks, dailyLimitMinutes = 300) => {
    const days = {};
  
    tasks.filter(isActive).forEach((task) => {
      const due = toDate(task.dueDate);
      if (!due) return;
  
      const dateKey = due.toDateString(); 
      days[dateKey] = (days[dateKey] || 0) + (Number(task.estimatedTime) || 0);
    });
  
    return Object.entries(days)
      .filter(([_, minutes]) => minutes > dailyLimitMinutes)
      .map(([day]) => day);
  };


export const sortTasksByPriority = (tasks) => {
  const priorityWeight = {
    high: 3,
    medium: 2,
    low: 1,
  };
  
  return [...tasks].sort((a, b) => {

    const weightA = priorityWeight[a.priority] || 0;
    const weightB = priorityWeight[b.priority] || 0;
    if (weightB !== weightA) return weightB - weightA;

  
    const dueA = toDate(a.dueDate)?.getTime() || Infinity;
    const dueB = toDate(b.dueDate)?.getTime() || Infinity;
    return dueA - dueB;
  });
};
  
export const getFocusRecommendation = (tasks) => {
  const now = new Date(); // Use JS Date for math

  const activeTasks = tasks.filter(isActive);
  if (activeTasks.length === 0) return null;

  const scored = activeTasks.map((task) => {
    const due = toDate(task.dueDate);
    if (!due) return { ...task, score: -1 };

    // Calculate days left using consistent units (milliseconds)
    const diffInMs = due.getTime() - now.getTime();
    const daysLeft = Math.max(diffInMs / (1000 * 60 * 60 * 24), 0);

    const urgencyScore = 1 / (daysLeft + 0.1); // Small offset to avoid infinity
    const effortScore = (Number(task.estimatedTime) || 60) / 60;

    // Weight: 70% Urgency, 30% Effort
    const score = urgencyScore * 0.7 + effortScore * 0.3;

    return { ...task, score };
  });

  return scored.sort((a, b) => b.score - a.score)[0];
};



export const groupTasksByDate = (tasks) => {
  const map = {};
  
  tasks.forEach((task) => {
    if (!isActive(task)) return;

    const due = toDate(task.dueDate);
    if (!due) return;

    const key = due.toDateString();
    if (!map[key]) map[key] = [];
    map[key].push(task);
  });
  
  return map;
};

/**
 * Client-side helper to calculate priority score
 * @param {Array} tasks 
 */
export const sortTasksBySmartPriority = (tasks) => {
  const now = new Date().getTime();
  
  return [...tasks].sort((a, b) => {
    const dateA = toDate(a.dueDate);
    const dateB = toDate(b.dueDate);
    if (!dateA || !dateB) return 0;

    const timeDiffA = Math.max(dateA.getTime() - now, 3600000); // Floor at 1 hour
    const timeDiffB = Math.max(dateB.getTime() - now, 3600000);

    const scoreA = (priorityToWeight(a.priority)) / (timeDiffA / 3600000);
    const scoreB = (priorityToWeight(b.priority)) / (timeDiffB / 3600000);

    return scoreB - scoreA;
  });
};

// Helper for weights
const priorityToWeight = (p) => ({ high: 3, medium: 2, low: 1 }[p] || 1);

