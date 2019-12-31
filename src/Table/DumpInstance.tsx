import { IconButton, Tooltip, createStyles, makeStyles } from '@material-ui/core'
import React, { Suspense, useState } from 'react'

import { Loader } from '../Loader'
import { DebugIcon } from './DebugIcon'

const ReactJson = React.lazy(() => import('react-json-view'))

const useStyles = makeStyles(
  createStyles({
    button: {
      marginTop: -72,
      marginLeft: 12
    }
  })
)

export const DumpInstance: React.FC<{
  enabled: boolean
  instance: any
}> = ({ enabled, instance }) => {
  const [open, setOpen] = useState(false)
  const classes = useStyles()

  return enabled ? (
    <>
      <Tooltip title={'Debug'}>
        <span>
          <IconButton className={classes.button} onClick={() => setOpen(old => !old)}>
            <DebugIcon />
          </IconButton>
        </span>
      </Tooltip>
      {open && (
        <>
          <br />
          <br />
          <Suspense fallback={<Loader />}>
            <ReactJson src={{ ...instance }} collapsed={1} indentWidth={2} />
          </Suspense>
        </>
      )}
    </>
  ) : null
}
