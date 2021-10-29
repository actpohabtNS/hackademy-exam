import { listHead_T } from '../pages/api/taskTypes'

export type listHeadsState_T = {
  listHeads: listHead_T[],
}

type listHeadsAction_T = 
  | { type: "set", listHeads: listHead_T[] }
  | { type: "add", newListHead: listHead_T }
  | { type: "rename", updatedListHead: listHead_T }
  | { type: "delete", listHeadId: number }

export const listHeadsInitState = {
  listHeads: []
};

export const listHeadsReducer = (state: listHeadsState_T, action : listHeadsAction_T) : listHeadsState_T => {
  switch(action.type) {
    case 'set':
      return { listHeads: action.listHeads }
    case 'add': {
      let newState = { listHeads: [] as listHead_T[] };

      if (state.listHeads) {
        newState.listHeads = [ ...state.listHeads, action.newListHead ];
        return newState;
      }
      newState.listHeads = [ action.newListHead ];
      return newState;
    }
    case 'rename':
      return { listHeads: state.listHeads.map((listHead) => listHead.id === action.updatedListHead.id ? action.updatedListHead : listHead) };
    case 'delete':
      return { listHeads: state.listHeads.filter((listHead) => listHead.id !== action.listHeadId) };
    default:
      console.log(action);
      throw new Error('Unknown action type.');
  }
}
