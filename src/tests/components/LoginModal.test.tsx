import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginModal from '../../components/organisms/LoginModal';
import { BrowserRouter } from 'react-router-dom';

// Mock the useAuth hook
const mockLogin = vi.fn();

vi.mock('../../contexts/AuthContext', async () => {
    return {
        useAuth: () => ({
            login: mockLogin,
            currentUser: null,
            loading: false
        }),
    };
});

describe('LoginModal', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders login form when open', () => {
        render(
            <BrowserRouter>
                <LoginModal open={true} onClose={vi.fn()} />
            </BrowserRouter>
        );
        expect(screen.getByLabelText(/login_form.email_label/i)).toBeInTheDocument();
        const passwordInput = document.querySelector('input[name="password"]');
        expect(passwordInput).toBeInTheDocument();
    });

    it('calls login on submit', async () => {
        render(
            <BrowserRouter>
                <LoginModal open={true} onClose={vi.fn()} />
            </BrowserRouter>
        );

        const emailInput = screen.getByLabelText(/login_form.email_label/i);
        // Use selector to avoid ambiguity with "toggle password visibility" button
        const passwordInput = document.querySelector('input[name="password"]') as HTMLInputElement;
        const submitButton = screen.getByRole('button', { name: /login_form.submit/i });

        fireEvent.change(emailInput, { target: { value: 'test@test.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });

        // Check if button text is correct
        expect(submitButton).toBeInTheDocument();

        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(mockLogin).toHaveBeenCalledWith('test@test.com', 'password123');
        });
    });
});
