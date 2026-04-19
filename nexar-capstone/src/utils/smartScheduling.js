export function prioritizeTasks(tasks) {
  const now = new Date();

  return [...tasks].sort((a, b) => {
    const aTime = new Date(a.dueDate).getTime() - now.getTime();
    const bTime = new Date(b.dueDate).getTime() - now.getTime();
    return aTime - bTime;
  });
}

export function detectWorkloadClustering(tasks) {
  const groupedByDate = {};

  tasks.forEach((task) => {
    const date = task.dueDate;

    if (!groupedByDate[date]) {
      groupedByDate[date] = {
        date,
        taskCount: 0,
        totalHours: 0,
        tasks: [],
      };
    }

    groupedByDate[date].taskCount += 1;
    groupedByDate[date].totalHours += task.estimatedHours || 1;
    groupedByDate[date].tasks.push(task.title);
  });

  return Object.values(groupedByDate).map((day) => ({
    ...day,
    isClustered: day.taskCount >= 2 || day.totalHours >= 4,
  }));
}

export function suggestStudyBlocks(tasks) {
  const studyBlocks = [];

  tasks.forEach((task) => {
    const totalHours = task.estimatedHours || 1;
    const dueDate = new Date(task.dueDate);

    const numberOfBlocks = Math.min(3, Math.max(1, totalHours));
    const hoursPerBlock = totalHours / numberOfBlocks;

    for (let i = numberOfBlocks; i > 0; i--) {
      const blockDate = new Date(dueDate);
      blockDate.setDate(dueDate.getDate() - i);

      studyBlocks.push({
        taskId: task.id,
        taskTitle: task.title,
        date: blockDate.toISOString().split("T")[0],
        duration: Number(hoursPerBlock.toFixed(1)),
      });
    }
  });

  return studyBlocks.sort((a, b) => new Date(a.date) - new Date(b.date));
}

export function generateWeeklyWorkload(tasks) {
  const workloadMap = {};

  tasks.forEach((task) => {
    const date = task.dueDate;

    if (!workloadMap[date]) {
      workloadMap[date] = 0;
    }

    workloadMap[date] += task.estimatedHours || 1;
  });

  return Object.entries(workloadMap)
    .map(([date, hours]) => ({
      date,
      hours,
    }))
    .sort((a, b) => new Date(a.date) - new Date(b.date));
}