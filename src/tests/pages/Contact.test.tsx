import { describe, it, expect } from 'vitest';
import { render, screen } from '../utils/test-utils';
import Contact from '../../pages/Contact';

describe('Contact Page', () => {
  it('renders contact form fields', () => {
    render(<Contact />);
    expect(screen.getByRole('heading', { name: 'contact.title' })).toBeInTheDocument();
    expect(screen.getByLabelText('contact.form.name')).toBeInTheDocument();
    expect(screen.getByLabelText('contact.form.email')).toBeInTheDocument();
    expect(screen.getByLabelText('contact.form.message')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'contact.form.send' })).toBeInTheDocument();
  });
});
