import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import Paper from '@mui/material/Paper';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import SearchIcon from '@mui/icons-material/Search';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
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
      inquiry: '/inquiry/new',
      bookmarks: '/bookmarks',
      profile: '/profile',
    };
    navigate(routes[newValue]);
  };

  return (
    <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100 }} elevation={3}>
      <BottomNavigation value={value} onChange={handleChange} showLabels sx={{ height: '70px' }}>
        <BottomNavigationAction label='홈' value='home' icon={<HomeOutlinedIcon />} />
        <BottomNavigationAction label='탐색' value='explore' icon={<SearchIcon />} />
        <BottomNavigationAction label='문의' value='inquiry' icon={<ChatBubbleOutlineIcon />} />
        <BottomNavigationAction label='저장됨' value='bookmarks' icon={<BookmarkBorderIcon />} />
        <BottomNavigationAction label='마이' value='profile' icon={<PersonOutlineIcon />} />
      </BottomNavigation>
    </Paper>
  );
}

export default BottomNav;
