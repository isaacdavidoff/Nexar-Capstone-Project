
// Convert Firestore Timestamp → JS Date safely
const toDate = (timestamp) => {
    if (!timestamp) return null;
    return timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  };
  
  //  Get Overdue Tasks
  export const getOverdueTasks = (tasks) => {
    const now = new Date();
  
    return tasks.filter((task) => {
      const due = toDate(task.dueDate);
      return !task.completed && due && due < now;
    });
  };
  
  // Get Upcoming Tasks (next 7 days)
  export const getUpcomingTasks = (tasks) => {
    const now = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(now.getDate() + 7);
  
    return tasks.filter((task) => {
      const due = toDate(task.dueDate);
      return due && due >= now && due <= nextWeek;
    });
  };
  
  // Sort Tasks by Priority (deadline + urgency)
  export const sortTasksByPriority = (tasks) => {
    return [...tasks].sort((a, b) => {
      const dueA = toDate(a.dueDate);
      const dueB = toDate(b.dueDate);
  
      return dueA - dueB;
    });
  };
  
  //  Get Tasks Due Today
  export const getTodayTasks = (tasks) => {
    const today = new Date().toISOString().split("T")[0];
  
    return tasks.filter((task) => {
      return task.dueDateDay === today;
    });
  };
  
  // Workload Calculation (% of week filled)
  export const calculateWorkload = (tasks) => {
    const WEEK_HOURS = 40; // adjustable
    const totalMinutes = tasks.reduce((sum, task) => {
      return sum + (task.estimatedTime || 0);
    }, 0);
  
    const percent = Math.min((totalMinutes / (WEEK_HOURS * 60)) * 100, 100);
  
    return {
      totalMinutes,
      percent: Math.round(percent),
    };
  };
  
  //  Detect Overload Days
  export const detectOverload = (tasks) => {
    const days = {};
  
    tasks.forEach((task) => {
      const day = task.dueDateDay;
      if (!day) return;
  
      if (!days[day]) days[day] = 0;
      days[day] += task.estimatedTime || 0;
    });
  
    return Object.entries(days)
      .filter(([_, minutes]) => minutes > 300) // > 5 hours
      .map(([day]) => day);
  };
  
  //  Recommend Next Task
  export const getFocusRecommendation = (tasks) => {
    const now = new Date();
  
    const activeTasks = tasks.filter(
      (t) => t.status !== "completed"
    );
  
    if (activeTasks.length === 0) return null;
  
    const scored = activeTasks.map((task) => {
      const due = toDate(task.dueDate);
  
      const daysLeft = due
        ? Math.max((due - now) / (1000 * 60 * 60 * 24), 0)
        : 999;
  
      const urgencyScore = 1 / (daysLeft + 1);
      const effortScore = (task.estimatedTime || 60) / 60;
  
      const score = urgencyScore * 0.7 + effortScore * 0.3;
  
      return { ...task, score };
    });
  
    return scored.sort((a, b) => b.score - a.score)[0];
  };