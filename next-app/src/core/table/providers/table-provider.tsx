import { TableRowSelect } from "@/types/table-row-select";
import React, { ReactNode, TransitionStartFunction, useContext } from "react";

type TableContextType = {
  dataSelected: TableRowSelect;
  dataCount: number;
  showSearchSwitch?: boolean;
  paginationActions: ReactNode;
  isLoading: boolean;
  startTransition: TransitionStartFunction;
};

const TableContext = React.createContext<TableContextType>({
  dataSelected: {} as TableRowSelect,
  dataCount: 0,
  paginationActions: null,
  isLoading: false,
  startTransition: () => {},
});

export const useTableContext = () => {
  return useContext(TableContext);
};

interface Props extends TableContextType {
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
}: Props) => {
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
