import React from 'react';
import { Box, Typography, LinearProgress } from '@mui/material';
import { Palette as PaletteIcon } from '@mui/icons-material';

const AccordDisplay = ({ perfume, showTitle = true, compact = false }) => {
  // 아코드 정보 추출
  const getAccords = () => {
    const accords = [];
    for (let i = 1; i <= 5; i++) {
      const name = perfume[`accord_${i}_name`];
      const width = perfume[`accord_${i}_width`];
      if (name && width !== null && width !== undefined) {
        accords.push({ name, width: parseFloat(width) });
      }
    }
    return accords.sort((a, b) => b.width - a.width); // 너비 순으로 정렬
  };

  const accords = getAccords();

  if (accords.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        아코드 정보가 없습니다.
      </Typography>
    );
  }

  // 아코드 색상 생성
  const getAccordColor = (index) => {
    const colors = [
      '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57',
      '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3', '#ff9f43'
    ];
    return colors[index % colors.length];
  };

  return (
    <Box>
      {showTitle && (
        <Typography 
          variant={compact ? "body2" : "h6"} 
          gutterBottom 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            mb: 2,
            color: 'text.secondary',
            fontWeight: 'bold'
          }}
        >
          <PaletteIcon sx={{ mr: 1, fontSize: compact ? 16 : 20 }} />
          아코드 구성
        </Typography>
      )}
      
      <Box sx={{ width: '100%' }}>
        {accords.map((accord, index) => (
          <Box key={index} sx={{ mb: compact ? 1 : 2 }}>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              mb: 0.5
            }}>
              <Typography 
                variant={compact ? "body2" : "body1"} 
                sx={{ 
                  fontWeight: 'medium',
                  color: getAccordColor(index)
                }}
              >
                {accord.name}
              </Typography>
              <Typography 
                variant={compact ? "caption" : "body2"} 
                sx={{ 
                  fontWeight: 'bold',
                  color: 'text.secondary'
                }}
              >
                {accord.width.toFixed(1)}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={accord.width}
              sx={{
                height: compact ? 4 : 6,
                borderRadius: 2,
                backgroundColor: 'rgba(0,0,0,0.1)',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: getAccordColor(index),
                  borderRadius: 2
                }
              }}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default AccordDisplay; 