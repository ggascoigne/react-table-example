import { Box, CircularProgress } from '@mui/material'
import React from 'react'

interface LoaderProps {
  error?: boolean
  retry?: (event: React.MouseEvent<HTMLElement>) => void
  timedOut?: boolean
  pastDelay?: boolean
}

export const Loader: React.FC<LoaderProps> = ({ error, retry, timedOut, pastDelay }) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignContent: 'center',
      alignItems: 'center',
      flex: '1 0 auto',
    }}
  >
    {error && (
      <div>
        Error! <button onClick={retry}>Retry</button>
      </div>
    )}
    {timedOut && (
      <div>
        Taking a long time... <button onClick={retry}>Retry</button>
      </div>
    )}
    {pastDelay && <div>Loading...</div>}
    <CircularProgress sx={{ m: 2 }} />
  </Box>
)
