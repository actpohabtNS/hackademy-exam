import { createContext, useReducer } from "react";
import { listHeadsInitState, listHeadsReducer, listHeadsState_T } from "../reducer/listHeadsReducer";

export const ListHeadsContext = createContext<
                                  {state: listHeadsState_T, dispatch: React.Dispatch<any>}
                                >({ state: listHeadsInitState, dispatch: () => null });

export const ListsHeadsWrapper : React.FC<{}> = ({ children }) => {
  const [state, dispatch] = useReducer<typeof listHeadsReducer>(listHeadsReducer, listHeadsInitState);

  return (
    <ListHeadsContext.Provider value={{ state, dispatch }}>
      {children}
    </ListHeadsContext.Provider>
  )
}
