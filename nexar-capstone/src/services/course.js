// services/course.js
import { deleteCourse } from "@/lib/courses";
import { deleteTasksByCourse } from "@/lib/task";

export const removeCourseCompletely = async (courseId) => {
  try {

    await deleteTasksByCourse(courseId);
  
    await deleteCourse(courseId);
    
    return { success: true };
  } catch (error) {
    console.error("Failed to fully delete course and tasks:", error);
    return { success: false, error };
  }
};