import { list_T, task_T } from '../pages/api/taskTypes'

export type currListState_T = {
  list: list_T | null,
}

type currListAction_T = 
  | { type: "set", list: list_T }
  | { type: "remove" }
  | { type: "add_task", newTask: task_T }
  | { type: "remove_task", taskId: number }
  | { type: "update_task", updatedTask: task_T }
  | { type: "mark_completed", taskId: number }
  | { type: "mark_incompleted", taskId: number }


export const currListInitState = {
  list: null
};

export const currListReducer = (state: currListState_T, action : currListAction_T) : currListState_T => {
  const assertNotEmpty = (obj : Object | null) => {
    if (obj === null) {
      throw new Error("Can't add task to Null Curr List")!
    }
  }

  switch(action.type) {
    case 'set':
      return { list: { ...action.list } };

    case 'remove':
      return { list: null };

    case 'add_task': {
      assertNotEmpty(state.list);

      let newState = { list: { ...state.list! } }; // spreading list fields separately to avoid shallow copying of list object
      newState.list!.tasks = [ ...newState.list!.tasks, action.newTask ];
      
      return newState;
    }

    case 'remove_task': {
      assertNotEmpty(state.list);

      let newState = { list: { ...state.list! } };
      newState.list!.tasks = [ ...newState.list!.tasks.filter(task => task.id !== action.taskId) ];
      newState.list!.completed = [ ...newState.list!.completed.filter(task => task.id !== action.taskId) ];
      
      return newState;
    }

    case 'update_task': {
      assertNotEmpty(state.list);

      let newState = { list: { ...state.list! } };

      if (~newState.list!.tasks.findIndex(task => task.id === action.updatedTask.id)) {
        newState.list!.tasks = [ ...newState.list!.tasks.map(task => task.id === action.updatedTask.id ? action.updatedTask : task) ];
      } else {
        newState.list!.completed = [ ...newState.list!.completed.map(task => task.id === action.updatedTask.id ? action.updatedTask : task) ];
      }

      return newState;
    }

    case 'mark_completed': {   
      assertNotEmpty(state.list);

      let newState = { list: { ...state.list! } };
      const task = newState.list?.tasks.find(task => task.id === action.taskId);

      if (task === undefined) {
        throw new Error(`Can't find task with id ${action.taskId} in tasks`)
      }

      newState.list!.tasks = newState.list?.tasks.filter(task => task.id !== action.taskId);
      newState.list!.completed = [ ...newState.list!.completed, task ];
      return newState;
    }

    case 'mark_incompleted': {
      assertNotEmpty(state.list);

      let newState = { list: { ...state.list! } };
      const task = newState.list?.completed.find(task => task.id === action.taskId);

      if (task === undefined) {
        throw new Error(`Can't find task with id ${action.taskId} in completed`)
      }

      newState.list!.completed = newState.list?.completed.filter(task => task.id !== action.taskId);
      newState.list!.tasks = [ ...newState.list!.tasks, task ];
      return newState;
    }

    default:
      console.log(action);
      throw new Error('Unknown action type.');
  }
}
