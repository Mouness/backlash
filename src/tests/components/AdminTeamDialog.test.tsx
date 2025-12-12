import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../../tests/utils/test-utils';
import AdminTeamDialog from '../../components/organisms/AdminTeamDialog';

describe('AdminTeamDialog', () => {
    const mockOnClose = vi.fn();
    const mockOnSave = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders correctly for new member', () => {
        render(
            <AdminTeamDialog
                open={true}
                onClose={mockOnClose}
                onSave={mockOnSave}
            />
        );

        expect(screen.getByText('admin.team.title_new')).toBeInTheDocument();
        // Just check for one of the fields to verify render
        expect(screen.getByLabelText(/admin.common.name/i)).toBeInTheDocument();
    });

    it('validates required fields', async () => {
        render(
            <AdminTeamDialog
                open={true}
                onClose={mockOnClose}
                onSave={mockOnSave}
            />
        );

        const saveButton = screen.getByRole('button', { name: /admin.common.save/i });
        fireEvent.click(saveButton);

        await waitFor(() => {
            expect(mockOnSave).not.toHaveBeenCalled();
        });
    });

    it('submits valid data', async () => {
        render(
            <AdminTeamDialog
                open={true}
                onClose={mockOnClose}
                onSave={mockOnSave}
            />
        );

        fireEvent.change(screen.getByLabelText(/admin.common.name/i), { target: { value: 'John Doe' } });
        fireEvent.change(screen.getByLabelText(/Role \(EN\)/i), { target: { value: 'Developer' } });
        // Email/Bio are optional

        const saveButton = screen.getByRole('button', { name: /admin.common.save/i });
        fireEvent.click(saveButton);

        await waitFor(() => {
            expect(mockOnSave).toHaveBeenCalled();
        });
    });

    it('submits valid data with photo', async () => {
        render(
            <AdminTeamDialog
                open={true}
                onClose={mockOnClose}
                onSave={mockOnSave}
            />
        );

        fireEvent.change(screen.getByRole('textbox', { name: /admin.common.name/i }), { target: { value: 'John Doe' } });

        // Mock file upload
        const file = new File(['(⌐□_□)'], 'chucknorris.png', { type: 'image/png' });
        const input = screen.getByLabelText(/admin.team.photo_upload/i);

        // We need to ensure we can select the file input. 
        // MUI Button component="label" wraps the input. 
        // The input is hidden but accessible via label.

        // Wait, standard file upload handling
        await waitFor(() => {
            fireEvent.change(input, { target: { files: [file] } });
        });

        // The component does a dynamic import of teamService. 
        // We need to ensure that the mocked teamService is returned.
        // verified via setupTests.

        // verified via setupTests.

        const saveButton = screen.getByRole('button', { name: /admin.common.save/i });
        fireEvent.click(saveButton);

        await waitFor(() => {
            expect(mockOnSave).toHaveBeenCalledWith(expect.objectContaining({
                name: 'John Doe',
                photoUrl: expect.any(String) // or specific mock return if we mocked uploadTeamMemberPhoto fixed return
            }));
        });
    });

    it('pre-fills data for edit', () => {
        const member = {
            id: '1',
            name: 'Jane Doe',
            gender: 'female' as const,
            order: 1,
            role: { en: 'Boss', fr: '', de: '' },
            bio: { en: 'Bio', fr: '', de: '' },
            email: 'jane@example.com'
        };

        render(
            <AdminTeamDialog
                open={true}
                onClose={mockOnClose}
                onSave={mockOnSave}
                initialData={member}
            />
        );

        expect(screen.getByText('admin.team.title_edit')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Jane Doe')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Boss')).toBeInTheDocument();
        expect(screen.getByDisplayValue('jane@example.com')).toBeInTheDocument();
    });
});
