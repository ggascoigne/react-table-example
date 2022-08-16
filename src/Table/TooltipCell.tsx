import { Tooltip } from '@mui/material'
import React, { CSSProperties, useRef, useState } from 'react'
import type { CellProps } from 'react-table'
import { makeStyles } from 'tss-react/mui'

const useStyles = makeStyles()({
  truncated: {
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  },
})

export const TooltipCellRenderer: React.FC<CellProps<any>> = (props) => {
  const { cell, column } = props
  const { align = 'left' } = column
  return <TooltipCell text={cell.value} align={align} />
}

interface TooltipCellProps {
  text: string
  tooltip?: string
  align: string
  onClick?: (event: React.MouseEvent<HTMLElement>) => void
}

export const TooltipCell: React.FC<TooltipCellProps> = ({ text = '', tooltip = text || '', align, onClick }) => {
  const { classes } = useStyles()
  const [isOverflowed, setIsOverflow] = useState(false)
  const textRef = useRef<HTMLSpanElement>(null)

  const compareSize = () => {
    setIsOverflow(!!(textRef?.current && textRef.current?.scrollWidth > textRef.current?.clientWidth))
  }

  const showTooltip = text !== tooltip || isOverflowed

  return (
    <Tooltip
      className={classes.truncated}
      style={{ textAlign: align, width: '100%' } as CSSProperties}
      title={tooltip}
      disableHoverListener={!showTooltip}
    >
      <span ref={textRef} onMouseEnter={compareSize} onClick={onClick}>
        {text}
      </span>
    </Tooltip>
  )
}
