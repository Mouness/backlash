import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../../tests/utils/test-utils';
import Contact from '../../pages/Contact';

// Mock translation to return keys
vi.mock('react-i18next', async () => {
  const actual = await vi.importActual('react-i18next');
  return {
    ...actual,
    useTranslation: () => ({
      t: (key: string) => key,
    }),
  };
});

// Mock contact service
const mockAddMessage = vi.fn().mockResolvedValue('new-id');

vi.mock('../../services/contactService', () => ({
  contactService: {
    addMessage: (data: unknown) => mockAddMessage(data),
  },
}));

describe('Contact Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders contact form fields', () => {
    render(<Contact />);
    expect(screen.getByText('contact.title')).toBeInTheDocument();

    // Check fields exist
    expect(screen.getByLabelText('contact.form.name')).toBeInTheDocument();
    expect(screen.getByLabelText('contact.form.email')).toBeInTheDocument();
    expect(screen.getByLabelText('contact.form.subject')).toBeInTheDocument();
    expect(screen.getByLabelText('contact.form.message')).toBeInTheDocument();
  });

  it('fills and submits the form successfully', async () => {
    render(<Contact />);

    // Fill Form
    fireEvent.change(screen.getByLabelText('contact.form.name'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText('contact.form.email'), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText('contact.form.subject'), { target: { value: 'Test Subject' } });
    fireEvent.change(screen.getByLabelText('contact.form.message'), { target: { value: 'Hello World' } });

    // Submit
    const submitBtn = screen.getByText('contact.form.send');
    fireEvent.click(submitBtn);

    // Verify service call
    await waitFor(() => {
      expect(mockAddMessage).toHaveBeenCalled();
      const data = mockAddMessage.mock.calls[0][0];
      expect(data).toMatchObject({
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Test Subject',
        message: 'Hello World',
      });
    });

    // Verify success message
    expect(screen.getByText('contact.form.success')).toBeInTheDocument();
  });

  it('displays validation errors for invalid email', async () => {
    render(<Contact />);

    fireEvent.change(screen.getByLabelText('contact.form.email'), { target: { value: 'invalid-email' } });
    const submitBtn = screen.getByText('contact.form.send');
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText('contact.form.invalid_email')).toBeInTheDocument();
    });

    expect(mockAddMessage).not.toHaveBeenCalled();
  });
});
