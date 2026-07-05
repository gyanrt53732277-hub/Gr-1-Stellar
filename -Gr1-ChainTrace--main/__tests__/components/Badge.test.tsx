import { render, screen } from '@testing-library/react'; 
import { Badge } from '@/components/ui/Badge';
import { describe, it, expect } from 'vitest';

describe('Badge Component', () => {
  it('renders the correct label for created status', () => {
    render(<Badge status="created" />);
    expect(screen.getByText('Created')).toBeInTheDocument();
  });

  it('renders the correct label for funded status', () => {
    render(<Badge status="funded" />);
    expect(screen.getByText('Funded')).toBeInTheDocument();
  });

  it('renders the correct label for refunded status', () => {
    render(<Badge status="refunded" />);
    expect(screen.getByText('Refunded')).toBeInTheDocument();
  });
});
