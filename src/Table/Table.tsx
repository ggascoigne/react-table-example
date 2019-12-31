import { TableSortLabel, TextField } from '@material-ui/core'
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown'
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight'
import cx from 'classnames'
import React, { CSSProperties, MouseEventHandler, PropsWithChildren, ReactElement, useEffect } from 'react'
import {
  Cell,
  CellProps,
  Column,
  FilterProps,
  HeaderGroup,
  HeaderProps,
  Hooks,
  Meta,
  Row,
  TableInstance,
  TableOptions,
  useColumnOrder,
  useExpanded,
  useFilters,
  useFlexLayout,
  useGroupBy,
  usePagination,
  useResizeColumns,
  useRowSelect,
  useSortBy,
  useTable
} from 'react-table'

import { camelToWords, useDebounce, useLocalStorage } from '../utils'
import { DumpInstance } from './DumpInstance'
import { FilterChipBar } from './FilterChipBar'
import { fuzzyTextFilter, numericTextFilter } from './filters'
import { ResizeHandle } from './ResizeHandle'
import { TablePagination } from './TablePagination'
import {
  HeaderCheckbox,
  RowCheckbox,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableHeadRow,
  TableLabel,
  TableRow,
  TableTable,
  useStyles
} from './TableStyles'
import { TableToolbar } from './TableToolbar'
import { TooltipCell } from './TooltipCell'

export interface Table<T extends object = {}> extends TableOptions<T> {
  name: string
  onAdd?: (instance: TableInstance<T>) => MouseEventHandler
  onDelete?: (instance: TableInstance<T>) => MouseEventHandler
  onEdit?: (instance: TableInstance<T>) => MouseEventHandler
  onClick?: (row: Row<T>) => void
}

const DefaultHeader: React.FC<HeaderProps<any>> = ({ column }) => (
  <>{column.id.startsWith('_') ? null : camelToWords(column.id)}</>
)

function DefaultColumnFilter<T extends object>({
  column: { id, index, filterValue, setFilter, render, parent }
}: FilterProps<T>) {
  const [value, setValue] = React.useState(filterValue || '')
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value)
  }
  // ensure that reset loads the new value
  useEffect(() => {
    setValue(filterValue || '')
  }, [filterValue])

  const firstIndex = !(parent && parent.index)
  return (
    <TextField
      name={id}
      label={render('Header')}
      value={value}
      autoFocus={index === 0 && firstIndex}
      variant={'standard'}
      onChange={handleChange}
      onBlur={e => {
        setFilter(e.target.value || undefined)
      }}
    />
  )
}

const getStyles = <T extends object>(props: any, disableResizing = false, align = 'left') => [
  props,
  {
    style: {
      justifyContent: align === 'right' ? 'flex-end' : 'flex-start',
      alignItems: 'flex-start',
      display: 'flex'
    }
  }
]

const selectionHook = (hooks: Hooks<any>) => {
  hooks.flatColumns.push(columns => [
    // Let's make a column for selection
    {
      id: '_selector',
      disableResizing: true,
      disableGroupBy: true,
      minWidth: 45,
      width: 45,
      maxWidth: 45,
      // The header can use the table's getToggleAllRowsSelectedProps method
      // to render a checkbox
      Header: ({ getToggleAllRowsSelectedProps }: HeaderProps<any>) => (
        <HeaderCheckbox {...getToggleAllRowsSelectedProps()} />
      ),
      // The cell can use the individual row's getToggleRowSelectedProps method
      // to the render a checkbox
      Cell: ({ row }: CellProps<any>) => <RowCheckbox {...row.getToggleRowSelectedProps()} />
    },
    ...columns
  ])
  hooks.useInstanceBeforeDimensions.push(({ headerGroups }) => {
    // fix the parent group of the selection button to not be resizable
    const selectionGroupHeader = headerGroups[0].headers[0]
    selectionGroupHeader.canResize = false
  })
}

const headerProps = <T extends object>(props: any, { column }: Meta<T, { column: HeaderGroup<T> }>) =>
  getStyles(props, column && column.disableResizing, column && column.align)

const cellProps = <T extends object>(props: any, { cell }: Meta<T, { cell: Cell<T> }>) =>
  getStyles(props, cell.column && cell.column.disableResizing, cell.column && cell.column.align)

export function Table<T extends object>(props: PropsWithChildren<Table<T>>): ReactElement {
  const { name, columns, onAdd, onDelete, onEdit, onClick } = props
  const classes = useStyles()

  const filterTypes = React.useMemo(
    () => ({
      fuzzyText: fuzzyTextFilter,
      numeric: numericTextFilter
    }),
    []
  )

  const hooks = [
    useColumnOrder,
    useGroupBy,
    useFilters,
    useSortBy,
    useExpanded,
    useFlexLayout,
    usePagination,
    useResizeColumns,
    useRowSelect,
    selectionHook
  ]

  const defaultColumn = React.useMemo<Partial<Column<T>>>(
    () => ({
      // disableFilter: true,
      // disableGroupBy: true,
      Filter: DefaultColumnFilter,
      Cell: TooltipCell,
      Header: DefaultHeader,
      // When using the useFlexLayout:
      minWidth: 30, // minWidth is only used as a limit for resizing
      width: 150, // width is used for both the flex-basis and flex-grow
      maxWidth: 200 // maxWidth is only used as a limit for resizing
    }),
    []
  )

  const [initialState, setInitialState] = useLocalStorage(`tableState:${name}`, {})
  const instance = useTable<T>(
    {
      ...props,
      columns,
      filterTypes,
      defaultColumn,
      initialState
    },
    ...hooks
  )

  const { getTableProps, headerGroups, getTableBodyProps, page, prepareRow, state } = instance
  const debouncedState = useDebounce(state, 500)

  useEffect(() => {
    const { sortBy, filters, pageSize, columnResizing, hiddenColumns } = debouncedState
    const val = {
      sortBy,
      filters,
      pageSize,
      columnResizing,
      hiddenColumns
    }
    setInitialState(val)
  }, [setInitialState, debouncedState])

  const cellClickHandler = (cell: Cell<T>) => () => {
    onClick && cell.column.id !== '_selector' && onClick(cell.row)
  }

  return (
    <>
      <TableToolbar instance={instance} {...{ onAdd, onDelete, onEdit }} />
      <FilterChipBar<T> instance={instance} />
      <TableTable {...getTableProps()}>
        <TableHead>
          {headerGroups.map(headerGroup => (
            <TableHeadRow {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => {
                const style = {
                  textAlign: column.align ? column.align : 'left '
                } as CSSProperties
                return (
                  <TableHeadCell {...column.getHeaderProps(headerProps)}>
                    <div>
                      {column.canGroupBy ? (
                        // If the column can be grouped, let's add a toggle
                        <TableSortLabel
                          active
                          direction={column.isGrouped ? 'desc' : 'asc'}
                          IconComponent={KeyboardArrowRight}
                          {...column.getGroupByToggleProps()}
                          className={classes.headerIcon}
                        />
                      ) : null}
                      {column.canSort ? (
                        <TableSortLabel
                          active={column.isSorted}
                          direction={column.isSortedDesc ? 'desc' : 'asc'}
                          {...column.getSortByToggleProps()}
                          className={classes.tableSortLabel}
                          style={style}
                        >
                          {column.render('Header')}
                        </TableSortLabel>
                      ) : (
                        <TableLabel style={style}>{column.render('Header')}</TableLabel>
                      )}
                      {/*<div>{column.canFilter ? column.render('Filter') : null}</div>*/}
                    </div>
                    {column.canResize && <ResizeHandle column={column} />}
                  </TableHeadCell>
                )
              })}
            </TableHeadRow>
          ))}
        </TableHead>
        <TableBody {...getTableBodyProps()}>
          {page.map(row => {
            prepareRow(row)
            return (
              <TableRow {...row.getRowProps()} className={cx({ rowSelected: row.isSelected })}>
                {row.cells.map(cell => {
                  return (
                    <TableCell {...cell.getCellProps(cellProps)} onClick={cellClickHandler(cell)}>
                      {cell.isGrouped ? (
                        // If it's a grouped cell, add an expander and row count
                        <>
                          <TableSortLabel
                            active
                            direction={row.isExpanded ? 'desc' : 'asc'}
                            IconComponent={KeyboardArrowDown}
                            {...row.getExpandedToggleProps()}
                            className={classes.cellIcon}
                          />{' '}
                          {cell.render('Cell', { editable: false })} ({row.subRows.length})
                        </>
                      ) : cell.isAggregated ? (
                        // If the cell is aggregated, use the Aggregated
                        // renderer for cell
                        cell.render('Aggregated')
                      ) : cell.isRepeatedValue ? null : ( // For cells with repeated values, render null
                        // Otherwise, just render the regular cell
                        cell.render('Cell' /*, { editable: true }*/)
                      )}
                    </TableCell>
                  )
                })}
              </TableRow>
            )
          })}
        </TableBody>
      </TableTable>
      <TablePagination<T> instance={instance} />
      <DumpInstance enabled instance={instance} />
    </>
  )
}
