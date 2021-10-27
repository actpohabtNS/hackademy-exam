import { listHead_T, list_T, task_T } from '../pages/api/taskTypes'

export type currListState_T = {
  list: list_T | null,
}

type currListAction_T = 
  | { type: "set", listId: number }
  | { type: "remove" }


export const currListInitState = {
  list: null
};

const lists : list_T[] = [
  {
    name: "Test list",
    id: 0,
    tasks: [],
    completed: []
  },
  {
    name: "My favourite list",
    id: 1,
    tasks: [],
    completed: []
  }
]

// TODO: API call to retrieve List
const getList = (id: number) : list_T | null => {
  return lists.find(list => list.id === id) || null;
}

export const currListReducer = (state: currListState_T, action : currListAction_T) : currListState_T => {
  switch(action.type) {
    case 'set':
      return { list: getList(action.listId) };
    case 'remove':
      return { list: null };
    default:
      console.log(action);
      throw new Error('Unknown action type.');
  }
}
