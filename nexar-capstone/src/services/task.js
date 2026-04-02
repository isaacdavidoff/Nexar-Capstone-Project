const cloneDate = (date) => new Date(date.getTime());

export const getOverdueTasks = (tasks, now = new Date()) => {
  return tasks.filter((task) => {
    const due = toDate(task.dueDate);
    return isActive(task) && due && due < now;
  });
};
  
  export const getUpcomingTasks = (tasks, now = new Date()) => {
    
    const nextWeek = cloneDate(now);
    nextWeek.setDate(now.getDate() + 7);
  
    return tasks
    .filter((task) => {
      const due = toDate(task.dueDate);
      return (
        task.status !== "completed" &&
        due &&
        due >= now &&
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

        if (!due) return { ...task, score: -1 };
  
      const urgencyScore = 1 / (daysLeft + 1);
      const effortScore = (task.estimatedTime || 60) / 60;
  
      const score = urgencyScore * 0.7 + effortScore * 0.3;
  
      return { ...task, score };
    });
  
    return scored.sort((a, b) => b.score - a.score)[0];
  };


export const toDate = (value) => {
  if (!value) return null;
 
  if (value.toDate) return value.toDate(); 

  if (value.seconds) return new Date(value.seconds * 1000);
  
  const d = new Date(value);
  return isNaN(d.getTime()) ? null : d;
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