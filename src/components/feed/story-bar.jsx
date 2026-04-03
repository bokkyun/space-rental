import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import { useStories } from '../../hooks/use-properties';

const COLORS = ['#1976d2', '#388e3c', '#f57c00', '#7b1fa2', '#0288d1', '#c62828'];

/**
 * StoryBar 스토리 가로 스크롤 컴포넌트
 *
 * Example usage:
 * <StoryBar />
 */
function StoryBar() {
  const { stories } = useStories();

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 2,
        px: 2,
        py: 1.5,
        overflowX: 'auto',
        borderBottom: '1px solid',
        borderColor: 'divider',
        bgcolor: 'white',
        '&::-webkit-scrollbar': { display: 'none' },
      }}
    >
      {stories.length === 0
        ? Array.from({ length: 5 }).map((_, i) => (
            <Box key={i} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5, minWidth: '60px' }}>
              <Skeleton variant='circular' width={56} height={56} />
              <Skeleton variant='text' width={40} height={14} />
            </Box>
          ))
        : stories.map((story, i) => (
            <Box key={story.id} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5, cursor: 'pointer', minWidth: '60px' }}>
              <Box sx={{ p: '2px', borderRadius: '50%', background: `linear-gradient(45deg, ${COLORS[i % COLORS.length]}, #ff9800)` }}>
                <Avatar sx={{ width: 52, height: 52, bgcolor: COLORS[i % COLORS.length], border: '2px solid white', fontSize: '14px' }}>
                  {story.label[0]}
                </Avatar>
              </Box>
              <Typography variant='caption' sx={{ fontSize: '11px', color: 'text.secondary', whiteSpace: 'nowrap' }}>
                {story.label}
              </Typography>
            </Box>
          ))}
    </Box>
  );
}

export default StoryBar;
