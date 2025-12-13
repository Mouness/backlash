import React, { useState, useEffect } from 'react';
import {
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Tabs,
  Tab,
  Typography,
} from '@mui/material';
import RichTextEditor from '../molecules/RichTextEditor';
import { useTranslation } from 'react-i18next';
import type { Country } from '../../types/models';
import type { LocalizedRichContent } from '../../types/models';
import ScoreSelect from '../molecules/ScoreSelect';
import { DemocraticScore } from '../../types/models';

interface CountryFormProps {
  initialData?: Country | null;
  onSubmit: (data: Omit<Country, 'id'>) => Promise<void>;
  onCancel: () => void;
}

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'Français' },
  { code: 'de', label: 'Deutsch' },
];

const CountryForm: React.FC<CountryFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [code, setCode] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [score, setScore] = useState<DemocraticScore | ''>('');

  // Multilingual State
  const [names, setNames] = useState({ en: '', fr: '', de: '' });
  const [summaries, setSummaries] = useState({ en: '', fr: '', de: '' });
  const [contents, setContents] = useState<LocalizedRichContent>({ en: '', fr: '', de: '' });

  const [docFile, setDocFile] = useState<File | null>(null);

  useEffect(() => {
    if (initialData) {
      setCode(initialData.code);
      setImageUrl(initialData.imageUrl || '');
      setScore(initialData.score !== undefined ? initialData.score : '');
      setNames(initialData.name);
      setSummaries(initialData.summary);
      setContents(initialData.content);
      setDocFile(null); // Reset file input on edit load
    } else {
      setCode('');
      setImageUrl('');
      setScore('');
      setNames({ en: '', fr: '', de: '' });
      setSummaries({ en: '', fr: '', de: '' });
      setContents({ en: '', fr: '', de: '' });
      setDocFile(null);
    }
  }, [initialData]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleDocChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setDocFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!code) return;
    setSubmitting(true);
    try {
      let documentUrl = initialData?.documentUrl;

      if (docFile) {
        const { countryService } = await import('../../services/countryService');
        documentUrl = await countryService.uploadCountryDocument(docFile);
      }

      const countryData: Omit<Country, 'id'> = {
        code,
        imageUrl,
        name: names,
        summary: summaries,
        content: contents,
      };

      if (documentUrl !== undefined) {
        countryData.documentUrl = documentUrl;
      }

      if (score !== '') {
        countryData.score = score as DemocraticScore;
      }

      await onSubmit(countryData as Omit<Country, 'id'>);
    } catch (error) {
      console.error('Error submitting country:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const currentLang = LANGUAGES[activeTab].code as 'en' | 'fr' | 'de';

  return (
    <>
      <DialogContent dividers>
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <TextField
            label={t('admin.country.code')}
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder={t('admin.country.code_placeholder', 'e.g., CAN, CHE')}
            fullWidth
            required
            helperText={t('admin.country.code_helper')}
          />
          <TextField
            label={t('admin.country.image_url', 'Image URL (Optional)')}
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            fullWidth
          />
        </Box>

        <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'flex-start' }}>
          <Box sx={{ flex: 1 }}>
            <ScoreSelect value={score} onChange={setScore} />
          </Box>
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <Button variant="outlined" component="label" fullWidth sx={{ height: '56px' }}>
              {t('admin.country.doc_upload')}
              <input type="file" hidden accept=".pdf,.doc,.docx" onChange={handleDocChange} />
            </Button>
            {(docFile || (initialData && initialData.documentUrl)) && (
              <Typography variant="caption" sx={{ mt: 1, px: 1 }}>
                {docFile ? docFile.name : t('admin.country.current_doc')}
              </Typography>
            )}
          </Box>
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
            label={`${t('admin.common.name', 'Name')} (${LANGUAGES[activeTab].label})`}
            value={names[currentLang]}
            onChange={(e) => setNames({ ...names, [currentLang]: e.target.value })}
            fullWidth
          />
          <TextField
            label={`${t('admin.country.summary_label', 'Summary')} (${LANGUAGES[activeTab].label})`}
            value={summaries[currentLang]}
            onChange={(e) => setSummaries({ ...summaries, [currentLang]: e.target.value })}
            fullWidth
            multiline
            rows={2}
          />
          <Box>
            <Typography variant="caption" color="text.secondary" gutterBottom>
              {`${t('admin.country.content_label', 'Detailed Analysis')} (${LANGUAGES[activeTab].label})`}
            </Typography>
            <RichTextEditor
              value={contents[currentLang]}
              onChange={(val) => setContents({ ...contents, [currentLang]: val || '' })}
              minHeight={400}
            />
            <Typography variant="caption" color="text.secondary">
              {t('admin.country.content_helper')}
            </Typography>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} disabled={submitting}>
          {t('admin.common.cancel')}
        </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={submitting}>
          {submitting ? t('admin.common.saving') : t('admin.common.save')}
        </Button>
      </DialogActions>
    </>
  );
};

export default CountryForm;
