import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import FeedCard from './feed-card';
import { useProperties } from '../../hooks/use-properties';

/**
 * FeedList 매물 피드 목록 컴포넌트
 *
 * Props:
 * @param {object} filters - 필터 조건 [Optional]
 *
 * Example usage:
 * <FeedList />
 */
function FeedList({ filters }) {
  const { properties, loading, error } = useProperties(filters || {});

  if (loading) {
    return (
      <Box>
        {Array.from({ length: 3 }).map((_, i) => (
          <Box key={i} sx={{ mb: 1, bgcolor: 'white', borderBottom: '8px solid', borderColor: 'grey.100' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', p: 2, gap: 1.5 }}>
              <Skeleton variant='circular' width={36} height={36} />
              <Box sx={{ flex: 1 }}>
                <Skeleton variant='text' width={100} />
                <Skeleton variant='text' width={150} />
              </Box>
            </Box>
            <Skeleton variant='rectangular' width='100%' sx={{ aspectRatio: '1/1' }} />
            <Box sx={{ p: 2 }}>
              <Skeleton variant='text' width='60%' />
              <Skeleton variant='text' width='80%' />
            </Box>
          </Box>
        ))}
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography color='error'>데이터를 불러오지 못했습니다.</Typography>
      </Box>
    );
  }

  if (properties.length === 0) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography color='text.secondary'>등록된 매물이 없습니다.</Typography>
      </Box>
    );
  }

  return (
    <Box>
      {properties.map((property) => (
        <FeedCard key={property.id} property={property} />
      ))}
    </Box>
  );
}

export default FeedList;
