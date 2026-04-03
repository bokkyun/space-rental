import { HashRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import './index.css';
import ErrorBoundary from './components/common/error-boundary';

import HomePage from './pages/home-page';
import ExplorePage from './pages/explore-page';
import PropertyDetailPage from './pages/property-detail-page';
import InquiryPage from './pages/inquiry-page';
import BookmarkPage from './pages/bookmark-page';
import MyProfilePage from './pages/my-profile-page';
import LoginPage from './pages/login-page';
import NotificationPage from './pages/notification-page';
import CreatePostPage from './pages/create-post-page';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ErrorBoundary>
      <HashRouter>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/explore' element={<ExplorePage />} />
          <Route path='/property/:id' element={<PropertyDetailPage />} />
          <Route path='/inquiry/:id' element={<InquiryPage />} />
          <Route path='/bookmarks' element={<BookmarkPage />} />
          <Route path='/profile' element={<MyProfilePage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/notifications' element={<NotificationPage />} />
          <Route path='/create-post' element={<CreatePostPage />} />
        </Routes>
      </HashRouter>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;
