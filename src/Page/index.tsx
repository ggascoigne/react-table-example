import { Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import createStyles from '@material-ui/core/styles/createStyles'
import classNames from 'classnames'
import React from 'react'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    main: {
      background: '#FFFFFF',
      position: 'relative',
      zIndex: 3,
      margin: '10px 20px 0px',
      borderRadius: '6px',
      boxShadow:
        '0 16px 24px 2px rgba(0, 0, 0, 0.14), 0 6px 30px 5px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.2)',
      padding: theme.spacing(3),
    },
  })
)

type PageProps = {
  className?: string
}

export const Page: React.FC<PageProps> = ({ children, className }) => {
  const classes = useStyles()
  return <div className={classNames(classes.main, className)}>{children}</div>
}
