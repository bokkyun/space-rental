import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import { useNavigate } from 'react-router-dom';

/**
 * AppHeader 공통 헤더 컴포넌트
 *
 * Props:
 * @param {string} title - 헤더 타이틀 [Optional, 기본값: '']
 * @param {boolean} showBack - 뒤로가기 버튼 표시 여부 [Optional, 기본값: false]
 * @param {boolean} showNotification - 알림 버튼 표시 여부 [Optional, 기본값: true]
 *
 * Example usage:
 * <AppHeader title='홈' showNotification />
 */
function AppHeader({ title = '', showBack = false, showNotification = true }) {
  const navigate = useNavigate();

  return (
    <AppBar position='sticky' color='inherit' elevation={0} sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
      <Toolbar sx={{ justifyContent: 'space-between', minHeight: '56px' }}>
        {showBack ? (
          <IconButton onClick={() => navigate(-1)} edge='start'>
            <ArrowBackIcon />
          </IconButton>
        ) : (
          <Typography variant='h6' fontWeight={700} sx={{ color: 'primary.main', letterSpacing: '-0.5px' }}>
            {title || 'SpaceRental'}
          </Typography>
        )}

        {title && showBack && (
          <Typography variant='subtitle1' fontWeight={600} sx={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
            {title}
          </Typography>
        )}

        {showNotification && (
          <IconButton onClick={() => navigate('/notifications')} edge='end'>
            <NotificationsNoneIcon />
          </IconButton>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default AppHeader;
