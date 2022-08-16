import { Button, Popover, Typography } from '@mui/material'
import { FormEvent, ReactElement, useCallback } from 'react'
import type { TableInstance } from 'react-table'
import { makeStyles } from 'tss-react/mui'

const useStyles = makeStyles()({
  columnsPopOver: {
    padding: 24,
  },
  filtersResetButton: {
    top: 18,
    right: 21,
  },
  popoverTitle: {
    fontWeight: 500,
    padding: '0 24px 24px 0',
    textTransform: 'uppercase',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 218px)',
    '@media (max-width: 600px)': {
      gridTemplateColumns: 'repeat(1, 180px)',
    },
    gridColumnGap: 24,
    gridRowGap: 24,
  },
  cell: {
    width: '100%',
    display: 'inline-flex',
    flexDirection: 'column',
  },
  hidden: {
    display: 'none',
  },
})

interface FilterPageProps<T extends Record<string, unknown>> {
  instance: TableInstance<T>
  anchorEl?: Element
  onClose: () => void
  show: boolean
}

export function FilterPage<T extends Record<string, unknown>>({
  instance,
  anchorEl,
  onClose,
  show,
}: FilterPageProps<T>): ReactElement {
  const { classes } = useStyles()
  const { allColumns, setAllFilters } = instance

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
        id='popover-filters'
        onClose={onClose}
        open={show}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <div className={classes.columnsPopOver}>
          <Typography className={classes.popoverTitle}>Filters</Typography>
          <form onSubmit={onSubmit}>
            <Button
              className={classes.filtersResetButton}
              color='primary'
              onClick={resetFilters}
              style={{ position: 'absolute' }}
            >
              Reset
            </Button>
            <div className={classes.grid}>
              {allColumns
                .filter((it) => it.canFilter)
                .map((column) => (
                  <div key={column.id} className={classes.cell}>
                    {column.render('Filter')}
                  </div>
                ))}
            </div>
            <Button className={classes.hidden} type='submit'>
              &nbsp;
            </Button>
          </form>
        </div>
      </Popover>
    </div>
  )
}
