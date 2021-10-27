export type task_T = {
  name: string,
  createdAt: Date,
  description: string,
}

export type listHead_T = {
  name: string,
  id: number,
}

export type list_T = {
  name: string,
  id: Number,
  tasks: Array<task_T>,
  completed: Array<task_T>,
}
