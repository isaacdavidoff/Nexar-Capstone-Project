# Database Schema Documentation

## Project: Student Deadline & Workload Management Platform

**Stack:** Next.js (JavaScript) + Firebase Firestore

---

## Overview

This document defines the database schema for the application using Firebase Firestore.

The schema is derived from a relational ERD but adapted using denormalization to optimize performance, simplify queries, and eliminate the need for joins.

---

## Design Principles

* **Denormalization:** Reduce joins by embedding commonly used fields
* **User-scoped data:** All records are tied to `userId`
* **Query-first design:** Optimized for dashboard queries
* **Scalability:** Subcollections used for one-to-many relationships

---

## Collections Overview

users
courses
tasks
reminders (subcollection)

---

## users

Stores authenticated user information.

```json
{
  "userId": "string (Firebase Auth UID)",
  "name": "string",
  "email": "string",
  "createdAt": "timestamp"
}
```

### Notes 1

* `userId` matches Firebase Authentication UID
* Each user owns their own courses and tasks

---

## courses

Stores courses created by a user.

```json
{
  "courseId": "string",
  "userId": "string (ref > users.userId)",
  "courseName": "string",
  "term": "string",
  "createdAt": "timestamp"
}
```

### Notes 2

* A user can have multiple courses
* Used to group tasks

---

## tasks

Core collection storing all academic deadlines.

```json
{
  "taskId": "string",
  "userId": "string (ref > users.userId)",
  "courseId": "string (ref > courses.courseId)",

  "title": "string",
  "type": "string (assignment | lab | quiz | exam | project)",
  "status": "string (pending | in_progress | completed | overdue)",

  "dueDate": "timestamp",
  "priority": "string (low | medium | high)",

  "notes": "string",

  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

## Subcollection: tasks/{taskId}/reminders

Stores reminder notifications for each task.

```json
{
  "reminderId": "string",
  "reminderTime": "timestamp",
  "sent": "boolean",
  "createdAt": "timestamp"
}
```

## Notes 3

* Each task can have multiple reminders
* Used for notification scheduling
* `sent` prevents duplicate notifications

---

## Relationships (Logical)

Although Firestore is NoSQL, relationships are maintained via IDs:

* A **user** has many **courses**
* A **user** has many **tasks**
* A **course** has many **tasks**
* A **task** has many **reminders**

---

## Security Considerations

* All data is scoped by `userId`
* Firestore security rules must ensure:

  * Users can only read/write their own data
* Never trust client-side input without validation

---

## Design Decisions

* Task types and status values are stored as strings instead of lookup tables
* Reminders are stored as a subcollection
* Separate collections (users, courses, tasks)

---

## Summary

This schema is optimized to:

* Centralize academic deadlines
* Enable fast dashboard queries
* Support reminder notifications
* Scale with increasing user data
