import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  Box,
  Typography,
  Alert,
  Grid,
  Divider
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';

const PerfumeForm = ({ 
  open, 
  onClose, 
  onSubmit, 
  perfume = null, 
  brands = [], 
  loading = false, 
  error = '' 
}) => {
  const [form, setForm] = useState({
    name: '',
    brand_id: '',
    top_notes: [],
    middle_notes: [],
    base_notes: [],
    accord_1_name: '',
    accord_1_width: '',
    accord_2_name: '',
    accord_2_width: '',
    accord_3_name: '',
    accord_3_width: '',
    accord_4_name: '',
    accord_4_width: '',
    accord_5_name: '',
    accord_5_width: '',

  });

  // 편집 모드일 때 기존 데이터로 폼 초기화
  useEffect(() => {
    if (perfume) {
      setForm({
        name: perfume.name || '',
        brand_id: perfume.brand_id || '',
        top_notes: perfume.top_notes || [],
        middle_notes: perfume.middle_notes || [],
        base_notes: perfume.base_notes || [],
        accord_1_name: perfume.accord_1_name || '',
        accord_1_width: perfume.accord_1_width || '',
        accord_2_name: perfume.accord_2_name || '',
        accord_2_width: perfume.accord_2_width || '',
        accord_3_name: perfume.accord_3_name || '',
        accord_3_width: perfume.accord_3_width || '',
        accord_4_name: perfume.accord_4_name || '',
        accord_4_width: perfume.accord_4_width || '',
        accord_5_name: perfume.accord_5_name || '',
        accord_5_width: perfume.accord_5_width || '',

      });
    } else {
      // 새로 추가하는 경우 폼 초기화
      setForm({
        name: '',
        brand_id: '',
        top_notes: [],
        middle_notes: [],
        base_notes: [],
        accord_1_name: '',
        accord_1_width: '',
        accord_2_name: '',
        accord_2_width: '',
        accord_3_name: '',
        accord_3_width: '',
        accord_4_name: '',
        accord_4_width: '',
        accord_5_name: '',
        accord_5_width: '',

      });
    }
  }, [perfume, open]);

  const handleFormChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleAccordChange = (index, field, value) => {
    const fieldName = `accord_${index}_${field}`;
    setForm(prev => ({ ...prev, [fieldName]: value }));
  };

  const handleSubmit = () => {
    // 필수값 검증
    if (!form.name || !form.brand_id) {
      return;
    }

    // fragrance_notes 자동 생성 (모든 노트 합치기)
    const allNotes = [
      ...form.top_notes,
      ...form.middle_notes,
      ...form.base_notes
    ].filter(Boolean);

    const submitData = {
      ...form,
      fragrance_notes: allNotes
    };

    onSubmit(submitData);
  };

  const addAccord = () => {
    // 빈 아코드 슬롯 찾기
    for (let i = 1; i <= 5; i++) {
      if (!form[`accord_${i}_name`] && !form[`accord_${i}_width`]) {
        handleAccordChange(i, 'name', '');
        handleAccordChange(i, 'width', '');
        break;
      }
    }
  };

  const removeAccord = (index) => {
    handleAccordChange(index, 'name', '');
    handleAccordChange(index, 'width', '');
  };

  const getActiveAccords = () => {
    const accords = [];
    for (let i = 1; i <= 5; i++) {
      if (form[`accord_${i}_name`] || form[`accord_${i}_width`]) {
        accords.push({
          index: i,
          name: form[`accord_${i}_name`],
          width: form[`accord_${i}_width`]
        });
      }
    }
    return accords;
  };

  const activeAccords = getActiveAccords();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {perfume ? '향수 수정' : '향수 등록'}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          {/* 기본 정보 */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              기본 정보
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="향수 이름"
              value={form.name}
              onChange={(e) => handleFormChange('name', e.target.value)}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth required>
              <InputLabel>브랜드</InputLabel>
              <Select
                value={form.brand_id}
                label="브랜드"
                onChange={(e) => handleFormChange('brand_id', e.target.value)}
              >
                {brands.map(brand => (
                  <MenuItem key={brand.id} value={brand.id}>
                    {brand.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
          </Grid>

          {/* 노트 정보 */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              향 노트
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Autocomplete
              multiple
              freeSolo
              options={[]}
              value={form.top_notes}
              onChange={(_, value) => handleFormChange('top_notes', value)}
              renderInput={(params) => (
                <TextField {...params} label="탑 노트" />
              )}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Autocomplete
              multiple
              freeSolo
              options={[]}
              value={form.middle_notes}
              onChange={(_, value) => handleFormChange('middle_notes', value)}
              renderInput={(params) => (
                <TextField {...params} label="미들 노트" />
              )}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Autocomplete
              multiple
              freeSolo
              options={[]}
              value={form.base_notes}
              onChange={(_, value) => handleFormChange('base_notes', value)}
              renderInput={(params) => (
                <TextField {...params} label="베이스 노트" />
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
          </Grid>

          {/* 아코드 정보 */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">
                아코드 구성
              </Typography>
              {activeAccords.length < 5 && (
                <Button
                  startIcon={<AddIcon />}
                  onClick={addAccord}
                  size="small"
                >
                  아코드 추가
                </Button>
              )}
            </Box>
          </Grid>
          
          {activeAccords.map((accord) => (
            <Grid item xs={12} md={6} key={accord.index}>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                <TextField
                  label="아코드 이름"
                  value={accord.name}
                  onChange={(e) => handleAccordChange(accord.index, 'name', e.target.value)}
                  sx={{ flex: 1 }}
                />
                <TextField
                  label="비율 (%)"
                  type="number"
                  value={accord.width}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value);
                    if (value >= 0 && value <= 100) {
                      handleAccordChange(accord.index, 'width', value);
                    }
                  }}
                  inputProps={{ min: 0, max: 100, step: 0.1 }}
                  sx={{ width: 100 }}
                />
                <Button
                  onClick={() => removeAccord(accord.index)}
                  color="error"
                  size="small"
                  sx={{ minWidth: 'auto', p: 1 }}
                >
                  <DeleteIcon />
                </Button>
              </Box>
            </Grid>
          ))}

          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
          </Grid>



          {error && (
            <Grid item xs={12}>
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            </Grid>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>취소</Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          disabled={loading || !form.name || !form.brand_id}
        >
          {loading ? '처리 중...' : (perfume ? '수정' : '등록')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PerfumeForm; 