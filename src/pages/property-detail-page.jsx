import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Avatar from '@mui/material/Avatar';
import Skeleton from '@mui/material/Skeleton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import PhoneIcon from '@mui/icons-material/Phone';
import WifiIcon from '@mui/icons-material/Wifi';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import LocalLaundryServiceIcon from '@mui/icons-material/LocalLaundryService';
import KitchenIcon from '@mui/icons-material/Kitchen';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import ElevatorIcon from '@mui/icons-material/Elevator';
import BottomNav from '../components/common/bottom-nav';
import { useProperty } from '../hooks/use-properties';

const OPTION_ICONS = {
  'Wi-Fi': <WifiIcon fontSize='small' />,
  '에어컨': <AcUnitIcon fontSize='small' />,
  '세탁기': <LocalLaundryServiceIcon fontSize='small' />,
  '냉장고': <KitchenIcon fontSize='small' />,
  '주차': <DirectionsCarIcon fontSize='small' />,
  '엘리베이터': <ElevatorIcon fontSize='small' />,
};

function PropertyDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { property, loading } = useProperty(id);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [imgIdx, setImgIdx] = useState(0);

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'white' }}>
        <Skeleton variant='rectangular' width='100%' height={400} />
        <Box sx={{ p: 2 }}>
          <Skeleton variant='text' width='80%' height={32} />
          <Skeleton variant='text' width='60%' />
          <Skeleton variant='text' width='40%' />
        </Box>
      </Box>
    );
  }

  if (!property) return null;

  const images = property.property_images?.sort((a, b) => a.order - b.order) || [];
  const options = property.property_options?.filter((o) => o.has_option) || [];
  const hashtags = property.property_hashtags?.map((ph) => ph.hashtags?.name).filter(Boolean) || [];
  const host = property.users;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'white', pb: '80px' }}>
      {/* 이미지 갤러리 */}
      <Box sx={{ position: 'relative', bgcolor: 'grey.100' }}>
        <Box sx={{ width: '100%', aspectRatio: '1/1', overflow: 'hidden' }}>
          {images[imgIdx]?.image_url ? (
            <Box component='img' src={images[imgIdx].image_url} alt={property.title}
              sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography color='text.secondary'>사진 없음</Typography>
            </Box>
          )}
        </Box>
        {/* 뒤로가기 버튼 */}
        <IconButton onClick={() => navigate(-1)}
          sx={{ position: 'absolute', top: 12, left: 12, bgcolor: 'rgba(255,255,255,0.85)', '&:hover': { bgcolor: 'white' } }}>
          <ArrowBackIcon />
        </IconButton>
        {/* 이미지 인디케이터 */}
        {images.length > 1 && (
          <Box sx={{ position: 'absolute', bottom: 12, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 0.5 }}>
            {images.map((_, i) => (
              <Box key={i} onClick={() => setImgIdx(i)}
                sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: i === imgIdx ? 'white' : 'rgba(255,255,255,0.5)', cursor: 'pointer' }} />
            ))}
          </Box>
        )}
        {/* 이미지 수 */}
        <Box sx={{ position: 'absolute', bottom: 12, right: 12, bgcolor: 'rgba(0,0,0,0.5)', color: 'white', px: 1, py: 0.3, borderRadius: 2 }}>
          <Typography variant='caption'>{imgIdx + 1}/{images.length || 1}</Typography>
        </Box>
      </Box>

      <Box sx={{ p: 2 }}>
        {/* 제목 + 찜/저장 */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant='h6' fontWeight={700}>{property.title}</Typography>
            <Typography variant='body2' color='text.secondary'>{property.address}</Typography>
          </Box>
          <Box>
            <IconButton onClick={() => setIsLiked(!isLiked)} size='small' sx={{ color: isLiked ? 'error.main' : 'inherit' }}>
              {isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            </IconButton>
            <IconButton onClick={() => setIsBookmarked(!isBookmarked)} size='small' sx={{ color: isBookmarked ? 'primary.main' : 'inherit' }}>
              {isBookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
            </IconButton>
          </Box>
        </Box>

        {/* 가격 */}
        <Box sx={{ bgcolor: 'primary.main', color: 'white', borderRadius: 2, p: 2, mb: 2 }}>
          <Typography variant='caption' sx={{ opacity: 0.8 }}>{property.contract_type}</Typography>
          <Typography variant='h6' fontWeight={700}>
            {property.contract_type === '전세'
              ? `${property.deposit.toLocaleString()}만원`
              : `보증금 ${property.deposit.toLocaleString()}만 / 월 ${property.monthly_rent.toLocaleString()}만`}
          </Typography>
          {property.maintenance_fee > 0 && (
            <Typography variant='caption' sx={{ opacity: 0.8 }}>관리비 {property.maintenance_fee}만원</Typography>
          )}
        </Box>

        {/* 기본 정보 */}
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, mb: 2 }}>
          {[
            ['유형', property.type],
            ['면적', `${property.area}㎡ (${Math.round(property.area / 3.3)}평)`],
            ['층수', `${property.floor}/${property.total_floor}층`],
            ['방향', property.direction || '-'],
            ['방/욕실', `${property.rooms}개/${property.bathrooms}개`],
            ['최소계약', `${property.min_period}개월`],
            ['입주가능', property.available_date || '협의'],
          ].map(([label, value]) => (
            <Box key={label} sx={{ bgcolor: 'grey.50', borderRadius: 1, p: 1.5 }}>
              <Typography variant='caption' color='text.secondary'>{label}</Typography>
              <Typography variant='body2' fontWeight={600}>{value}</Typography>
            </Box>
          ))}
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* 편의시설 */}
        {options.length > 0 && (
          <>
            <Typography variant='subtitle2' fontWeight={700} sx={{ mb: 1 }}>편의시설</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              {options.map((opt) => (
                <Chip
                  key={opt.option_name}
                  icon={OPTION_ICONS[opt.option_name]}
                  label={opt.option_name}
                  size='small'
                  variant='outlined'
                  color='primary'
                />
              ))}
            </Box>
            <Divider sx={{ my: 2 }} />
          </>
        )}

        {/* 상세 설명 */}
        {property.caption && (
          <>
            <Typography variant='subtitle2' fontWeight={700} sx={{ mb: 1 }}>상세 설명</Typography>
            <Typography variant='body2' color='text.secondary' sx={{ lineHeight: 1.8, mb: 2 }}>{property.caption}</Typography>
            <Divider sx={{ my: 2 }} />
          </>
        )}

        {/* 해시태그 */}
        {hashtags.length > 0 && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
            {hashtags.map((tag) => (
              <Typography key={tag} variant='body2' color='primary.main'>#{tag}</Typography>
            ))}
          </Box>
        )}

        <Divider sx={{ my: 2 }} />

        {/* 호스트 정보 */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar sx={{ bgcolor: 'primary.main' }}>{host?.name?.[0] || 'H'}</Avatar>
          <Box>
            <Typography variant='body2' fontWeight={700}>{host?.name || '호스트'}</Typography>
            <Typography variant='caption' color='text.secondary'>임대인</Typography>
          </Box>
        </Box>
      </Box>

      {/* 하단 고정 버튼 */}
      <Box sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, bgcolor: 'white', p: 2, borderTop: '1px solid', borderColor: 'divider', display: 'flex', gap: 1 }}>
        <Button variant='outlined' fullWidth onClick={() => setIsBookmarked(!isBookmarked)}>
          {isBookmarked ? '저장됨' : '저장하기'}
        </Button>
        <Button variant='contained' fullWidth startIcon={<PhoneIcon />} onClick={() => navigate(`/inquiry/${property.id}`)}>
          문의하기
        </Button>
      </Box>
    </Box>
  );
}

export default PropertyDetailPage;
