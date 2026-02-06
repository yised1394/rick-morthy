import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge, getStatusVariant } from '@/shared/components/ui/badge';

describe('Badge', () => {
  it('renders children correctly', () => {
    render(<Badge>Test Badge</Badge>);
    
    expect(screen.getByText('Test Badge')).toBeInTheDocument();
  });

  it('applies default variant classes', () => {
    const { container } = render(<Badge>Default</Badge>);
    
    const badge = container.firstChild;
    expect(badge).toHaveClass('bg-neutral-100');
    expect(badge).toHaveClass('text-neutral-700');
  });

  it('applies alive variant classes', () => {
    const { container } = render(<Badge variant="alive">Alive</Badge>);
    
    const badge = container.firstChild;
    expect(badge).toHaveClass('badge-alive');
  });

  it('applies dead variant classes', () => {
    const { container } = render(<Badge variant="dead">Dead</Badge>);
    
    const badge = container.firstChild;
    expect(badge).toHaveClass('badge-dead');
  });

  it('applies unknown variant classes', () => {
    const { container } = render(<Badge variant="unknown">Unknown</Badge>);
    
    const badge = container.firstChild;
    expect(badge).toHaveClass('badge-unknown');
  });

  it('applies custom className', () => {
    const { container } = render(<Badge className="custom-class">Custom</Badge>);
    
    const badge = container.firstChild;
    expect(badge).toHaveClass('custom-class');
  });
});

describe('getStatusVariant', () => {
  it('returns alive for Alive status', () => {
    expect(getStatusVariant('Alive')).toBe('alive');
  });

  it('returns dead for Dead status', () => {
    expect(getStatusVariant('Dead')).toBe('dead');
  });

  it('returns unknown for unknown status', () => {
    expect(getStatusVariant('unknown')).toBe('unknown');
  });

  it('returns unknown for other status', () => {
    expect(getStatusVariant('other')).toBe('unknown');
  });

  it('handles case-insensitive matching', () => {
    expect(getStatusVariant('ALIVE')).toBe('alive');
    expect(getStatusVariant('dead')).toBe('dead');
  });
});
