import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import { useState } from 'react';

const TYPES = ['전체', '원룸', '투룸', '오피스텔', '상가', '사무실'];

/**
 * FilterChips 필터 칩 컴포넌트
 *
 * Props:
 * @param {function} onFilter - 필터 변경 콜백 [Required]
 *
 * Example usage:
 * <FilterChips onFilter={setFilters} />
 */
function FilterChips({ onFilter }) {
  const [selected, setSelected] = useState('전체');

  const handleSelect = (type) => {
    setSelected(type);
    onFilter(type === '전체' ? {} : { type });
  };

  return (
    <Box sx={{
      display: 'flex',
      gap: 1,
      px: 2,
      py: 1,
      overflowX: 'auto',
      bgcolor: 'white',
      borderBottom: '1px solid',
      borderColor: 'divider',
      '&::-webkit-scrollbar': { display: 'none' },
    }}>
      {TYPES.map((type) => (
        <Chip
          key={type}
          label={type}
          size='small'
          onClick={() => handleSelect(type)}
          color={selected === type ? 'primary' : 'default'}
          variant={selected === type ? 'filled' : 'outlined'}
          sx={{ cursor: 'pointer', whiteSpace: 'nowrap' }}
        />
      ))}
    </Box>
  );
}

export default FilterChips;
