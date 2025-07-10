const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8080';

async function testPerfumeDetail() {
  console.log('=== 향수 상세 조회 테스트 ===');
  
  try {
    const response = await fetch(`${API_BASE_URL}/perfumes/1`);
    const data = await response.json();
    
    if (data.success) {
      console.log('✅ 향수 상세 조회 성공');
      console.log('향수 정보:', {
        id: data.data.id,
        brand: data.data.brand,
        name: data.data.name,
        notes: data.data.notes,
        season_tags: data.data.season_tags,
        weather_tags: data.data.weather_tags,
        analysis_reason: data.data.analysis_reason
      });
    } else {
      console.log('❌ 향수 상세 조회 실패:', data.message);
    }
  } catch (error) {
    console.log('❌ 향수 상세 조회 오류:', error.message);
  }
}

async function testSimilarPerfumes() {
  console.log('\n=== 유사 향수 추천 테스트 ===');
  
  try {
    const response = await fetch(`${API_BASE_URL}/perfumes/1/similar`);
    const data = await response.json();
    
    if (data.success) {
      console.log('✅ 유사 향수 추천 성공');
      console.log('대상 향수:', {
        id: data.data.target_perfume.id,
        brand: data.data.target_perfume.brand,
        name: data.data.target_perfume.name,
        notes: data.data.target_perfume.notes
      });
      
      console.log(`유사 향수 개수: ${data.data.similar_perfumes.length}`);
      console.log(`전체 유사 향수 개수: ${data.data.total_similar_count}`);
      
      data.data.similar_perfumes.forEach((similar, index) => {
        console.log(`\n유사 향수 ${index + 1}:`);
        console.log(`  - 이름: ${similar.name}`);
        console.log(`  - 브랜드: ${similar.brand}`);
        console.log(`  - 노트: ${similar.notes.join(', ')}`);
        console.log(`  - 공통 노트: ${similar.common_notes.join(', ')}`);
        console.log(`  - 공통 노트 개수: ${similar.common_notes_count}`);
      });
    } else {
      console.log('❌ 유사 향수 추천 실패:', data.message);
    }
  } catch (error) {
    console.log('❌ 유사 향수 추천 오류:', error.message);
  }
}

async function testErrorCases() {
  console.log('\n=== 에러 케이스 테스트 ===');
  
  // 존재하지 않는 향수 ID 테스트
  try {
    const response = await fetch(`${API_BASE_URL}/perfumes/999999`);
    const data = await response.json();
    
    if (!data.success) {
      console.log('✅ 404 에러 처리 성공:', data.message);
    } else {
      console.log('❌ 404 에러 처리 실패');
    }
  } catch (error) {
    console.log('❌ 404 에러 테스트 오류:', error.message);
  }
  
  // 잘못된 향수 ID 테스트
  try {
    const response = await fetch(`${API_BASE_URL}/perfumes/invalid`);
    const data = await response.json();
    
    if (!data.success) {
      console.log('✅ 잘못된 ID 에러 처리 성공:', data.message);
    } else {
      console.log('❌ 잘못된 ID 에러 처리 실패');
    }
  } catch (error) {
    console.log('❌ 잘못된 ID 에러 테스트 오류:', error.message);
  }
}

async function runAllTests() {
  console.log('향수 상세 페이지 API 테스트 시작\n');
  console.log(`API Base URL: ${API_BASE_URL}\n`);
  
  await testPerfumeDetail();
  await testSimilarPerfumes();
  await testErrorCases();
  
  console.log('\n=== 테스트 완료 ===');
}

// 스크립트 실행
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = {
  testPerfumeDetail,
  testSimilarPerfumes,
  testErrorCases,
  runAllTests
}; 