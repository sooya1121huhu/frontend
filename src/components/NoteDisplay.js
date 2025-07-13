import React from 'react';
import { Box, Typography, Chip, Stack } from '@mui/material';
import {
  TrendingUp as TopIcon,
  Remove as MiddleIcon,
  TrendingDown as BaseIcon
} from '@mui/icons-material';

const NoteDisplay = ({ perfume, showTitle = true, compact = false }) => {
  const topNotes = perfume.top_notes || [];
  const middleNotes = perfume.middle_notes || [];
  const baseNotes = perfume.base_notes || [];
  const fragranceNotes = Array.isArray(perfume.fragrance_notes) ? perfume.fragrance_notes : [];

  // 하위 호환성을 위해 기존 notes 필드도 확인
  const legacyNotes = perfume.notes || [];

  // 노트 타입별 색상
  const getNoteTypeColor = (type) => {
    const colors = {
      top: '#ff6b6b',      // 빨간색 계열 (탑 노트)
      middle: '#4ecdc4',   // 청록색 계열 (미들 노트)
      base: '#45b7d1'      // 파란색 계열 (베이스 노트)
    };
    return colors[type] || '#888';
  };

  // 노트 타입별 아이콘
  const getNoteTypeIcon = (type) => {
    const icons = {
      top: <TopIcon sx={{ fontSize: 16 }} />,
      middle: <MiddleIcon sx={{ fontSize: 16 }} />,
      base: <BaseIcon sx={{ fontSize: 16 }} />
    };
    return icons[type];
  };

  // 노트 섹션 렌더링
  const renderNoteSection = (notes, type, title) => {
    if (!notes || notes.length === 0) return null;

    return (
      <Box sx={{ mb: compact ? 1 : 2 }}>
        {showTitle && (
          <Typography 
            variant={compact ? "body2" : "h6"} 
            gutterBottom 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              mb: 1,
              color: 'text.secondary',
              fontWeight: 'bold'
            }}
          >
            {getNoteTypeIcon(type)}
            <Box component="span" sx={{ ml: 0.5 }}>
              {title}
            </Box>
          </Typography>
        )}
        <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
          {notes.map((note, index) => (
            <Chip
              key={index}
              label={note}
              size={compact ? "small" : "medium"}
              variant="outlined"
              sx={{
                mb: 0.5,
                borderColor: getNoteTypeColor(type),
                color: getNoteTypeColor(type),
                '&:hover': {
                  backgroundColor: getNoteTypeColor(type),
                  color: 'white'
                }
              }}
            />
          ))}
        </Stack>
      </Box>
    );
  };

  // 하위 호환성을 위한 기존 노트 표시
  const renderLegacyNotes = () => {
    if (legacyNotes.length === 0) return null;

    return (
      <Box sx={{ mb: compact ? 1 : 2 }}>
        {showTitle && (
          <Typography 
            variant={compact ? "body2" : "h6"} 
            gutterBottom 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              mb: 1,
              color: 'text.secondary',
              fontWeight: 'bold'
            }}
          >
            주요 노트
          </Typography>
        )}
        <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
          {legacyNotes.map((note, index) => (
            <Chip
              key={index}
              label={note}
              size={compact ? "small" : "medium"}
              variant="outlined"
              sx={{
                mb: 0.5,
                borderColor: '#888',
                color: '#666'
              }}
            />
          ))}
        </Stack>
      </Box>
    );
  };

  // 새로운 노트 구조가 있는지 확인
  const hasNewNoteStructure = topNotes.length > 0 || middleNotes.length > 0 || baseNotes.length > 0;
  const hasLegacyNotes = legacyNotes.length > 0;

  // 새로운 구조가 있으면 새로운 구조 사용, 없으면 기존 구조 사용
  if (hasNewNoteStructure) {
    return (
      <Box>
        {renderNoteSection(topNotes, 'top', '탑 노트')}
        {renderNoteSection(middleNotes, 'middle', '미들 노트')}
        {renderNoteSection(baseNotes, 'base', '베이스 노트')}
      </Box>
    );
  } else if (hasLegacyNotes) {
    return renderLegacyNotes();
  } else {
    return (
      <Typography variant="body2" color="text.secondary">
        노트 정보가 없습니다.
      </Typography>
    );
  }
};

export default NoteDisplay; 