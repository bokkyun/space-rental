import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import Button from '@mui/material/Button';
import AppHeader from '../components/common/app-header';
import BottomNav from '../components/common/bottom-nav';

function BookmarkPage() {
  const navigate = useNavigate();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'white' }}>
      <AppHeader title='저장됨' showNotification={false} />
      <Box sx={{ flex: 1, pb: '70px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
        <BookmarkBorderIcon sx={{ fontSize: 64, color: 'grey.300' }} />
        <Typography variant='h6' fontWeight={700}>저장된 매물이 없습니다</Typography>
        <Typography variant='body2' color='text.secondary' textAlign='center'>
          마음에 드는 매물을 저장하면<br />여기서 모아볼 수 있습니다.
        </Typography>
        <Button variant='contained' onClick={() => navigate('/')}>매물 탐색하기</Button>
      </Box>
      <BottomNav value='bookmarks' />
    </Box>
  );
}

export default BookmarkPage;
