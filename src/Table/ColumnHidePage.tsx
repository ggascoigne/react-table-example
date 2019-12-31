import { Checkbox, FormControlLabel, Popover, Typography, createStyles, makeStyles } from '@material-ui/core'
import React, { ReactElement } from 'react'
import { TableInstance } from 'react-table'

const useStyles = makeStyles(
  createStyles({
    columnsPopOver: {
      '& > div': {
        padding: '24px 8px 24px 24px'
      }
    },
    popoverTitle: {
      fontWeight: 500,
      padding: '0 24px 24px 0',
      textTransform: 'uppercase'
    }
  })
)

type ColumnHidePage<T extends object> = {
  instance: TableInstance<T>
  anchorEl?: Element
  onClose: () => void
  show: boolean
}

const id = 'popover-column-hide'

export function ColumnHidePage<T extends object>({
  instance,
  anchorEl,
  onClose,
  show
}: ColumnHidePage<T>): ReactElement | null {
  const classes = useStyles({})
  const { flatColumns, toggleHideColumn } = instance
  const hideableColumns = flatColumns.filter(column => !(column.id === '_selector'))
  const checkedCount = hideableColumns.reduce((acc, val) => acc + (val.isVisible ? 0 : 1), 0)

  const onlyOneOptionLeft = checkedCount + 1 >= hideableColumns.length

  return hideableColumns.length > 1 ? (
    <div>
      <Popover
        anchorEl={anchorEl}
        className={classes.columnsPopOver}
        id={id}
        onClose={onClose}
        open={show}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
      >
        <Typography className={classes.popoverTitle}>Visible Columns</Typography>
        {hideableColumns.map(column => {
          return (
            <span key={column.id}>
              <FormControlLabel
                control={<Checkbox value={`${column.id}`} disabled={column.isVisible && onlyOneOptionLeft} />}
                label={column.render('Header')}
                checked={column.isVisible}
                onChange={() => toggleHideColumn(column.id, column.isVisible)}
              />
              <br />
            </span>
          )
        })}
      </Popover>
    </div>
  ) : null
}
