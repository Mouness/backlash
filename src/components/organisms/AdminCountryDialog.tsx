import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Tabs,
  Tab,
} from '@mui/material';
import type { Country } from '../../services/countryService';

interface AdminCountryDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Country, 'id'>) => Promise<void>;
  initialData?: Country | null;
}

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'Français' },
  { code: 'de', label: 'Deutsch' },
];

const AdminCountryDialog: React.FC<AdminCountryDialogProps> = ({
  open,
  onClose,
  onSubmit,
  initialData,
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [code, setCode] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  // Multilingual State
  const [names, setNames] = useState({ en: '', fr: '', de: '' });
  const [summaries, setSummaries] = useState({ en: '', fr: '', de: '' });
  const [contents, setContents] = useState({ en: '', fr: '', de: '' });

  useEffect(() => {
    if (initialData) {
      setCode(initialData.code);
      setImageUrl(initialData.imageUrl || '');
      setNames(initialData.name);
      setSummaries(initialData.summary);
      setContents(initialData.content);
    } else {
      setCode('');
      setImageUrl('');
      setNames({ en: '', fr: '', de: '' });
      setSummaries({ en: '', fr: '', de: '' });
      setContents({ en: '', fr: '', de: '' });
    }
  }, [initialData, open]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const countryData: Omit<Country, 'id'> = {
        code,
        imageUrl,
        name: names,
        summary: summaries,
        content: contents,
      };
      await onSubmit(countryData);
      onClose();
    } catch (error) {
      console.error('Error submitting country:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const currentLang = LANGUAGES[activeTab].code as 'en' | 'fr' | 'de';

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{initialData ? 'Edit Country Analysis' : 'New Country Analysis'}</DialogTitle>
      <DialogContent dividers>
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <TextField
            label="Country Code (ISO 3)"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="e.g., CAN, CHE"
            fullWidth
            required
            helperText="Used for map matching (CAN, CHE, DEU, BRA, USA, IND)"
          />
          <TextField
            label="Image URL (Optional)"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            fullWidth
          />
        </Box>

        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          sx={{ mb: 2, borderBottom: 1, borderColor: 'divider' }}
        >
          {LANGUAGES.map((lang) => (
            <Tab key={lang.code} label={lang.label} />
          ))}
        </Tabs>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <TextField
            label={`Name (${LANGUAGES[activeTab].label})`}
            value={names[currentLang]}
            onChange={(e) => setNames({ ...names, [currentLang]: e.target.value })}
            fullWidth
          />
          <TextField
            label={`Summary (${LANGUAGES[activeTab].label})`}
            value={summaries[currentLang]}
            onChange={(e) => setSummaries({ ...summaries, [currentLang]: e.target.value })}
            fullWidth
            multiline
            rows={2}
          />
          <TextField
            label={`Detailed Analysis (${LANGUAGES[activeTab].label})`}
            value={contents[currentLang]}
            onChange={(e) => setContents({ ...contents, [currentLang]: e.target.value })}
            fullWidth
            multiline
            rows={10}
            helperText="Markdown or plain text for the main analysis content."
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={submitting}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={submitting}>
          {submitting ? 'Saving...' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AdminCountryDialog;
