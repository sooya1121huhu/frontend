import React, { useState, useEffect } from 'react';
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
  IconButton,
  Tooltip,
  Tabs,
  Tab
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon
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
import './App.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

function App() {
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
  const [selectedSeason, setSelectedSeason] = useState('');
  const [selectedWeather, setSelectedWeather] = useState('');
  const [favorites, setFavorites] = useState([]);

  // 내 보유 향수 관련 상태
  const [ownPerfumeIds, setOwnPerfumeIds] = useState([]);
  const [selectedOwnPerfumeIds, setSelectedOwnPerfumeIds] = useState([]);
  const [ownDialogOpen, setOwnDialogOpen] = useState(false);
  const [ownSearchTerm, setOwnSearchTerm] = useState('');
  const [ownBrand, setOwnBrand] = useState('');

  // 향수 추가 관련 상태
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [addForm, setAddForm] = useState({
    name: '',
    url: '',
    brand: '',
    notes: [],
    season_tags: [],
    weather_tags: [],
    analysis_reason: ''
  });
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState('');

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
      const res = await fetch(`${API_BASE_URL}/api/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(authForm)
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      localStorage.setItem('token', data.token);
      localStorage.setItem('username', authForm.username);
      setAuth({ token: data.token, username: authForm.username });
    } catch (err) {
      setAuthError(err.message);
    } finally {
      setAuthLoading(false);
    }
  };
  const handleRegister = async () => {
    setAuthLoading(true);
    setAuthError('');
    try {
      const res = await fetch(`${API_BASE_URL}/api/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(authForm)
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      setAuthTab(0);
      setAuthForm({ username: authForm.username, password: '' });
      setAuthError('회원가입 성공! 로그인 해주세요.');
    } catch (err) {
      setAuthError(err.message);
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
      const res = await fetch(`${API_BASE_URL}/api/user-perfumes`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
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
      const res = await fetch(`${API_BASE_URL}/api/user-perfumes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ perfumeIds: selectedOwnPerfumeIds })
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || '보유 향수 등록 실패');
      setOwnPerfumeIds(selectedOwnPerfumeIds);
      setOwnDialogOpen(false);
    } catch (err) {
      alert(err.message || '보유 향수 등록 중 오류가 발생했습니다.');
    }
  };

  // 향수 추가 관련 함수
  const openAddDialog = () => {
    setAddForm({
      name: '', url: '', brand: '', notes: [], season_tags: [], weather_tags: [], analysis_reason: ''
    });
    setAddError('');
    setAddDialogOpen(true);
  };
  const closeAddDialog = () => setAddDialogOpen(false);

  const handleAddFormChange = (field, value) => {
    setAddForm(prev => ({ ...prev, [field]: value }));
  };

  const handleAddPerfume = async () => {
    // 필수값 체크
    if (!addForm.name || !addForm.brand || !addForm.notes.length || !addForm.season_tags.length || !addForm.weather_tags.length || !addForm.analysis_reason) {
      setAddError('모든 필수 항목을 입력해주세요.');
      return;
    }
    setAddLoading(true);
    setAddError('');
    try {
      const res = await fetch(`${API_BASE_URL}/api/perfumes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(addForm)
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || '향수 추가 실패');
      setAddDialogOpen(false);
      fetchPerfumes();
    } catch (err) {
      setAddError(err.message || '향수 추가 중 오류가 발생했습니다.');
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
  }, [perfumes, searchTerm, selectedSeason, selectedWeather]);

  const fetchPerfumes = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/perfumes`);
      if (!response.ok) {
        throw new Error('향수 데이터를 불러오는데 실패했습니다.');
      }
      const result = await response.json();
      setPerfumes(result.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filterPerfumes = () => {
    let filtered = [...perfumes];

    // 검색어 필터링
    if (searchTerm) {
      filtered = filtered.filter(perfume =>
        perfume.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        perfume.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        perfume.notes.some(note => note.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // 계절 필터링
    if (selectedSeason) {
      filtered = filtered.filter(perfume =>
        perfume.season_tags.includes(selectedSeason)
      );
    }

    // 날씨 필터링
    if (selectedWeather) {
      filtered = filtered.filter(perfume =>
        perfume.weather_tags.includes(selectedWeather)
      );
    }

    setFilteredPerfumes(filtered);
  };

  const toggleFavorite = (perfumeId) => {
    setFavorites(prev => 
      prev.includes(perfumeId) 
        ? prev.filter(id => id !== perfumeId)
        : [...prev, perfumeId]
    );
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedSeason('');
    setSelectedWeather('');
  };

  const getSeasonColor = (season) => {
    const colors = {
      '봄': '#FFB6C1',
      '여름': '#87CEEB',
      '가을': '#DDA0DD',
      '겨울': '#F0F8FF'
    };
    return colors[season] || '#E0E0E0';
  };

  // 브랜드 리스트 추출
  const brandList = Array.from(new Set(perfumes.map(p => p.brand))).sort();

  // 모달 내 필터링된 리스트 생성
  let filteredOwnPerfumes = perfumes.filter(p => {
    const matchName = p.name.toLowerCase().includes(ownSearchTerm.toLowerCase());
    const matchBrand = ownBrand ? p.brand === ownBrand : true;
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
          <Grid item xs={12} md={4}>
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
          <Grid item xs={12} md={3}>
            <FormControl fullWidth sx={{ minWidth: 180 }}>
              <InputLabel>계절</InputLabel>
              <Select
                value={selectedSeason}
                label="계절"
                onChange={(e) => setSelectedSeason(e.target.value)}
                sx={{ minWidth: 180 }}
              >
                <MenuItem value="">전체</MenuItem>
                <MenuItem value="봄">봄</MenuItem>
                <MenuItem value="여름">여름</MenuItem>
                <MenuItem value="가을">가을</MenuItem>
                <MenuItem value="겨울">겨울</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth sx={{ minWidth: 180 }}>
              <InputLabel>날씨</InputLabel>
              <Select
                value={selectedWeather}
                label="날씨"
                onChange={(e) => setSelectedWeather(e.target.value)}
                sx={{ minWidth: 180 }}
              >
                <MenuItem value="">전체</MenuItem>
                <MenuItem value="맑음">맑음</MenuItem>
                <MenuItem value="흐림">흐림</MenuItem>
                <MenuItem value="비">비</MenuItem>
                <MenuItem value="더움">더움</MenuItem>
                <MenuItem value="추움">추움</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
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
                    cursor: perfume.url ? 'pointer' : 'default',
                    '&:hover': {
                      transform: perfume.url ? 'translateY(-8px)' : 'none',
                      boxShadow: perfume.url ? 6 : undefined,
                      backgroundColor: perfume.url ? '#f5faff' : undefined
                    }
                  }}
                  onClick={() => {
                    if (perfume.url) window.open(perfume.url, '_blank', 'noopener');
                  }}
                >
                  <CardContent sx={{ flexGrow: 1, pt: 3 }}>
                    {/* 브랜드 */}
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 1 }}>
                      {perfume.brand}
                    </Typography>
                    
                    {/* 향수명 */}
                    <Typography variant="h6" component="h2" gutterBottom fontWeight="bold">
                      {perfume.name}
                    </Typography>

                    {/* 주요 노트 */}
                    <Box mb={2}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        주요 노트
                      </Typography>
                      <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                        {perfume.notes.map((note, index) => (
                          <Chip
                            key={index}
                            label={note}
                            size="small"
                            variant="outlined"
                            sx={{ mb: 0.5 }}
                          />
                        ))}
                      </Stack>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    {/* 계절 및 날씨 태그 */}
                    <Box mb={2}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        어울리는 상황
                      </Typography>
                      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                        {perfume.season_tags.map((season, index) => (
                          <Chip
                            key={index}
                            label={season}
                            size="small"
                            sx={{
                              backgroundColor: getSeasonColor(season),
                              color: 'white',
                              fontWeight: 'bold'
                            }}
                          />
                        ))}
                        {perfume.weather_tags.map((weather, index) => (
                          <Chip
                            key={index}
                            label={weather}
                            size="small"
                            variant="outlined"
                            sx={{ mb: 0.5 }}
                          />
                        ))}
                      </Stack>
                    </Box>

                    {/* 분석 이유 */}
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      {perfume.analysis_reason}
                    </Typography>
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
      <Dialog open={addDialogOpen} onClose={closeAddDialog} maxWidth="sm" fullWidth>
        <DialogTitle>향수 데이터베이스 추가</DialogTitle>
        <DialogContent>
          <TextField
            label="향수 이름"
            value={addForm.name}
            onChange={e => handleAddFormChange('name', e.target.value)}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="상세 정보 URL"
            value={addForm.url}
            onChange={e => handleAddFormChange('url', e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="브랜드"
            value={addForm.brand}
            onChange={e => handleAddFormChange('brand', e.target.value)}
            fullWidth
            required
            margin="normal"
          />
          <Autocomplete
            multiple
            freeSolo
            options={[]}
            value={addForm.notes}
            onChange={(_, value) => handleAddFormChange('notes', value)}
            renderInput={(params) => (
              <TextField {...params} label="주요 노트 (쉼표 없이 엔터로 구분)" margin="normal" required />
            )}
            sx={{ mb: 2 }}
          />
          <Autocomplete
            multiple
            options={["봄", "여름", "가을", "겨울"]}
            value={addForm.season_tags}
            onChange={(_, value) => handleAddFormChange('season_tags', value)}
            renderInput={(params) => (
              <TextField {...params} label="어울리는 계절" margin="normal" required />
            )}
            sx={{ mb: 2 }}
          />
          <Autocomplete
            multiple
            options={["맑음", "흐림", "비", "눈", "더움", "추움", "선선함", "습함", "따뜻함", "쌀쌀함"]}
            value={addForm.weather_tags}
            onChange={(_, value) => handleAddFormChange('weather_tags', value)}
            renderInput={(params) => (
              <TextField {...params} label="어울리는 날씨" margin="normal" required />
            )}
            sx={{ mb: 2 }}
          />
          <TextField
            label="분석 이유"
            value={addForm.analysis_reason}
            onChange={e => handleAddFormChange('analysis_reason', e.target.value)}
            fullWidth
            required
            multiline
            minRows={3}
            margin="normal"
          />
          {addError && <Box color="error.main" mb={2}>{addError}</Box>}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeAddDialog}>취소</Button>
          <Button onClick={handleAddPerfume} variant="contained" disabled={addLoading}>
            {addLoading ? '등록 중...' : '등록'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default App;
