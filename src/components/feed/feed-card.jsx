import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';

/**
 * FeedCard 매물 피드 카드 컴포넌트
 *
 * Props:
 * @param {object} property - 매물 정보 객체 [Required]
 *
 * Example usage:
 * <FeedCard property={propertyData} />
 */
function FeedCard({ property }) {
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [imgIdx, setImgIdx] = useState(0);

  const images = property.property_images?.sort((a, b) => a.order - b.order) || [];
  const coverImg = images[imgIdx]?.image_url;
  const host = property.users;
  const hashtags = property.property_hashtags?.map((ph) => ph.hashtags?.name).filter(Boolean) || [];
  const likeCount = (property.likes?.length || 0) + (isLiked ? 1 : 0);

  return (
    <Box sx={{ borderBottom: '8px solid', borderColor: 'grey.100', mb: 0, bgcolor: 'white' }}>
      {/* 호스트 프로필 */}
      <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 1.5, gap: 1.5 }}>
        <Avatar sx={{ width: 36, height: 36, bgcolor: 'primary.main', fontSize: '14px', cursor: 'pointer' }}>
          {host?.name?.[0] || 'H'}
        </Avatar>
        <Box sx={{ flex: 1 }}>
          <Typography variant='body2' fontWeight={700}>{host?.name || '호스트'}</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
            <LocationOnOutlinedIcon sx={{ fontSize: 12, color: 'text.secondary' }} />
            <Typography variant='caption' color='text.secondary'>{property.address}</Typography>
          </Box>
        </Box>
        <Chip label={property.type} size='small' color='primary' variant='outlined' sx={{ fontSize: '11px' }} />
      </Box>

      {/* 이미지 */}
      <Box
        onClick={() => navigate(`/property/${property.id}`)}
        sx={{ width: '100%', aspectRatio: '1/1', position: 'relative', cursor: 'pointer', overflow: 'hidden', bgcolor: 'grey.100' }}
      >
        {coverImg ? (
          <Box
            component='img'
            src={coverImg}
            alt={property.title}
            sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'grey.200' }}>
            <Typography color='text.secondary'>사진 없음</Typography>
          </Box>
        )}
        {images.length > 1 && (
          <Box sx={{ position: 'absolute', bottom: 8, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 0.5 }}>
            {images.map((_, i) => (
              <Box key={i} onClick={(e) => { e.stopPropagation(); setImgIdx(i); }}
                sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: i === imgIdx ? 'white' : 'rgba(255,255,255,0.5)', cursor: 'pointer' }} />
            ))}
          </Box>
        )}
      </Box>

      {/* 액션 바 */}
      <Box sx={{ display: 'flex', alignItems: 'center', px: 1, pt: 0.5 }}>
        <IconButton onClick={() => setIsLiked(!isLiked)} size='small' sx={{ color: isLiked ? 'error.main' : 'inherit' }}>
          {isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </IconButton>
        <IconButton onClick={() => setIsBookmarked(!isBookmarked)} size='small' sx={{ color: isBookmarked ? 'primary.main' : 'inherit' }}>
          {isBookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
        </IconButton>
        <IconButton size='small'>
          <ShareOutlinedIcon />
        </IconButton>
        <Box sx={{ flex: 1 }} />
        <Button
          variant='contained'
          size='small'
          startIcon={<PhoneIcon />}
          sx={{ borderRadius: 4, fontSize: '12px', mr: 1 }}
          onClick={() => navigate(`/inquiry/${property.id}`)}
        >
          문의하기
        </Button>
      </Box>

      {/* 본문 */}
      <Box sx={{ px: 2, pb: 2 }}>
        <Typography variant='body2' fontWeight={700} sx={{ mb: 0.5 }}>
          {likeCount > 0 ? `${likeCount}명이 찜했습니다` : '첫 번째로 찜해보세요'}
        </Typography>
        <Typography variant='body2' fontWeight={700} color='primary.main' sx={{ mb: 0.5 }}>
          {property.contract_type === '전세'
            ? `전세 ${property.deposit.toLocaleString()}만원`
            : `보증금 ${property.deposit.toLocaleString()}만 / 월세 ${property.monthly_rent.toLocaleString()}만`}
        </Typography>
        <Typography variant='body2' sx={{ mb: 0.5 }}>
          <strong>{host?.name}</strong>&nbsp;{property.caption}
        </Typography>
        {hashtags.length > 0 && (
          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
            {hashtags.map((tag) => (
              <Typography key={tag} variant='caption' color='primary.main' sx={{ cursor: 'pointer' }}>
                #{tag}
              </Typography>
            ))}
          </Box>
        )}
        <Typography variant='caption' color='text.disabled' sx={{ mt: 0.5, display: 'block' }}>
          {property.area}㎡ · {property.floor}층 · 입주가능: {property.available_date || '협의'}
        </Typography>
      </Box>
    </Box>
  );
}

export default FeedCard;
