import { Checkbox, Theme, createStyles, makeStyles, styled } from '@material-ui/core'
import cx from 'classnames'
import React from 'react'

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    tableTable: {
      borderSpacing: 0,
      border: '1px solid rgba(224, 224, 224, 1)'
    },
    tableHeadRow: {
      outline: 0,
      verticalAlign: 'middle',
      backgroundColor: theme.palette.background.paper,
      color: theme.palette.text.primary,
      fontWeight: 500,
      lineHeight: '1.5rem',
      position: 'relative',
      borderBottom: '1px solid rgba(224, 224, 224, 1)'
    },
    tableHeadCell: {
      padding: '16px 1px 16px 16px',
      fontSize: '0.875rem',
      textAlign: 'left',
      verticalAlign: 'inherit',
      color: theme.palette.text.primary,
      fontWeight: 500,
      lineHeight: '1.5rem',
      '&:hover $resizeHandle': {
        opacity: 1
      },
      borderRight: '1px solid rgba(224, 224, 224, 1)',
      '&:last-child': {
        borderRight: 'none'
      }
    },
    resizeHandle: {
      position: 'absolute',
      cursor: 'col-resize',
      zIndex: 100,
      opacity: 0,
      borderLeft: `1px solid ${theme.palette.primary.light}`,
      borderRight: `1px solid ${theme.palette.primary.light}`,
      height: '50%',
      top: '25%',
      transition: 'all linear 100ms',
      right: -2,
      width: 3,
      '&.handleActive': {
        opacity: '1',
        border: 'none',
        backgroundColor: theme.palette.primary.light,
        height: 'calc(100% - 4px)',
        top: '2px',
        right: -1,
        width: 1
      }
    },
    tableRow: {
      color: 'inherit',
      outline: 0,
      verticalAlign: 'middle',
      '&:hover': {
        backgroundColor: 'rgba(0, 0, 0, 0.07)'
      },
      borderBottom: '1px solid rgba(224, 224, 224, 1)',
      '&:last-child': {
        borderBottom: 'none'
      },
      '&.rowSelected': {
        backgroundColor: 'rgba(0, 0, 0, 0.04)',
        '&:hover': {
          backgroundColor: 'rgba(0, 0, 0, 0.07)'
        }
      }
    },
    tableCell: {
      padding: 16,
      fontSize: '0.875rem',
      textAlign: 'left',
      fontWeight: 300,
      lineHeight: 1.43,
      verticalAlign: 'inherit',
      color: theme.palette.text.primary,
      borderRight: '1px solid rgba(224, 224, 224, 1)',
      '&:last-child': {
        borderRight: 'none'
      }
    },
    tableSortLabel: {
      '& svg': {
        width: 16,
        height: 16,
        marginTop: 0,
        marginLeft: 2
      }
    },
    headerIcon: {
      '& svg': {
        width: 16,
        height: 16,
        marginTop: 4,
        marginRight: 0
      }
    },
    cellIcon: {
      '& svg': {
        width: 16,
        height: 16,
        marginTop: 3
      }
    }
  })
)

export const TableTable = ({ children, className, ...rest }: any) => {
  const classes = useStyles()
  return (
    <div className={cx(className, classes.tableTable)} {...rest}>
      {children}
    </div>
  )
}

export const TableBody = styled('div')({
  display: 'flex',
  flex: '1 1 auto',
  width: '100%',
  flexDirection: 'column'
})

export const TableHead = styled('div')({})

export const TableHeadRow = ({ children, className, ...rest }: any) => {
  const classes = useStyles()
  return (
    <div className={cx(className, classes.tableHeadRow)} {...rest}>
      {children}
    </div>
  )
}

export const TableHeadCell = ({ children, className, ...rest }: any) => {
  const classes = useStyles()
  return (
    <div className={cx(className, classes.tableHeadCell)} {...rest}>
      {children}
    </div>
  )
}

export const TableRow = ({ children, className, ...rest }: any) => {
  const classes = useStyles()
  return (
    <div className={cx(className, classes.tableRow)} {...rest}>
      {children}
    </div>
  )
}

export const TableCell = ({ children, className, ...rest }: any) => {
  const classes = useStyles()
  return (
    <div className={cx(className, classes.tableCell)} {...rest}>
      {children}
    </div>
  )
}

export const TableLabel = styled('div')({})

export const HeaderCheckbox = styled(Checkbox)({
  fontSize: '1rem',
  margin: '-8px 0 -8px -15px',
  padding: '8px 9px',
  '& svg': {
    width: '24px',
    height: '24px'
  },
  '&:hover': {
    backgroundColor: 'transparent'
  }
})

export const RowCheckbox = styled(Checkbox)({
  fontSize: '14px',
  margin: '-9px 0 -8px -15px',
  padding: '8px 9px 9px 9px',
  '&:hover': {
    backgroundColor: 'transparent'
  },
  '& svg': {
    width: 24,
    height: 24
  }
})
