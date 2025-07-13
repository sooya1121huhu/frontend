import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Box,
  Chip,
  CircularProgress,
  Alert,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Divider,
  Stack,
  Tabs,
  Tab
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon
} from '@mui/icons-material';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Checkbox from '@mui/material/Checkbox';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Autocomplete from '@mui/material/Autocomplete';
import PerfumeDetailPage from './components/PerfumeDetailPage';
import NoteDisplay from './components/NoteDisplay';
import PerfumeForm from './components/PerfumeForm';
import './App.css';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

function PerfumeList() {
  const navigate = useNavigate();
  // 인증 상태
  const [auth, setAuth] = useState({ token: localStorage.getItem('token'), username: localStorage.getItem('username') });
  const [authTab, setAuthTab] = useState(0); // 0: 로그인, 1: 회원가입
  const [authForm, setAuthForm] = useState({ username: '', password: '' });
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // 기존 상태
  const [perfumes, setPerfumes] = useState([]);
  const [filteredPerfumes, setFilteredPerfumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [ownPerfumeIds, setOwnPerfumeIds] = useState([]);
  const [selectedOwnPerfumeIds, setSelectedOwnPerfumeIds] = useState([]);
  const [ownDialogOpen, setOwnDialogOpen] = useState(false);
  const [ownSearchTerm, setOwnSearchTerm] = useState('');
  const [ownBrand, setOwnBrand] = useState('');
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  // addForm 상태는 PerfumeForm 컴포넌트로 이동
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState('');
  const [brands, setBrands] = useState([]);

  // 브랜드 목록 가져오기 (perfumes_brand 테이블 사용)
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/brands`);
        setBrands(response.data.data || []);
      } catch (error) {
        console.error('브랜드 목록 로딩 실패:', error);
      }
    };
    fetchBrands();
  }, []);

  // 인증 관련 함수
  const handleAuthTabChange = (_, newValue) => {
    setAuthTab(newValue);
    setAuthError('');
  };
  const handleAuthInput = (e) => {
    setAuthForm({ ...authForm, [e.target.name]: e.target.value });
  };
  const handleLogin = async () => {
    setAuthLoading(true);
    setAuthError('');
    try {
      const response = await axios.post(`${API_BASE_URL}/api/users/login`, authForm);
      const data = response.data;
      if (!data.success) throw new Error(data.message);
      localStorage.setItem('token', data.token);
      localStorage.setItem('username', authForm.username);
      setAuth({ token: data.token, username: authForm.username });
    } catch (err) {
      setAuthError(err.response?.data?.message || err.message);
    } finally {
      setAuthLoading(false);
    }
  };
  const handleRegister = async () => {
    setAuthLoading(true);
    setAuthError('');
    try {
      const response = await axios.post(`${API_BASE_URL}/api/users/register`, authForm);
      const data = response.data;
      if (!data.success) throw new Error(data.message);
      setAuthTab(0);
      setAuthForm({ username: authForm.username, password: '' });
      setAuthError('회원가입 성공! 로그인 해주세요.');
    } catch (err) {
      setAuthError(err.response?.data?.message || err.message);
    } finally {
      setAuthLoading(false);
    }
  };
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setAuth({ token: null, username: null });
  };

  // 내 보유 향수 관련 함수
  const fetchOwnPerfumes = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const response = await axios.get(`${API_BASE_URL}/api/user-perfumes`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = response.data;
      if (data.success) {
        setOwnPerfumeIds(data.data.map(up => up.perfume_id));
      }
    } catch (err) {
      // 무시
    }
  };

  const openOwnDialog = () => {
    setSelectedOwnPerfumeIds(ownPerfumeIds);
    setOwnDialogOpen(true);
  };
  const closeOwnDialog = () => setOwnDialogOpen(false);

  const handleOwnPerfumeToggle = (id) => {
    setSelectedOwnPerfumeIds((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  const handleOwnPerfumeSave = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post(`${API_BASE_URL}/api/user-perfumes`, 
        { perfumeIds: selectedOwnPerfumeIds },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      const data = response.data;
      if (!data.success) throw new Error(data.message || '보유 향수 등록 실패');
      setOwnPerfumeIds(selectedOwnPerfumeIds);
      setOwnDialogOpen(false);
    } catch (err) {
      alert(err.response?.data?.message || err.message || '보유 향수 등록 중 오류가 발생했습니다.');
    }
  };

  // 향수 추가 관련 함수
  const openAddDialog = () => {
    setAddError('');
    setAddDialogOpen(true);
  };
  const closeAddDialog = () => setAddDialogOpen(false);

  // 향수 추가 폼 관련 함수들은 PerfumeForm 컴포넌트로 이동

  const handleAddPerfume = async (formData) => {
    // 필수값 체크
    if (!formData.name || !formData.brand_id) {
      setAddError('향수 이름과 브랜드는 필수입니다.');
      return;
    }
    setAddLoading(true);
    setAddError('');
    try {
      const response = await axios.post(`${API_BASE_URL}/api/perfumes`, formData);
      const data = response.data;
      if (!data.success) throw new Error(data.message || '향수 추가 실패');
      setAddDialogOpen(false);
      fetchPerfumes();
    } catch (err) {
      setAddError(err.response?.data?.message || err.message || '향수 추가 중 오류가 발생했습니다.');
    } finally {
      setAddLoading(false);
    }
  };

  useEffect(() => {
    if (auth.token) {
      fetchPerfumes();
      fetchOwnPerfumes();
    }
    // eslint-disable-next-line
  }, [auth.token]);

  useEffect(() => {
    filterPerfumes();
    // eslint-disable-next-line
  }, [perfumes, searchTerm]);

  const fetchPerfumes = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/perfumes`);
      setPerfumes(response.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const filterPerfumes = () => {
    let filtered = [...perfumes];

    // 검색어 필터링
    if (searchTerm) {
      filtered = filtered.filter(perfume => {
        const nameMatch = perfume.name.toLowerCase().includes(searchTerm.toLowerCase());
        const brandMatch = perfume.PerfumeBrand?.name?.toLowerCase().includes(searchTerm.toLowerCase());
        
        // 새로운 노트 구조와 기존 노트 구조 모두 검색
        const topNotesMatch = perfume.top_notes?.some(note => note.toLowerCase().includes(searchTerm.toLowerCase())) || false;
        const middleNotesMatch = perfume.middle_notes?.some(note => note.toLowerCase().includes(searchTerm.toLowerCase())) || false;
        const baseNotesMatch = perfume.base_notes?.some(note => note.toLowerCase().includes(searchTerm.toLowerCase())) || false;
        const fragranceNotesMatch = perfume.fragrance_notes?.some(note => note.toLowerCase().includes(searchTerm.toLowerCase())) || false;
        const legacyNotesMatch = perfume.notes?.some(note => note.toLowerCase().includes(searchTerm.toLowerCase())) || false;
        
        return nameMatch || brandMatch || topNotesMatch || middleNotesMatch || baseNotesMatch || fragranceNotesMatch || legacyNotesMatch;
      });
    }

    setFilteredPerfumes(filtered);
  };

  const clearFilters = () => {
    setSearchTerm('');
  };



  // 브랜드 리스트 추출 (PerfumeBrand.name 기준)
  const brandList = Array.from(
    new Set(perfumes.map(p => p.PerfumeBrand?.name).filter(Boolean))
  ).sort();

  // 모달 내 필터링된 리스트 생성
  let filteredOwnPerfumes = perfumes.filter(p => {
    const matchName = p.name.toLowerCase().includes(ownSearchTerm.toLowerCase());
    const matchBrand = ownBrand ? p.PerfumeBrand?.name === ownBrand : true;
    return matchName && matchBrand;
  });
  // 보유한 향수가 위로 오도록 정렬
  filteredOwnPerfumes = filteredOwnPerfumes.sort((a, b) => {
    const aOwned = selectedOwnPerfumeIds.includes(a.id) ? 0 : 1;
    const bOwned = selectedOwnPerfumeIds.includes(b.id) ? 0 : 1;
    return aOwned - bOwned;
  });

  if (!auth.token) {
    return (
      <Container maxWidth="xs" sx={{ mt: 12 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Tabs
            value={authTab}
            onChange={handleAuthTabChange}
            centered
            sx={{
              background: '#fff',
              mb: 3,
              minHeight: 36,
              '& .MuiTab-root': {
                minWidth: 100,
                minHeight: 36,
                fontSize: 16,
                mx: 1,
                color: '#888',
                fontWeight: 500,
                transition: 'color 0.2s',
                background: '#fff !important',
              },
              '& .Mui-selected': {
                color: '#1976d2 !important',
                fontWeight: 700,
              },
              '& .MuiTabs-flexContainer': { gap: 2 }
            }}
            TabIndicatorProps={{ style: { height: 3, borderRadius: 2, background: '#1976d2' } }}
          >
            <Tab label="로그인" disableRipple />
            <Tab label="회원가입" disableRipple />
          </Tabs>
          <TextField
            fullWidth
            label="아이디"
            name="username"
            value={authForm.username}
            onChange={handleAuthInput}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="비밀번호"
            name="password"
            type="password"
            value={authForm.password}
            onChange={handleAuthInput}
            sx={{ mb: 2 }}
          />
          {authError && <Alert severity={authError.includes('성공') ? 'success' : 'error'} sx={{ mb: 2 }}>{authError}</Alert>}
          {authTab === 0 ? (
            <Button
              fullWidth
              sx={{ background: '#1976d2', color: 'white', boxShadow: 'none', '&:hover': { background: '#1565c0' } }}
              onClick={handleLogin}
              disabled={authLoading}
            >
              로그인
            </Button>
          ) : (
            <Button
              fullWidth
              sx={{ background: '#1976d2', color: 'white', boxShadow: 'none', '&:hover': { background: '#1565c0' } }}
              onClick={handleRegister}
              disabled={authLoading}
            >
              회원가입
            </Button>
          )}
        </Paper>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Typography variant="subtitle1" sx={{ mr: 2 }}>{auth.username} 님</Typography>
        <Button sx={{ background: '#1976d2 !important', color: 'white !important', boxShadow: 'none !important', '&:hover': { background: '#1565c0 !important' } }} onClick={handleLogout}>로그아웃</Button>
      </Box>
      {/* 헤더 섹션 */}
      <Box textAlign="center" mb={4}>
        <Typography variant="h2" component="h1" gutterBottom color="primary" fontWeight="bold">
          🎭 향수 추천 시스템
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
          당신의 취향과 상황에 맞는 완벽한 향수를 찾아보세요
        </Typography>
      </Box>

      {/* 검색 및 필터 섹션 */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              placeholder="향수명, 브랜드, 노트로 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Button
              fullWidth
              sx={{ background: '#1976d2 !important', color: 'white !important', boxShadow: 'none !important', '&:hover': { background: '#1565c0 !important' } }}
              onClick={clearFilters}
              startIcon={<FilterIcon />}
            >
              초기화
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* 보유 향수 등록 버튼 */}
      <Box mb={4} textAlign="right" display="flex" justifyContent="flex-end" gap={2}>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={openAddDialog}
          sx={{ background: '#1976d2 !important', color: 'white !important', boxShadow: 'none !important', '&:hover': { background: '#1565c0 !important' } }}
        >
          향수 데이터베이스 추가
        </Button>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={openOwnDialog}
          sx={{ background: '#1976d2 !important', color: 'white !important', boxShadow: 'none !important', '&:hover': { background: '#1565c0 !important' } }}
        >
          + 보유 향수 등록
        </Button>
      </Box>

      {/* 내 보유 향수 리스트 */}
      <Box mb={6}>
        <Typography variant="h5" gutterBottom>
          🧴 내 보유 향수 ({filteredPerfumes.filter(p => ownPerfumeIds.includes(p.id)).length})
        </Typography>
        {ownPerfumeIds.length === 0 ? (
          <Typography color="text.secondary">아직 등록된 보유 향수가 없습니다.</Typography>
        ) : filteredPerfumes.filter(p => ownPerfumeIds.includes(p.id)).length === 0 ? (
          <Typography color="text.secondary">검색 조건에 맞는 보유 향수가 없습니다.</Typography>
        ) : (
          <Grid container spacing={3}>
            {filteredPerfumes.filter(p => ownPerfumeIds.includes(p.id)).map((perfume) => (
              <Grid item xs={12} sm={6} md={4} key={perfume.id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: 6,
                      backgroundColor: '#f5faff'
                    }
                  }}
                  onClick={() => navigate(`/perfumes/${perfume.id}`)}
                >
                  <CardContent sx={{ flexGrow: 1, pt: 3 }}>
                    {/* 브랜드 */}
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 1 }}>
                      {perfume.PerfumeBrand?.name || '브랜드 없음'}
                    </Typography>
                    
                    {/* 향수명 */}
                    <Typography variant="h6" component="h2" gutterBottom fontWeight="bold">
                      {perfume.name}
                    </Typography>

                    {/* 주요 노트 */}
                    <Box mb={2}>
                      <NoteDisplay perfume={perfume} showTitle={false} compact={true} />
                    </Box>

                    <Divider sx={{ my: 2 }} />


                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {/* 보유 향수 등록 다이얼로그 */}
      <Dialog open={ownDialogOpen} onClose={closeOwnDialog} maxWidth="md" fullWidth
        PaperProps={{ sx: { minHeight: 600 } }}>
        <DialogTitle sx={{ mb: 3 }}>보유 향수 선택</DialogTitle>
        <DialogContent>
          {/* 검색 영역 */}
          <Box display="flex" gap={2} mb={2}>
            <TextField
              label="이름 검색"
              value={ownSearchTerm}
              onChange={e => setOwnSearchTerm(e.target.value)}
              fullWidth
              margin="normal"
            />
            <FormControl sx={{ minWidth: 180 }} margin="normal">
              <InputLabel>브랜드</InputLabel>
              <Select
                value={ownBrand}
                label="브랜드"
                onChange={e => setOwnBrand(e.target.value)}
              >
                <MenuItem value="">전체</MenuItem>
                {brandList.map(b => (
                  <MenuItem key={b} value={b}>{b}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          {/* 필터링된 리스트 */}
          <List sx={{ maxHeight: 400, overflow: 'auto' }}>
            {filteredOwnPerfumes.map((perfume) => (
              <ListItem key={perfume.id} button onClick={() => handleOwnPerfumeToggle(perfume.id)}>
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    checked={selectedOwnPerfumeIds.includes(perfume.id)}
                    tabIndex={-1}
                    disableRipple
                  />
                </ListItemIcon>
                <ListItemText primary={perfume.name} secondary={perfume.brand} />
              </ListItem>
            ))}
            {filteredOwnPerfumes.length === 0 && (
              <ListItem>
                <ListItemText primary="검색 결과가 없습니다." />
              </ListItem>
            )}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeOwnDialog}>취소</Button>
          <Button onClick={handleOwnPerfumeSave} variant="contained">등록</Button>
        </DialogActions>
      </Dialog>

      {/* 향수 추가 모달 */}
      <PerfumeForm
        open={addDialogOpen}
        onClose={closeAddDialog}
        onSubmit={handleAddPerfume}
        brands={brands}
        loading={addLoading}
        error={addError}
      />
    </Container>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PerfumeList />} />
        <Route path="/perfumes/:id" element={<PerfumeDetailPage />} />
      </Routes>
    </Router>
  );
}

export default App;
