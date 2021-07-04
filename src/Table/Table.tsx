import { TableSortLabel, TextField, Tooltip } from '@material-ui/core'
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight'
import KeyboardArrowUp from '@material-ui/icons/KeyboardArrowUp'
import cx from 'classnames'
import React, { CSSProperties, MouseEventHandler, PropsWithChildren, ReactElement, useEffect } from 'react'
import {
  Cell,
  CellProps,
  ColumnInstance,
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
  useTable,
} from 'react-table'

import { camelToWords, useDebounce, useLocalStorage } from '../utils'
import { FilterChipBar } from './FilterChipBar'
import { fuzzyTextFilter, numericTextFilter } from './filters'
import { ResizeHandle } from './ResizeHandle'
import { TableDebug } from './TableDebug'
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
  useStyles,
} from './TableStyles'
import { TableToolbar } from './TableToolbar'
import { TooltipCellRenderer } from './TooltipCell'

export interface TableProperties<T extends Record<string, unknown>> extends TableOptions<T> {
  name: string
  onAdd?: (instance: TableInstance<T>) => MouseEventHandler
  onDelete?: (instance: TableInstance<T>) => MouseEventHandler
  onEdit?: (instance: TableInstance<T>) => MouseEventHandler
  onClick?: (row: Row<T>) => void
}

const DefaultHeader: React.FC<HeaderProps<any>> = ({ column }) => (
  <>{column.id.startsWith('_') ? null : camelToWords(column.id)}</>
)

// yes this is recursive, but the depth never exceeds three so it seems safe enough
const findFirstColumn = <T extends Record<string, unknown>>(columns: Array<ColumnInstance<T>>): ColumnInstance<T> =>
  columns[0].columns ? findFirstColumn(columns[0].columns) : columns[0]

function DefaultColumnFilter<T extends Record<string, unknown>>({ columns, column }: FilterProps<T>) {
  const { id, filterValue, setFilter, render } = column
  const [value, setValue] = React.useState(filterValue || '')
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value)
  }
  // ensure that reset loads the new value
  useEffect(() => {
    setValue(filterValue || '')
  }, [filterValue])

  const isFirstColumn = findFirstColumn(columns) === column
  return (
    <TextField
      name={id}
      label={render('Header')}
      InputLabelProps={{ htmlFor: id }}
      value={value}
      autoFocus={isFirstColumn}
      variant='standard'
      onChange={handleChange}
      onBlur={(e) => {
        setFilter(e.target.value || undefined)
      }}
    />
  )
}

const getStyles = (props: any, disableResizing = false, align = 'left') => [
  props,
  {
    style: {
      justifyContent: align === 'right' ? 'flex-end' : 'flex-start',
      alignItems: 'flex-start',
      display: 'flex',
    },
  },
]

const selectionHook = (hooks: Hooks<any>) => {
  hooks.allColumns.push((columns) => [
    // Let's make a column for selection
    {
      id: '_selector',
      disableResizing: true,
      disableGroupBy: true,
      minWidth: 45,
      width: 45,
      maxWidth: 45,
      Aggregated: undefined,
      // The header can use the table's getToggleAllRowsSelectedProps method
      // to render a checkbox
      Header: ({ getToggleAllRowsSelectedProps }: HeaderProps<any>) => (
        <HeaderCheckbox {...getToggleAllRowsSelectedProps()} />
      ),
      // The cell can use the individual row's getToggleRowSelectedProps method
      // to the render a checkbox
      Cell: ({ row }: CellProps<any>) => <RowCheckbox {...row.getToggleRowSelectedProps()} />,
    },
    ...columns,
  ])
  hooks.useInstanceBeforeDimensions.push(({ headerGroups }) => {
    // fix the parent group of the selection button to not be resizable
    const selectionGroupHeader = headerGroups[0].headers[0]
    selectionGroupHeader.canResize = false
  })
}

const headerProps = <T extends Record<string, unknown>>(props: any, { column }: Meta<T, { column: HeaderGroup<T> }>) =>
  getStyles(props, column && column.disableResizing, column && column.align)

const cellProps = <T extends Record<string, unknown>>(props: any, { cell }: Meta<T, { cell: Cell<T> }>) =>
  getStyles(props, cell.column && cell.column.disableResizing, cell.column && cell.column.align)

const defaultColumn = {
  Filter: DefaultColumnFilter,
  Cell: TooltipCellRenderer,
  Header: DefaultHeader,
  // When using the useFlexLayout:
  minWidth: 30, // minWidth is only used as a limit for resizing
  width: 150, // width is used for both the flex-basis and flex-grow
  maxWidth: 200, // maxWidth is only used as a limit for resizing
}

const hooks = [
  useColumnOrder,
  useFilters,
  useGroupBy,
  useSortBy,
  useExpanded,
  useFlexLayout,
  usePagination,
  useResizeColumns,
  useRowSelect,
  selectionHook,
]

const filterTypes = {
  fuzzyText: fuzzyTextFilter,
  numeric: numericTextFilter,
}

export function Table<T extends Record<string, unknown>>(props: PropsWithChildren<TableProperties<T>>): ReactElement {
  const { name, columns, onAdd, onDelete, onEdit, onClick } = props
  const classes = useStyles()

  const [initialState, setInitialState] = useLocalStorage(`tableState:${name}`, {})
  const instance = useTable<T>(
    {
      ...props,
      columns,
      filterTypes,
      defaultColumn,
      initialState,
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
      hiddenColumns,
    }
    setInitialState(val)
  }, [setInitialState, debouncedState])

  const cellClickHandler = (cell: Cell<T>) => () => {
    onClick && !cell.column.isGrouped && !cell.row.isGrouped && cell.column.id !== '_selector' && onClick(cell.row)
  }

  const { role: tableRole, ...tableProps } = getTableProps()
  return (
    <>
      <TableToolbar instance={instance} {...{ onAdd, onDelete, onEdit }} />
      <FilterChipBar<T> instance={instance} />
      <TableTable {...tableProps}>
        <TableHead>
          {headerGroups.map((headerGroup) => {
            const {
              key: headerGroupKey,
              title: headerGroupTitle,
              role: headerGroupRole,
              ...getHeaderGroupProps
            } = headerGroup.getHeaderGroupProps()
            return (
              <TableHeadRow key={headerGroupKey} {...getHeaderGroupProps}>
                {headerGroup.headers.map((column) => {
                  const style = {
                    textAlign: column.align ? column.align : 'left ',
                  } as CSSProperties
                  const { key: headerKey, role: headerRole, ...getHeaderProps } = column.getHeaderProps(headerProps)
                  const { title: groupTitle = '', ...columnGroupByProps } = column.getGroupByToggleProps()
                  const { title: sortTitle = '', ...columnSortByProps } = column.getSortByToggleProps()

                  return (
                    <TableHeadCell key={headerKey} {...getHeaderProps}>
                      {column.canGroupBy && (
                        <Tooltip title={groupTitle}>
                          <TableSortLabel
                            active
                            direction={column.isGrouped ? 'desc' : 'asc'}
                            IconComponent={KeyboardArrowRight}
                            {...columnGroupByProps}
                            className={classes.headerIcon}
                          />
                        </Tooltip>
                      )}
                      {column.canSort ? (
                        <Tooltip title={sortTitle}>
                          <TableSortLabel
                            active={column.isSorted}
                            direction={column.isSortedDesc ? 'desc' : 'asc'}
                            {...columnSortByProps}
                            className={classes.tableSortLabel}
                            style={style}
                          >
                            {column.render('Header')}
                          </TableSortLabel>
                        </Tooltip>
                      ) : (
                        <TableLabel style={style}>{column.render('Header')}</TableLabel>
                      )}
                      {/*<div>{column.canFilter ? column.render('Filter') : null}</div>*/}
                      {column.canResize && <ResizeHandle column={column} />}
                    </TableHeadCell>
                  )
                })}
              </TableHeadRow>
            )
          })}
        </TableHead>
        <TableBody {...getTableBodyProps()}>
          {page.map((row) => {
            prepareRow(row)
            const { key: rowKey, role: rowRole, ...getRowProps } = row.getRowProps()
            return (
              <TableRow
                key={rowKey}
                {...getRowProps}
                className={cx({ rowSelected: row.isSelected, clickable: onClick })}
              >
                {row.cells.map((cell) => {
                  const { key: cellKey, role: cellRole, ...getCellProps } = cell.getCellProps(cellProps)
                  return (
                    <TableCell key={cellKey} {...getCellProps} onClick={cellClickHandler(cell)}>
                      {cell.isGrouped ? (
                        <>
                          <TableSortLabel
                            classes={{
                              iconDirectionAsc: classes.iconDirectionAsc,
                              iconDirectionDesc: classes.iconDirectionDesc,
                            }}
                            active
                            direction={row.isExpanded ? 'desc' : 'asc'}
                            IconComponent={KeyboardArrowUp}
                            {...row.getToggleRowExpandedProps()}
                            className={classes.cellIcon}
                          />{' '}
                          {cell.render('Cell', { editable: false })} ({row.subRows.length})
                        </>
                      ) : cell.isAggregated ? (
                        cell.render('Aggregated')
                      ) : cell.isPlaceholder ? null : (
                        cell.render('Cell')
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
      <TableDebug enabled instance={instance} />
    </>
  )
}
