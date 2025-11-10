import React, { ReactNode, TransitionStartFunction, useContext } from "react";

type TableContextType<T> = {
  dataSelected: T[];
  dataCount: number;
  showSearchSwitch?: boolean;
  paginationActions: ReactNode;
  isLoading: boolean;
  startTransition: TransitionStartFunction;
};

const TableContext = React.createContext<TableContextType<any>>({
  dataSelected: [],
  dataCount: 0,
  paginationActions: null,
  isLoading: false,
  startTransition: () => {},
});

export const useTableContext = <T,>() => {
  return useContext<TableContextType<T>>(TableContext);
};

interface Props<T> extends TableContextType<T> {
  children: React.ReactNode;
}

const TableProvider = ({
  children,
  dataCount,
  dataSelected,
  showSearchSwitch,
  paginationActions,
  isLoading,
  startTransition,
}: Props<unknown>) => {
  return (
    <TableContext.Provider
      value={{
        dataCount: dataCount || 0,
        dataSelected,
        isLoading,
        paginationActions,
        startTransition,
        showSearchSwitch,
      }}
    >
      {children}
    </TableContext.Provider>
  );
};

export default TableProvider;
