import { Button, Popover, Typography, createStyles, makeStyles } from '@material-ui/core'
import React, { FormEvent, ReactElement, useCallback } from 'react'
import { TableInstance } from 'react-table'

const useStyles = makeStyles(
  createStyles({
    columnsPopOver: {
      '& > div': {
        padding: '24px 8px 5px 24px'
      }
    },
    form: {
      width: 484,
      '@media (max-width: 600px)': {
        width: 168
      }
    },
    filtersResetButton: {
      position: 'absolute',
      top: 18,
      right: 21
    },
    popoverTitle: {
      fontWeight: 500,
      padding: '0 24px 24px 0',
      textTransform: 'uppercase'
    },
    formGrid: {
      display: 'inline-flex',
      flexDirection: 'column',
      verticalAlign: 'top',
      flex: '1 1 calc(50% - 24px)',
      marginRight: 24,
      marginBottom: 24,
      width: 218,
      '@media (max-width: 600px)': {
        width: 150
      }
    },
    hidden: {
      display: 'none'
    }
  })
)

type FilterPage<T extends object> = {
  instance: TableInstance<T>
  anchorEl?: Element
  onClose: () => void
  show: boolean
}

export function FilterPage<T extends object>({ instance, anchorEl, onClose, show }: FilterPage<T>): ReactElement {
  const classes = useStyles({})
  const { flatColumns, setAllFilters } = instance

  const onSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      onClose()
    },
    [onClose]
  )

  const resetFilters = useCallback(() => {
    setAllFilters([])
  }, [setAllFilters])

  return (
    <div>
      <Popover
        anchorEl={anchorEl}
        className={classes.columnsPopOver}
        id={'popover-filters'}
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
        <Typography className={classes.popoverTitle}>Filters</Typography>
        <form onSubmit={onSubmit} className={classes.form}>
          <Button className={classes.filtersResetButton} color='primary' onClick={resetFilters}>
            Reset
          </Button>
          {flatColumns
            .filter(it => it.canFilter)
            .map(column => (
              <div key={column.id} className={classes.formGrid}>
                {column.render('Filter')}
              </div>
            ))}
          <Button className={classes.hidden} type={'submit'}>
            &nbsp;
          </Button>
        </form>
      </Popover>
    </div>
  )
}
