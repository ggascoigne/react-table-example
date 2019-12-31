import { TablePagination as MuiTablePagination } from '@material-ui/core'
import React, { PropsWithChildren, ReactElement, useCallback } from 'react'
import { TableInstance } from 'react-table'

export function TablePagination<T extends object>({
  instance
}: PropsWithChildren<{ instance: TableInstance<T> }>): ReactElement | null {
  const {
    state: { pageIndex, pageSize, rowCount = instance.rows.length },
    gotoPage,
    nextPage,
    previousPage,
    setPageSize
  } = instance

  const handleChangePage = useCallback(
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, newPage: number) => {
      if (newPage === pageIndex + 1) {
        nextPage()
      } else if (newPage === pageIndex - 1) {
        previousPage()
      } else {
        gotoPage(newPage)
      }
    },
    [gotoPage, nextPage, pageIndex, previousPage]
  )

  return rowCount ? (
    <MuiTablePagination
      rowsPerPageOptions={[10, 25, 50]}
      component='div'
      count={rowCount}
      rowsPerPage={pageSize}
      page={pageIndex}
      onChangePage={handleChangePage}
      onChangeRowsPerPage={e => {
        setPageSize(Number(e.target.value))
      }}
    />
  ) : null
}
