import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../utils/test-utils';
import Contact from '../../pages/Contact';
import { contactService } from '../../services/contactService';

// Partial mock
vi.mock('../../services/contactService', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    // @ts-ignore
    ...actual,
    contactService: {
      addMessage: vi.fn().mockResolvedValue(undefined)
    }
  }
});

describe('Contact Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders contact form fields', () => {
    render(<Contact />);
    expect(screen.getByRole('heading', { name: 'nav.contact' })).toBeInTheDocument();
    expect(screen.getByLabelText('contact.form.name')).toBeInTheDocument();
    expect(screen.getByLabelText('contact.form.email')).toBeInTheDocument();
    expect(screen.getByLabelText('contact.form.subject')).toBeInTheDocument();
    expect(screen.getByLabelText('contact.form.message')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'contact.form.send' })).toBeInTheDocument();
  });

  it('submits form with valid data', async () => {
    render(<Contact />);

    fireEvent.change(screen.getByLabelText('contact.form.name'), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText('contact.form.email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('contact.form.subject'), { target: { value: 'Test Subject' } });
    fireEvent.change(screen.getByLabelText('contact.form.message'), { target: { value: 'Hello World' } });

    const submitBtn = screen.getByRole('button', { name: 'contact.form.send' });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(contactService.addMessage).toHaveBeenCalledWith({
        name: 'Test User',
        email: 'test@example.com',
        subject: 'Test Subject',
        message: 'Hello World'
      });
    });
  });
});
