import { Link } from 'react-router-dom'

import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Stack,
  Chip,
  Divider,
} from '@mui/material'

const ProcessCard = ({ process }) => {
  return (
    <Card
      elevation={2}
      sx={{
        width: 330,
        minHeight: 180,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderRadius: 2,
        backgroundColor: '#fff',
      }}
    >
      <CardActionArea
        component={Link}
        to={`/processes/${process._id || process.id}`}
        sx={{ height: '100%', alignItems: 'stretch' }}
      >
        <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
          <Typography variant="h6" fontWeight="bold" noWrap>
            {process.name}
          </Typography>

          <Divider sx={{ my: 1.5 }} />

          <Stack spacing={1}>
            <Typography
              variant="caption"
              fontWeight="medium"
              letterSpacing={0.5}
            >
              PHASES ({process.phases?.length || 0})
            </Typography>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8, mt: 0.5 }}>
              {process.phases && process.phases.length > 0 ? (
                process.phases.map((phase, i) => (
                  <Chip
                    key={phase.id || phase._id || i}
                    label={phase.name || phase}
                    size="small"
                    variant="outlined"
                    sx={{ fontSize: '0.75rem', height: 20 }}
                  />
                ))
              ) : (
                <Typography
                  variant="body2"
                  color="text.disabled"
                  sx={{ fontStyle: 'italic' }}
                >
                  No phases defined
                </Typography>
              )}
            </Box>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}

export default ProcessCard
