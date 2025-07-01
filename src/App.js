import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [apiStatus, setApiStatus] = useState(null);
  const [healthData, setHealthData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_BASE_URL = 'http://localhost:3000';

  const checkApiStatus = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/`);
      setApiStatus(response.data);
    } catch (err) {
      setError('API 서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.');
    } finally {
      setLoading(false);
    }
  };

  const checkHealth = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/health`);
      setHealthData(response.data);
    } catch (err) {
      setError('헬스 체크에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // 컴포넌트가 마운트될 때 API 상태 확인
    checkApiStatus();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>React + API 연동 테스트</h1>
        
        <div className="api-section">
          <h2>API 서버 상태</h2>
          {loading && <p>로딩 중...</p>}
          {error && <p className="error">{error}</p>}
          {apiStatus && (
            <div className="status-card">
              <h3>서버 응답:</h3>
              <p><strong>메시지:</strong> {apiStatus.message}</p>
              <p><strong>시간:</strong> {new Date(apiStatus.timestamp).toLocaleString()}</p>
            </div>
          )}
          <button onClick={checkApiStatus} disabled={loading}>
            API 상태 다시 확인
          </button>
        </div>

        <div className="api-section">
          <h2>헬스 체크</h2>
          {healthData && (
            <div className="status-card">
              <h3>헬스 정보:</h3>
              <p><strong>상태:</strong> {healthData.status}</p>
              <p><strong>업타임:</strong> {Math.round(healthData.uptime)}초</p>
              <p><strong>시간:</strong> {new Date(healthData.timestamp).toLocaleString()}</p>
            </div>
          )}
          <button onClick={checkHealth} disabled={loading}>
            헬스 체크 실행
          </button>
        </div>

        <div className="instructions">
          <h3>사용 방법:</h3>
          <ol>
            <li>API 서버가 포트 3000에서 실행 중인지 확인하세요</li>
            <li>위의 버튼들을 클릭해서 API와의 연동을 테스트하세요</li>
            <li>서버가 실행되지 않은 경우 에러 메시지가 표시됩니다</li>
          </ol>
        </div>
      </header>
    </div>
  );
}

export default App;
