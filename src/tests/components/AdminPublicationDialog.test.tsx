
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AdminPublicationDialog from '../../components/organisms/AdminPublicationDialog';

// Mock publicationService
const mockUploadImage = vi.fn().mockResolvedValue('http://mock-image.url');
const mockUploadDoc = vi.fn().mockResolvedValue('http://mock-doc.url');

vi.mock('../../services/publicationService', () => ({
    publicationService: {
        uploadPublicationImage: (file: File) => mockUploadImage(file),
        uploadPublicationDocument: (file: File) => mockUploadDoc(file),
    },
}));

describe('AdminPublicationDialog', () => {
    const mockOnSave = vi.fn();
    const mockOnClose = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders dialog when open', () => {
        render(
            <AdminPublicationDialog
                open={true}
                onClose={mockOnClose}
                onSave={mockOnSave}
            />
        );
        expect(screen.getByText('admin.publication.title_new')).toBeInTheDocument();
        // Uses getAllByText because of label + legend
        expect(screen.getAllByText('admin.publication.category')[0]).toBeInTheDocument();
    });

    it('validates required fields', async () => {
        render(
            <AdminPublicationDialog
                open={true}
                onClose={mockOnClose}
                onSave={mockOnSave}
            />
        );

        const saveButton = screen.getByText('admin.common.save');
        fireEvent.click(saveButton);

        // Should not call onSave if invalid (handled by browser validation mostly but good to check interaction)
        expect(mockOnSave).not.toHaveBeenCalled();
    });

    it('submits form with data', async () => {
        render(
            <AdminPublicationDialog
                open={true}
                onClose={mockOnClose}
                onSave={mockOnSave}
            />
        );

        // Fill Title EN
        const titleInputs = screen.getAllByLabelText(/admin.common.title/i);
        fireEvent.change(titleInputs[0], { target: { value: 'New Pub Title' } }); // Title (EN)

        // Select Category (MUI Select is tricky, use hidden input or just skip strict UI select test and rely on form logic)
        // For simplicity with MUI Select in tests, we often skip complex interaction or use specific helpers.
        // Let's assume default is 'news' and just submit.

        const saveButton = screen.getByText('admin.common.save');
        fireEvent.click(saveButton);

        await waitFor(() => {
            expect(mockOnSave).toHaveBeenCalled();
        });

        // Check if onSave was called with expected data structure
        expect(mockOnSave).toHaveBeenCalledWith(expect.objectContaining({
            title: expect.objectContaining({ en: 'New Pub Title' }),
            category: 'news',
        }));
    });
});
