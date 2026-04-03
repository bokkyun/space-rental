import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import { useNavigate } from 'react-router-dom';

/**
 * BottomNav 하단 네비게이션 컴포넌트
 *
 * Props:
 * @param {string} value - 현재 활성화된 탭 [Optional, 기본값: 'home']
 *
 * Example usage:
 * <BottomNav value='home' />
 */
function BottomNav({ value = 'home' }) {
  const navigate = useNavigate();

  const handleChange = (event, newValue) => {
    const routes = {
      home: '/',
      explore: '/explore',
      bookmarks: '/bookmarks',
      profile: '/profile',
    };
    if (routes[newValue]) navigate(routes[newValue]);
  };

  return (
    <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100 }} elevation={3}>
      <Box sx={{ position: 'relative' }}>
        <BottomNavigation value={value} onChange={handleChange} showLabels sx={{ height: '70px' }}>
          <BottomNavigationAction label='홈' value='home' icon={<HomeOutlinedIcon />} />
          <BottomNavigationAction label='탐색' value='explore' icon={<SearchIcon />} />
          {/* 중앙 FAB 버튼 자리 확보용 빈 공간 */}
          <BottomNavigationAction disabled sx={{ opacity: 0, pointerEvents: 'none' }} />
          <BottomNavigationAction label='저장됨' value='bookmarks' icon={<BookmarkBorderIcon />} />
          <BottomNavigationAction label='마이' value='profile' icon={<PersonOutlineIcon />} />
        </BottomNavigation>
        {/* 중앙 + FAB 버튼 */}
        <Fab
          color='primary'
          size='medium'
          onClick={() => navigate('/create-post')}
          sx={{
            position: 'absolute',
            top: '-20px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 101,
            boxShadow: 3,
          }}
        >
          <AddIcon />
        </Fab>
      </Box>
    </Paper>
  );
}

export default BottomNav;
