import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Chip from '@mui/material/Chip';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import LanguageIcon from '@mui/icons-material/Language';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import AppHeader from '../components/common/app-header';
import BottomNav from '../components/common/bottom-nav';
import { supabase } from '../lib/supabase';

function MyProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data?.user));
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'grey.50' }}>
      <AppHeader title='마이프로필' showNotification={false} />
      <Box sx={{ flex: 1, pb: '70px' }}>
        <Box sx={{ bgcolor: 'white', p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ width: 64, height: 64, bgcolor: 'primary.main', fontSize: '24px' }}>
            {user?.user_metadata?.name?.[0] || <PersonOutlineIcon />}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            {user ? (
              <>
                <Typography variant='subtitle1' fontWeight={700}>{user.user_metadata?.name || '사용자'}</Typography>
                <Typography variant='body2' color='text.secondary'>{user.email}</Typography>
                <Chip label='게스트' size='small' color='primary' variant='outlined' sx={{ mt: 0.5, fontSize: '11px' }} />
              </>
            ) : (
              <>
                <Typography variant='subtitle1' fontWeight={700}>비로그인 상태</Typography>
                <Button variant='contained' size='small' onClick={() => navigate('/login')} sx={{ mt: 1 }}>로그인 / 회원가입</Button>
              </>
            )}
          </Box>
        </Box>

        <Box sx={{ mt: 1 }} />

        <Box sx={{ bgcolor: 'white' }}>
          <List disablePadding>
            <ListItemButton onClick={() => navigate('/notifications')} sx={{ py: 1.5 }}>
              <ListItemIcon sx={{ minWidth: 40 }}><NotificationsNoneIcon color='action' /></ListItemIcon>
              <ListItemText primary='알림' />
              <ChevronRightIcon color='action' />
            </ListItemButton>
            <Divider component='li' />
            <ListItemButton sx={{ py: 1.5 }}>
              <ListItemIcon sx={{ minWidth: 40 }}><LanguageIcon color='action' /></ListItemIcon>
              <ListItemText primary='언어 변경' secondary='한국어' />
              <ChevronRightIcon color='action' />
            </ListItemButton>
          </List>
        </Box>

        {user && (
          <>
            <Box sx={{ mt: 1 }} />
            <Box sx={{ bgcolor: 'white' }}>
              <List disablePadding>
                <ListItemButton onClick={handleLogout} sx={{ py: 1.5 }}>
                  <ListItemIcon sx={{ minWidth: 40 }}><LogoutIcon color='error' /></ListItemIcon>
                  <ListItemText primary='로그아웃' primaryTypographyProps={{ color: 'error' }} />
                </ListItemButton>
              </List>
            </Box>
          </>
        )}

        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant='caption' color='text.disabled'>SpaceRental v1.0.0</Typography>
        </Box>
      </Box>
      <BottomNav value='profile' />
    </Box>
  );
}

export default MyProfilePage;
