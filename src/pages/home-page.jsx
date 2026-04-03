import { useState } from 'react';
import Box from '@mui/material/Box';
import AppHeader from '../components/common/app-header';
import BottomNav from '../components/common/bottom-nav';
import StoryBar from '../components/feed/story-bar';
import FeedList from '../components/feed/feed-list';
import FilterChips from '../components/ui/filter-chips';

function HomePage() {
  const [filters, setFilters] = useState({});

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'grey.100' }}>
      <AppHeader />
      <StoryBar />
      <FilterChips onFilter={setFilters} />
      <Box sx={{ flex: 1, pb: '70px' }}>
        <FeedList filters={filters} />
      </Box>
      <BottomNav value='home' />
    </Box>
  );
}

export default HomePage;
