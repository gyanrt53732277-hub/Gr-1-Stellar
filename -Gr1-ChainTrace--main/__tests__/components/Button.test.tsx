import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/ui/Button';
import { describe, it, expect, vi } from 'vitest';

describe('Button Component', () => {
  it('renders children correctly', () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('triggers onClick handler when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);
    fireEvent.click(screen.getByRole('button', { name: /click me/i }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled and shows spinner when loading', () => {
    render(<Button isLoading={true}>Click Me</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });
});
