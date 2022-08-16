import BugReportTwoToneIcon from '@mui/icons-material/BugReportTwoTone'
import { IconButton, Theme, Tooltip } from '@mui/material'
import { atom, useAtom } from 'jotai'
import React, { Suspense } from 'react'
import { makeStyles } from 'tss-react/mui'

import { Loader } from '../Loader'

const ReactJson = React.lazy(() => import('react-json-view'))

const debugIsOpen = atom<boolean>(false)
export const useDebugIsOpen = () => useAtom(debugIsOpen)

const useStyles = makeStyles()((theme: Theme) => ({
  button: {
    marginLeft: -2,
    '& svg': {
      width: '1.5rem',
      height: '1.5rem',
    },
  },
}))

export const TableDebugButton: React.FC<{ enabled: boolean; instance: any }> = ({ enabled, instance }) => {
  const { classes, cx } = useStyles()
  const [, setOpen] = useDebugIsOpen()
  return enabled ? (
    <Tooltip title='Debug'>
      <div style={{ position: 'relative' }}>
        <IconButton
          className={cx({ [classes.button]: instance?.rows?.length })}
          onClick={() => setOpen((old) => !old)}
          size='large'
        >
          <BugReportTwoToneIcon />
        </IconButton>
      </div>
    </Tooltip>
  ) : null
}

export const TableDebug: React.FC<{
  enabled: boolean
  instance: any
}> = ({ enabled, instance }) => {
  const [isOpen] = useDebugIsOpen()
  return enabled && isOpen ? (
    <>
      <br />
      <br />
      <Suspense fallback={<Loader />}>
        <ReactJson src={{ ...instance }} collapsed={1} indentWidth={2} enableClipboard={false} sortKeys />
      </Suspense>
    </>
  ) : null
}
