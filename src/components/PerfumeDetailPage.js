import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  Button,
  Divider,
  Stack,
  Paper,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Star as StarIcon,
  LocalOffer as LocalOfferIcon,
  WbSunny as WbSunnyIcon,
  Cloud as CloudIcon
} from '@mui/icons-material';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

function PerfumeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [perfume, setPerfume] = useState(null);
  const [similarPerfumes, setSimilarPerfumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 향수 상세 정보 조회
  const fetchPerfumeDetail = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/perfumes/${id}`);
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || '향수 정보를 불러올 수 없습니다.');
      }
      
      setPerfume(data.data);
    } catch (err) {
      setError(err.message);
    }
  }, [id]);

  // 유사 향수 조회
  const fetchSimilarPerfumes = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/perfumes/${id}/similar`);
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || '유사 향수 정보를 불러올 수 없습니다.');
      }
      
      setSimilarPerfumes(data.data.similar_perfumes || []);
    } catch (err) {
      console.error('유사 향수 조회 실패:', err);
      // 유사 향수 조회 실패는 전체 페이지 에러로 처리하지 않음
    }
  }, [id]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        await Promise.all([
          fetchPerfumeDetail(),
          fetchSimilarPerfumes()
        ]);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id, fetchPerfumeDetail, fetchSimilarPerfumes]);

  // 태그 색상 함수
  const getSeasonColor = (season) => {
    const colors = {
      '봄': '#4caf50',
      '여름': '#2196f3',
      '가을': '#ff9800',
      '겨울': '#9c27b0'
    };
    return colors[season] || '#757575';
  };

  const getWeatherColor = (weather) => {
    const colors = {
      '맑음': '#ffc107',
      '흐림': '#607d8b',
      '비': '#2196f3',
      '눈': '#e3f2fd'
    };
    return colors[weather] || '#757575';
  };

  const getNoteColor = (note) => {
    // 노트 타입별 색상 (실제로는 더 정교한 분류가 필요)
    const colors = [
      '#f44336', '#e91e63', '#9c27b0', '#673ab7',
      '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4',
      '#009688', '#4caf50', '#8bc34a', '#cddc39',
      '#ffeb3b', '#ffc107', '#ff9800', '#ff5722'
    ];
    
    const index = note.charCodeAt(0) % colors.length;
    return colors[index];
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/')}
        >
          목록으로 돌아가기
        </Button>
      </Container>
    );
  }

  if (!perfume) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="warning">
          향수 정보를 찾을 수 없습니다.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* 뒤로가기 버튼 */}
      <Button
        variant="outlined"
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/')}
        sx={{ mb: 3 }}
      >
        목록으로 돌아가기
      </Button>

      {/* 향수 헤더 */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {perfume.name}
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          {perfume.PerfumeBrand?.name || '브랜드 없음'}
        </Typography>
        <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
          {/* 상품 링크 버튼 제거됨 */}
        </Box>
      </Paper>

      <Grid container spacing={3}>
        {/* 주요 정보 카드 */}
        <Grid item xs={12} md={8}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LocalOfferIcon sx={{ mr: 1 }} />
                주요 노트
              </Typography>
              <Box sx={{ mb: 3 }}>
                {perfume.notes.map((note, index) => (
                  <Chip
                    key={index}
                    label={note}
                    sx={{
                      m: 0.5,
                      backgroundColor: getNoteColor(note),
                      color: 'white',
                      fontWeight: 'bold'
                    }}
                  />
                ))}
              </Box>

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <WbSunnyIcon sx={{ mr: 1 }} />
                어울리는 계절
              </Typography>
              <Box sx={{ mb: 3 }}>
                {perfume.season_tags.map((season, index) => (
                  <Chip
                    key={index}
                    label={season}
                    sx={{
                      m: 0.5,
                      backgroundColor: getSeasonColor(season),
                      color: 'white',
                      fontWeight: 'bold'
                    }}
                  />
                ))}
              </Box>

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CloudIcon sx={{ mr: 1 }} />
                어울리는 날씨
              </Typography>
              <Box sx={{ mb: 3 }}>
                {perfume.weather_tags.map((weather, index) => (
                  <Chip
                    key={index}
                    label={weather}
                    sx={{
                      m: 0.5,
                      backgroundColor: getWeatherColor(weather),
                      color: 'white',
                      fontWeight: 'bold'
                    }}
                  />
                ))}
              </Box>

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <StarIcon sx={{ mr: 1 }} />
                분석 이유
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                {perfume.analysis_reason}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* 유사 향수 섹션 */}
        <Grid item xs={12} md={4}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <StarIcon sx={{ mr: 1 }} />
                유사한 향수
              </Typography>
              
              {similarPerfumes.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  유사한 향수가 없습니다.
                </Typography>
              ) : (
                <Stack spacing={2}>
                  {similarPerfumes.map((similar) => (
                    <Card key={similar.id} variant="outlined" sx={{ cursor: 'pointer', mb: 2 }} onClick={() => navigate(`/perfumes/${similar.id}`)}>
                      <CardContent sx={{ py: 2, '&:last-child': { pb: 2 } }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Box>
                            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                              {similar.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              {similar.PerfumeBrand?.name || '브랜드 없음'}
                            </Typography>
                          </Box>
                          <Box textAlign="right">
                            <span style={{
                              display: 'inline-block',
                              background: '#52c41a',
                              color: 'white',
                              borderRadius: 8,
                              padding: '2px 8px',
                              fontSize: 12
                            }}>
                              유사도: {similar.common_notes_count}개
                            </span>
                          </Box>
                        </Box>
                        {/* 공통 노트 표시 */}
                        {similar.common_notes && similar.common_notes.length > 0 && (
                          <div style={{ marginTop: 8 }}>
                            <strong>공통 노트:</strong>
                            <div style={{ marginTop: 4 }}>
                              {similar.common_notes.map((note, noteIndex) => (
                                <span key={noteIndex} style={{
                                  display: 'inline-block',
                                  background: '#1976d2',
                                  color: 'white',
                                  borderRadius: 8,
                                  padding: '2px 8px',
                                  marginRight: 4,
                                  marginBottom: 4,
                                  fontSize: 12
                                }}>{note}</span>
                              ))}
                            </div>
                          </div>
                        )}
                        {/* 전체 노트 표시 */}
                        <div style={{ marginTop: 8 }}>
                          <strong>전체 노트:</strong>
                          <div style={{ marginTop: 4 }}>
                            {similar.notes.map((note, noteIndex) => (
                              <span key={noteIndex} style={{
                                display: 'inline-block',
                                background: '#888',
                                color: 'white',
                                borderRadius: 8,
                                padding: '2px 8px',
                                marginRight: 4,
                                marginBottom: 4,
                                fontSize: 12
                              }}>{note}</span>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default PerfumeDetailPage; 