import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Alert from '@mui/material/Alert';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import PhoneIcon from '@mui/icons-material/Phone';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import AppHeader from '../components/common/app-header';
import { useProperty } from '../hooks/use-properties';
import { supabase } from '../lib/supabase';

const AGENT_PHONE = '010-0000-0000';

function InquiryPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { property } = useProperty(id);
  const [form, setForm] = useState({ name: '', phone: '', move_in_date: '', period: '6개월', message: '' });
  const [agreed, setAgreed] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (!form.name || !form.phone) { setError('이름과 연락처는 필수입니다.'); return; }
    if (!agreed) { setError('개인정보 수집에 동의해주세요.'); return; }
    setLoading(true);
    setError('');
    try {
      const { error: err } = await supabase.from('inquiries').insert({
        property_id: id,
        name: form.name,
        phone: form.phone,
        move_in_date: form.move_in_date || null,
        period: form.period,
        message: form.message,
        status: '접수',
      });
      if (err) throw err;
      setSubmitted(true);
    } catch (err) {
      setError('문의 전송에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'white', display: 'flex', flexDirection: 'column' }}>
        <AppHeader title='문의 완료' showBack showNotification={false} />
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 4, gap: 2 }}>
          <CheckCircleOutlineIcon sx={{ fontSize: 80, color: 'success.main' }} />
          <Typography variant='h6' fontWeight={700}>문의가 접수되었습니다!</Typography>
          <Typography variant='body2' color='text.secondary' textAlign='center'>
            공인중개사가 영업일 기준 1일 이내에 연락드릴 예정입니다.
          </Typography>
          <Button variant='contained' onClick={() => navigate('/')} sx={{ mt: 2 }}>홈으로 돌아가기</Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'white', display: 'flex', flexDirection: 'column' }}>
      <AppHeader title='문의하기' showBack showNotification={false} />
      <Box sx={{ flex: 1, p: 2, pb: 4 }}>
        {/* 매물 요약 */}
        {property && (
          <Box sx={{ bgcolor: 'grey.50', borderRadius: 2, p: 2, mb: 3 }}>
            <Typography variant='caption' color='text.secondary'>문의 매물</Typography>
            <Typography variant='body1' fontWeight={700}>{property.title}</Typography>
            <Typography variant='body2' color='primary.main'>
              {property.contract_type === '전세'
                ? `전세 ${property.deposit.toLocaleString()}만원`
                : `보증금 ${property.deposit.toLocaleString()}만 / 월세 ${property.monthly_rent.toLocaleString()}만`}
            </Typography>
          </Box>
        )}

        {/* 공인중개사 전화 */}
        <Box sx={{ bgcolor: 'primary.main', color: 'white', borderRadius: 2, p: 2, mb: 3 }}>
          <Typography variant='subtitle2' sx={{ opacity: 0.9, mb: 1 }}>공인중개사 직접 연락</Typography>
          <Button
            variant='contained'
            fullWidth
            startIcon={<PhoneIcon />}
            href={`tel:${AGENT_PHONE}`}
            sx={{ bgcolor: 'white', color: 'primary.main', fontWeight: 700, '&:hover': { bgcolor: 'grey.100' } }}
          >
            {AGENT_PHONE} 전화하기
          </Button>
        </Box>

        <Divider sx={{ my: 2 }}>또는</Divider>

        {/* 문의 폼 */}
        <Typography variant='subtitle2' fontWeight={700} sx={{ mb: 2 }}>문의 작성</Typography>
        {error && <Alert severity='error' sx={{ mb: 2 }}>{error}</Alert>}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField label='이름 *' name='name' value={form.name} onChange={handleChange} size='small' fullWidth />
          <TextField label='연락처 *' name='phone' value={form.phone} onChange={handleChange} size='small' fullWidth placeholder='010-0000-0000' />
          <TextField label='희망 입주일' name='move_in_date' value={form.move_in_date} onChange={handleChange}
            type='date' size='small' fullWidth InputLabelProps={{ shrink: true }} />
          <TextField
            label='희망 임대 기간'
            name='period'
            value={form.period}
            onChange={handleChange}
            size='small'
            fullWidth
            select
            SelectProps={{ native: true }}
          >
            {['3개월', '6개월', '1년', '2년', '2년 이상'].map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </TextField>
          <TextField label='문의 내용' name='message' value={form.message} onChange={handleChange}
            multiline rows={4} fullWidth placeholder='궁금한 점이나 요청사항을 입력해주세요.' />
          <FormControlLabel
            control={<Checkbox checked={agreed} onChange={(e) => setAgreed(e.target.checked) } />}
            label={<Typography variant='caption'>개인정보 수집 및 이용에 동의합니다. (필수)</Typography>}
          />
          <Button variant='contained' fullWidth size='large' onClick={handleSubmit} disabled={loading}>
            {loading ? '전송 중...' : '문의 전송하기'}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default InquiryPage;
