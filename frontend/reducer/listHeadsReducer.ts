import { listHead_T } from '../pages/api/taskTypes'

export type listHeadsState_T = {
  listHeads: listHead_T[],
}

type listHeadsAction_T = 
  | { type: "add", newListHead: listHead_T }
  | { type: "rename", updatedListHead: listHead_T }
  | { type: "delete", listHeadId: number }


//ONLY FOR TESTING
const listHeads = [
  {
    name: "Test list",
    id: 0
  },
  {
    name: "My favourite list",
    id: 1
  }
]

export const listHeadsInitState = {
  listHeads: listHeads //[]
};

export const listHeadsReducer = (state: listHeadsState_T, action : listHeadsAction_T) : listHeadsState_T => {
  switch(action.type) {
    case 'add':
      return { listHeads: [ ...state.listHeads, action.newListHead ] };
    case 'rename':
      return { listHeads: state.listHeads.map((listHead) => listHead.id === action.updatedListHead.id ? action.updatedListHead : listHead) };
    case 'delete':
      return { listHeads: state.listHeads.filter((listHead) => listHead.id !== action.listHeadId) };
    default:
      console.log(action);
      throw new Error('Unknown action type.');
  }
}
