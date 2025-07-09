import { render, screen } from '@testing-library/react';
import App from './App';

test('renders login button', () => {
  render(<App />);
  const loginButtons = screen.getAllByText(/로그인/i);
  expect(loginButtons.length).toBeGreaterThan(0);
});

test('renders username input field', () => {
  render(<App />);
  const usernameInput = screen.getByLabelText(/아이디/i);
  expect(usernameInput).toBeInTheDocument();
});

test('renders password input field', () => {
  render(<App />);
  const passwordInput = screen.getByLabelText(/비밀번호/i);
  expect(passwordInput).toBeInTheDocument();
});

test('renders signup tab', () => {
  render(<App />);
  const signupTab = screen.getByText(/회원가입/i);
  expect(signupTab).toBeInTheDocument();
});
