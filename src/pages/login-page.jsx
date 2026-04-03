import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Alert from '@mui/material/Alert';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import { supabase } from '../lib/supabase';

function LoginPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);
  const [form, setForm] = useState({ email: '', password: '', name: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async () => {
    if (!form.email || !form.password) { setError('이메일과 비밀번호를 입력해주세요.'); return; }
    setLoading(true); setError('');
    const { error: err } = await supabase.auth.signInWithPassword({ email: form.email, password: form.password });
    setLoading(false);
    if (err) { setError(err.message); return; }
    navigate('/');
  };

  const handleSignup = async () => {
    if (!form.email || !form.password || !form.name) { setError('이름, 이메일, 비밀번호는 필수입니다.'); return; }
    setLoading(true); setError('');
    const { error: err } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { data: { name: form.name, phone: form.phone } },
    });
    setLoading(false);
    if (err) { setError(err.message); return; }
    navigate('/');
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 3 }}>
      {/* 로고 */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
        <HomeWorkIcon sx={{ fontSize: 56, color: 'primary.main', mb: 1 }} />
        <Typography variant='h5' fontWeight={800} color='primary.main'>SpaceRental</Typography>
        <Typography variant='body2' color='text.secondary'>공간을 찾는 가장 쉬운 방법</Typography>
      </Box>

      <Box sx={{ width: '100%', maxWidth: 400 }}>
        <Tabs value={tab} onChange={(_, v) => { setTab(v); setError(''); }} variant='fullWidth' sx={{ mb: 3 }}>
          <Tab label='로그인' />
          <Tab label='회원가입' />
        </Tabs>

        {error && <Alert severity='error' sx={{ mb: 2 }}>{error}</Alert>}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {tab === 1 && (
            <TextField label='이름 *' name='name' value={form.name} onChange={handleChange} fullWidth size='small' />
          )}
          <TextField label='이메일 *' name='email' value={form.email} onChange={handleChange} fullWidth size='small' type='email' />
          <TextField label='비밀번호 *' name='password' value={form.password} onChange={handleChange} fullWidth size='small' type='password' />
          {tab === 1 && (
            <TextField label='연락처' name='phone' value={form.phone} onChange={handleChange} fullWidth size='small' placeholder='010-0000-0000' />
          )}
          <Button variant='contained' fullWidth size='large' onClick={tab === 0 ? handleLogin : handleSignup} disabled={loading}>
            {loading ? '처리 중...' : tab === 0 ? '로그인' : '회원가입'}
          </Button>
        </Box>

        <Divider sx={{ my: 3 }}>비로그인으로 계속</Divider>
        <Button variant='outlined' fullWidth onClick={() => navigate('/')}>
          로그인 없이 매물 보기
        </Button>
      </Box>
    </Box>
  );
}

export default LoginPage;
