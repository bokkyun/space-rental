import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Skeleton from '@mui/material/Skeleton';
import SearchIcon from '@mui/icons-material/Search';
import AppHeader from '../components/common/app-header';
import BottomNav from '../components/common/bottom-nav';
import FilterChips from '../components/ui/filter-chips';
import { useProperties } from '../hooks/use-properties';

function ExplorePropertyCard({ property }) {
  const navigate = useNavigate();
  const images = property.property_images?.sort((a, b) => a.order - b.order) || [];
  const cover = images[0]?.image_url;

  return (
    <Box
      onClick={() => navigate(`/property/${property.id}`)}
      sx={{ cursor: 'pointer', position: 'relative', bgcolor: 'grey.200', aspectRatio: '1/1', borderRadius: 1, overflow: 'hidden' }}
    >
      {cover ? (
        <Box component='img' src={cover} alt={property.title} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      ) : (
        <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography variant='caption' color='text.disabled'>사진없음</Typography>
        </Box>
      )}
      <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, bgcolor: 'rgba(0,0,0,0.55)', p: 0.8 }}>
        <Typography variant='caption' color='white' fontWeight={700} noWrap display='block'>{property.type}</Typography>
        <Typography variant='caption' color='white' noWrap display='block'>
          {property.contract_type === '전세' ? `전세 ${property.deposit.toLocaleString()}만` : `월 ${property.monthly_rent.toLocaleString()}만`}
        </Typography>
      </Box>
    </Box>
  );
}

function ExplorePage() {
  const [filters, setFilters] = useState({});
  const [search, setSearch] = useState('');
  const { properties, loading } = useProperties(filters);

  const filtered = search
    ? properties.filter((p) => p.address.includes(search) || p.title.includes(search))
    : properties;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'white' }}>
      <AppHeader title='탐색' showNotification={false} />
      {/* 검색바 */}
      <Box sx={{ px: 2, py: 1.5, bgcolor: 'white', borderBottom: '1px solid', borderColor: 'divider' }}>
        <TextField
          fullWidth
          size='small'
          placeholder='지역, 동네, 건물명 검색'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: <InputAdornment position='start'><SearchIcon fontSize='small' /></InputAdornment>,
            sx: { borderRadius: 4, bgcolor: 'grey.100' },
          }}
        />
      </Box>
      <FilterChips onFilter={setFilters} />
      {/* 그리드 */}
      <Box sx={{ flex: 1, pb: '70px', p: 0.5 }}>
        {loading ? (
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0.5 }}>
            {Array.from({ length: 9 }).map((_, i) => (
              <Skeleton key={i} variant='rectangular' sx={{ aspectRatio: '1/1' }} />
            ))}
          </Box>
        ) : (
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0.5 }}>
            {filtered.map((property) => (
              <ExplorePropertyCard key={property.id} property={property} />
            ))}
          </Box>
        )}
        {!loading && filtered.length === 0 && (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography color='text.secondary'>검색 결과가 없습니다.</Typography>
          </Box>
        )}
      </Box>
      <BottomNav value='explore' />
    </Box>
  );
}

export default ExplorePage;
