import React, { useState } from 'react';
import { Box, Tabs, Tab, TextField, Typography } from '@mui/material';
import RichTextEditor from '../molecules/RichTextEditor';
import { useTranslation } from 'react-i18next';
import type { LocalizedText, LocalizedRichContent } from '../../types/models';

interface CountryLocalizedFieldsProps {
  names: LocalizedText;
  setNames: (val: LocalizedText) => void;
  summaries: LocalizedText;
  setSummaries: (val: LocalizedText) => void;
  contents: LocalizedRichContent;
  setContents: (val: LocalizedRichContent) => void;
}

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'Français' },
  { code: 'de', label: 'Deutsch' },
];

const CountryLocalizedFields: React.FC<CountryLocalizedFieldsProps> = ({
  names,
  setNames,
  summaries,
  setSummaries,
  contents,
  setContents,
}) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(0);
  const currentLang = LANGUAGES[activeTab].code as 'en' | 'fr' | 'de';

  return (
    <>
      <Tabs
        value={activeTab}
        onChange={(_e, v) => setActiveTab(v)}
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
    </>
  );
};

export default CountryLocalizedFields;
