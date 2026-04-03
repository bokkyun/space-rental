import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import AppHeader from '../components/common/app-header';
import BottomNav from '../components/common/bottom-nav';

function NotificationPage() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'white' }}>
      <AppHeader title='알림' showBack showNotification={false} />
      <Box sx={{ flex: 1, pb: '70px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
        <NotificationsNoneIcon sx={{ fontSize: 64, color: 'grey.300' }} />
        <Typography variant='h6' fontWeight={700}>알림이 없습니다</Typography>
        <Typography variant='body2' color='text.secondary' textAlign='center'>
          문의 답변, 찜한 매물 업데이트 등<br />새로운 소식이 여기에 표시됩니다.
        </Typography>
      </Box>
      <BottomNav value='home' />
    </Box>
  );
}

export default NotificationPage;
