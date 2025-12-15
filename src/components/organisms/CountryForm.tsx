import React, { useState, useEffect } from 'react';
import { DialogContent, DialogActions, Button, TextField, Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { Country } from '../../types/models';
import type { LocalizedRichContent } from '../../types/models';
import ScoreSelect from '../molecules/ScoreSelect';
import { DemocraticScore } from '../../types/models';
import CountryLocalizedFields from './CountryLocalizedFields';

interface CountryFormProps {
  initialData?: Country | null;
  onSubmit: (data: Omit<Country, 'id'>) => Promise<void>;
  onCancel: () => void;
}

const CountryForm: React.FC<CountryFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const { t } = useTranslation();
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
        // Dynamic import to avoid circular dependency if any, though likely not needed here but safe
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
            slotProps={{ htmlInput: { 'data-testid': 'country-code-input' } }}
          />
          <TextField
            label={t('admin.country.image_url', 'Image URL (Optional)')}
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            fullWidth
            slotProps={{ htmlInput: { 'data-testid': 'country-image-input' } }}
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

        <CountryLocalizedFields
          names={names}
          setNames={setNames}
          summaries={summaries}
          setSummaries={setSummaries}
          contents={contents}
          setContents={setContents}
        />
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
