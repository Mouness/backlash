import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../../tests/utils/test-utils';
import AdminCountryDialog from '../../components/organisms/AdminCountryDialog';

describe('AdminCountryDialog', () => {
    const mockOnClose = vi.fn();
    const mockOnSubmit = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders correctly when open', () => {
        render(
            <AdminCountryDialog
                open={true}
                onClose={mockOnClose}
                onSubmit={mockOnSubmit}
            />
        );

        expect(screen.getByText('admin.country.title_new')).toBeInTheDocument();
        // Use getByRole for better consistency with MUI TextFields which might hide labels or rely on aria-label 
        // effectively
        expect(screen.getByRole('textbox', { name: /admin.country.code/i })).toBeInTheDocument();
        // Check for score select (combobox or button depending on MUI version) 
        // We look for the label mostly
        expect(screen.getByLabelText(/admin.country.score/i)).toBeInTheDocument();
    });

    it('validates required fields', async () => {
        render(
            <AdminCountryDialog
                open={true}
                onClose={mockOnClose}
                onSubmit={mockOnSubmit} // Changed from onSave to onSubmit
            />
        );

        const saveButton = screen.getByText('admin.common.save');
        fireEvent.click(saveButton);

        await waitFor(() => {
            // Check for HTML5 validation or form behavior
            // Since we use controlled inputs, we might just check if onSave was NOT called
            expect(mockOnSubmit).not.toHaveBeenCalled();
        });
    });

    it('calls onSave with form data when valid', async () => {
        render(
            <AdminCountryDialog
                open={true}
                onClose={mockOnClose}
                onSubmit={mockOnSubmit}
            />
        );

        // Use more specific selectors or getByRole
        const codeInput = screen.getByRole('textbox', { name: /admin.country.code/i });
        fireEvent.change(codeInput, { target: { value: 'TST' } });

        // Handling tabs might be tricky implicitly, but let's assume default is EN
        // Label format: "admin.common.name (English)"
        const nameInput = screen.getByRole('textbox', { name: /admin.common.name/i });
        fireEvent.change(nameInput, { target: { value: 'Test Land' } });

        // Score Select Interaction
        // 1. Open dropdown
        const scoreSelect = screen.getByLabelText(/admin.country.score/i);
        fireEvent.mouseDown(scoreSelect);
        // 2. Click option (Very Low = 15) -> "admin.country.score_levels.very_high" (mapped from translation key in test?)
        // In verify: t(key) -> key. so we look for key text.
        // Let's select 'admin.country.score_levels.very_high' (90) which corresponds to input '90' or similar logic?
        // Wait, for inputs we set value. For multiselect/select we click options.
        const option = await screen.findByText('admin.country.score_levels.high'); // Value 70
        fireEvent.click(option);

        const saveButton = screen.getByRole('button', { name: /admin.common.save/i });
        fireEvent.click(saveButton);

        await waitFor(() => {
            expect(mockOnSubmit).toHaveBeenCalledWith(expect.objectContaining({
                code: 'TST',
                name: expect.objectContaining({ en: 'Test Land' }),
                score: 70
            }));
        });
    });

    it('pre-fills data when initialData prop is provided', () => {
        const country = {
            id: '1',
            code: 'XYZ',
            name: { en: 'Xyland', fr: '', de: '' },
            summary: { en: '', fr: '', de: '' },
            content: { en: '', fr: '', de: '' }
        };

        render(
            <AdminCountryDialog
                open={true}
                onClose={mockOnClose}
                onSubmit={mockOnSubmit}
                initialData={country}
            />
        );

        expect(screen.getByDisplayValue('XYZ')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Xyland')).toBeInTheDocument();
        expect(screen.getByText(/admin.country.title_edit/i)).toBeInTheDocument();
    });
});
