import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import CloseIcon from '@mui/icons-material/Close';
import { supabase } from '../lib/supabase';

const TYPES = ['원룸', '투룸', '오피스텔', '상가', '사무실', '기타'];
const CONTRACT_TYPES = ['월세', '전세'];
const OPTIONS = ['에어컨', '세탁기', '냉장고', 'Wi-Fi', '주차', '엘리베이터', '옷장', '인덕션'];

function CreatePostPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [images, setImages] = useState([]);      // { file, preview } 배열
  const [form, setForm] = useState({
    title: '',
    type: '원룸',
    area: '',
    floor: '',
    total_floor: '',
    direction: '',
    contract_type: '월세',
    deposit: '',
    monthly_rent: '',
    maintenance_fee: '',
    available_date: '',
    min_period: '6',
    address: '',
    caption: '',
  });
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [hashtagInput, setHashtagInput] = useState('');
  const [hashtags, setHashtags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...newImages].slice(0, 10));
  };

  const handleRemoveImage = (idx) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleToggleOption = (opt) => {
    setSelectedOptions((prev) =>
      prev.includes(opt) ? prev.filter((o) => o !== opt) : [...prev, opt]
    );
  };

  const handleAddHashtag = (e) => {
    if (e.key === 'Enter' && hashtagInput.trim()) {
      const tag = hashtagInput.trim().replace('#', '');
      if (tag && !hashtags.includes(tag)) {
        setHashtags((prev) => [...prev, tag]);
      }
      setHashtagInput('');
    }
  };

  const handleSubmit = async () => {
    if (images.length === 0) { setError('사진을 최소 1장 이상 올려주세요.'); return; }
    if (!form.title || !form.address || !form.deposit) { setError('제목, 주소, 보증금은 필수입니다.'); return; }
    if (!supabase) { setError('DB 연결을 확인해주세요.'); return; }

    setLoading(true);
    setError('');

    try {
      // 1. 매물 등록
      const { data: property, error: propErr } = await supabase
        .from('properties')
        .insert({
          title: form.title,
          type: form.type,
          area: parseFloat(form.area) || 0,
          floor: parseInt(form.floor) || null,
          total_floor: parseInt(form.total_floor) || null,
          direction: form.direction || null,
          contract_type: form.contract_type,
          deposit: parseInt(form.deposit) || 0,
          monthly_rent: parseInt(form.monthly_rent) || 0,
          maintenance_fee: parseInt(form.maintenance_fee) || 0,
          available_date: form.available_date || null,
          min_period: parseInt(form.min_period) || 6,
          address: form.address,
          caption: form.caption,
          status: '검수중',
        })
        .select()
        .single();

      if (propErr) throw propErr;

      // 2. 이미지 업로드 (Supabase Storage 미설정 시 URL만 저장)
      for (let i = 0; i < images.length; i++) {
        const img = images[i];
        let imageUrl = img.preview;

        // Storage가 설정되어 있으면 실제 업로드
        try {
          const ext = img.file.name.split('.').pop();
          const path = `properties/${property.id}/${i}.${ext}`;
          const { error: uploadErr } = await supabase.storage
            .from('property-images')
            .upload(path, img.file);
          if (!uploadErr) {
            const { data: urlData } = supabase.storage
              .from('property-images')
              .getPublicUrl(path);
            imageUrl = urlData.publicUrl;
          }
        } catch (_) {
          // Storage 미설정이면 스킵
        }

        await supabase.from('property_images').insert({
          property_id: property.id,
          image_url: imageUrl,
          order: i + 1,
          is_cover: i === 0,
        });
      }

      // 3. 옵션 저장
      if (selectedOptions.length > 0) {
        await supabase.from('property_options').insert(
          selectedOptions.map((opt) => ({
            property_id: property.id,
            option_name: opt,
            has_option: true,
          }))
        );
      }

      // 4. 해시태그 저장
      for (const tag of hashtags) {
        const { data: ht } = await supabase
          .from('hashtags')
          .upsert({ name: tag }, { onConflict: 'name' })
          .select()
          .single();
        if (ht) {
          await supabase.from('property_hashtags').insert({
            property_id: property.id,
            hashtag_id: ht.id,
          }).onConflict?.();
        }
      }

      navigate('/');
    } catch (err) {
      setError(err.message || '등록 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'white', display: 'flex', flexDirection: 'column' }}>
      {/* 헤더 */}
      <Box sx={{ display: 'flex', alignItems: 'center', px: 1, py: 1, borderBottom: '1px solid', borderColor: 'divider', position: 'sticky', top: 0, bgcolor: 'white', zIndex: 10 }}>
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant='subtitle1' fontWeight={700} sx={{ flex: 1, textAlign: 'center' }}>
          새 매물 올리기
        </Typography>
        <Button variant='contained' size='small' onClick={handleSubmit} disabled={loading} sx={{ mr: 1 }}>
          {loading ? <CircularProgress size={18} color='inherit' /> : '등록'}
        </Button>
      </Box>

      <Box sx={{ flex: 1, pb: 4, overflowY: 'auto' }}>
        {error && <Alert severity='error' sx={{ mx: 2, mt: 2 }}>{error}</Alert>}

        {/* 사진 업로드 */}
        <Box sx={{ p: 2 }}>
          <Typography variant='subtitle2' fontWeight={700} sx={{ mb: 1 }}>
            사진 <Typography component='span' variant='caption' color='text.secondary'>({images.length}/10)</Typography>
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', pb: 1, '&::-webkit-scrollbar': { display: 'none' } }}>
            {/* 사진 추가 버튼 */}
            <Box
              onClick={() => fileInputRef.current?.click()}
              sx={{
                minWidth: 100, height: 100, border: '2px dashed', borderColor: 'grey.300',
                borderRadius: 2, display: 'flex', flexDirection: 'column', alignItems: 'center',
                justifyContent: 'center', cursor: 'pointer', bgcolor: 'grey.50', flexShrink: 0,
                '&:hover': { borderColor: 'primary.main', bgcolor: 'primary.50' },
              }}
            >
              <AddPhotoAlternateIcon sx={{ color: 'grey.400', fontSize: 32 }} />
              <Typography variant='caption' color='text.secondary'>사진 추가</Typography>
            </Box>
            <input
              type='file'
              ref={fileInputRef}
              accept='image/*'
              multiple
              style={{ display: 'none' }}
              onChange={handleImageSelect}
            />
            {/* 미리보기 */}
            {images.map((img, idx) => (
              <Box key={idx} sx={{ position: 'relative', minWidth: 100, height: 100, flexShrink: 0 }}>
                <Box
                  component='img'
                  src={img.preview}
                  alt={`preview-${idx}`}
                  sx={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 2 }}
                />
                {idx === 0 && (
                  <Box sx={{ position: 'absolute', bottom: 4, left: 4, bgcolor: 'primary.main', color: 'white', px: 0.7, py: 0.1, borderRadius: 1 }}>
                    <Typography variant='caption' sx={{ fontSize: '10px' }}>대표</Typography>
                  </Box>
                )}
                <IconButton
                  size='small'
                  onClick={() => handleRemoveImage(idx)}
                  sx={{ position: 'absolute', top: 2, right: 2, bgcolor: 'rgba(0,0,0,0.5)', color: 'white', p: 0.3, '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' } }}
                >
                  <CloseIcon sx={{ fontSize: 14 }} />
                </IconButton>
              </Box>
            ))}
          </Box>
        </Box>

        <Divider />

        {/* 기본 정보 */}
        <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant='subtitle2' fontWeight={700}>기본 정보</Typography>

          <TextField label='제목 *' name='title' value={form.title} onChange={handleChange} size='small' fullWidth placeholder='예: 강남역 도보 3분 원룸' />

          {/* 매물 유형 */}
          <Box>
            <Typography variant='caption' color='text.secondary' sx={{ mb: 0.5, display: 'block' }}>매물 유형</Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {TYPES.map((t) => (
                <Chip key={t} label={t} size='small' onClick={() => setForm({ ...form, type: t })}
                  color={form.type === t ? 'primary' : 'default'} variant={form.type === t ? 'filled' : 'outlined'}
                  sx={{ cursor: 'pointer' }} />
              ))}
            </Box>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
            <TextField label='면적 (㎡) *' name='area' value={form.area} onChange={handleChange} size='small' type='number' />
            <TextField label='층수' name='floor' value={form.floor} onChange={handleChange} size='small' type='number' />
            <TextField label='전체 층수' name='total_floor' value={form.total_floor} onChange={handleChange} size='small' type='number' />
            <TextField label='방향' name='direction' value={form.direction} onChange={handleChange} size='small' placeholder='남향' />
          </Box>

          <TextField label='주소 *' name='address' value={form.address} onChange={handleChange} size='small' fullWidth placeholder='예: 서울 강남구 역삼동' />
        </Box>

        <Divider />

        {/* 임대 조건 */}
        <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant='subtitle2' fontWeight={700}>임대 조건</Typography>

          <Box>
            <Typography variant='caption' color='text.secondary' sx={{ mb: 0.5, display: 'block' }}>계약 형태</Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {CONTRACT_TYPES.map((c) => (
                <Chip key={c} label={c} size='small' onClick={() => setForm({ ...form, contract_type: c })}
                  color={form.contract_type === c ? 'primary' : 'default'} variant={form.contract_type === c ? 'filled' : 'outlined'}
                  sx={{ cursor: 'pointer' }} />
              ))}
            </Box>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
            <TextField label='보증금 (만원) *' name='deposit' value={form.deposit} onChange={handleChange} size='small' type='number' />
            {form.contract_type === '월세' && (
              <TextField label='월세 (만원)' name='monthly_rent' value={form.monthly_rent} onChange={handleChange} size='small' type='number' />
            )}
            <TextField label='관리비 (만원)' name='maintenance_fee' value={form.maintenance_fee} onChange={handleChange} size='small' type='number' />
            <TextField label='최소 기간 (개월)' name='min_period' value={form.min_period} onChange={handleChange} size='small' type='number' />
          </Box>

          <TextField label='입주 가능일' name='available_date' value={form.available_date} onChange={handleChange}
            type='date' size='small' fullWidth InputLabelProps={{ shrink: true }} />
        </Box>

        <Divider />

        {/* 편의시설 */}
        <Box sx={{ p: 2 }}>
          <Typography variant='subtitle2' fontWeight={700} sx={{ mb: 1 }}>편의시설</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {OPTIONS.map((opt) => (
              <Chip key={opt} label={opt} size='small' onClick={() => handleToggleOption(opt)}
                color={selectedOptions.includes(opt) ? 'primary' : 'default'}
                variant={selectedOptions.includes(opt) ? 'filled' : 'outlined'}
                sx={{ cursor: 'pointer' }} />
            ))}
          </Box>
        </Box>

        <Divider />

        {/* 상세 설명 & 해시태그 */}
        <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant='subtitle2' fontWeight={700}>상세 설명</Typography>
          <TextField
            name='caption'
            value={form.caption}
            onChange={handleChange}
            multiline
            rows={4}
            fullWidth
            placeholder='매물에 대한 상세한 설명을 입력해주세요.'
          />

          <TextField
            label='해시태그'
            value={hashtagInput}
            onChange={(e) => setHashtagInput(e.target.value)}
            onKeyDown={handleAddHashtag}
            size='small'
            fullWidth
            placeholder='입력 후 Enter (예: 역삼역)'
            helperText='Enter를 눌러 태그를 추가하세요'
          />
          {hashtags.length > 0 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {hashtags.map((tag) => (
                <Chip key={tag} label={`#${tag}`} size='small' color='primary' variant='outlined'
                  onDelete={() => setHashtags((prev) => prev.filter((t) => t !== tag))} />
              ))}
            </Box>
          )}
        </Box>

        <Box sx={{ px: 2, pb: 2 }}>
          <Alert severity='info' sx={{ fontSize: '12px' }}>
            등록 후 공인중개사 검수를 거쳐 피드에 게시됩니다.
          </Alert>
        </Box>
      </Box>
    </Box>
  );
}

export default CreatePostPage;
