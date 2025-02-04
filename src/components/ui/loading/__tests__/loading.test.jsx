import React from 'react';
import { render, screen } from '@testing-library/react';
import LoadingSpinner from '../LoadingSpinner';
import LoadingScreen from '../LoadingScreen';
import LoadingOverlay from '../LoadingOverlay';

describe('Loading Components', () => {
  describe('LoadingSpinner', () => {
    it('renders with default size', () => {
      const { container } = render(<LoadingSpinner />);
      expect(container.firstChild).toHaveClass('w-8 h-8');
    });

    it('renders with custom size', () => {
      const { container } = render(<LoadingSpinner size="large" />);
      expect(container.firstChild).toHaveClass('w-12 h-12');
    });
  });

  describe('LoadingScreen', () => {
    it('renders with default message', () => {
      render(<LoadingScreen />);
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('renders with custom message', () => {
      render(<LoadingScreen message="Custom loading message" />);
      expect(screen.getByText('Custom loading message')).toBeInTheDocument();
    });
  });

  describe('LoadingOverlay', () => {
    it('renders children when not loading', () => {
      render(
        <LoadingOverlay isLoading={false}>
          <div>Content</div>
        </LoadingOverlay>
      );
      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('renders spinner and children when loading', () => {
      render(
        <LoadingOverlay isLoading={true}>
          <div>Content</div>
        </LoadingOverlay>
      );
      expect(screen.getByText('Content')).toBeInTheDocument();
      expect(document.querySelector('.animate-spin')).toBeInTheDocument();
    });
  });
});