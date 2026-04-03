import { Component } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box sx={{ p: 4, textAlign: 'center', mt: 8 }}>
          <Typography variant='h6' color='error' gutterBottom>앱 오류가 발생했습니다</Typography>
          <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
            {this.state.error?.message}
          </Typography>
          <Button variant='contained' onClick={() => window.location.reload()}>
            새로고침
          </Button>
        </Box>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
