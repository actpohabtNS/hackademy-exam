import { createContext, useReducer } from "react";
import { currListInitState, currListReducer, currListState_T } from "../reducer/currListReducer";

export const CurrListContext = createContext<
                                  {state: currListState_T, dispatch: React.Dispatch<any>}
                                >({ state: currListInitState, dispatch: () => null });

export const CurrListWrapper : React.FC<{}> = ({ children }) => {
  const [state, dispatch] = useReducer<typeof currListReducer>(currListReducer, currListInitState);

  return (
    <CurrListContext.Provider value={{ state, dispatch }}>
      {children}
    </CurrListContext.Provider>
  )
}
