import { Box } from '@mui/material'
import React from 'react'

type PageProps = {
  className?: string
  children?: React.ReactNode
}

export const Page: React.FC<PageProps> = ({ children, className }) => (
  <Box
    sx={{
      background: '#FFFFFF',
      position: 'relative',
      zIndex: 3,
      margin: '10px 20px 0px',
      borderRadius: '6px',
      boxShadow:
        '0 16px 24px 2px rgba(0, 0, 0, 0.14), 0 6px 30px 5px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.2)',
      p: 3,
    }}
    className={className}
  >
    {children}
  </Box>
)
