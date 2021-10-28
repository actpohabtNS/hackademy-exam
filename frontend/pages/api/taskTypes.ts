export type task_T = {
  name: string,
  createdAt: Date,
  id: number,
  description: string,
}

export type listHead_T = {
  name: string,
  id: number,
}

export type list_T = {
  name: string,
  id: number,
  tasks: Array<task_T>,
  completed: Array<task_T>,
}
