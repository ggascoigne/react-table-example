import cx from 'classnames'
import React from 'react'
import { ColumnInstance } from 'react-table'

import { useStyles } from './TableStyles'

export const ResizeHandle = <T extends {}>({ column }: { column: ColumnInstance<T> }) => {
  const classes = useStyles()
  return (
    <div
      {...column.getResizerProps()}
      style={{ cursor: 'col-resize' }} // override the useResizeColumns default
      className={cx({
        [classes.resizeHandle]: true,
        handleActive: column.isResizing,
      })}
    />
  )
}
