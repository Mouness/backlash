import React, { useState } from 'react';
import { Box, Tabs, Tab, TextField, Typography } from '@mui/material';
import { Controller, type Control } from 'react-hook-form';
import RichTextEditor from '../molecules/RichTextEditor';
import { useTranslation } from 'react-i18next';
import type { Publication } from '../../types/models';

interface PublicationLocalizedTabsProps {
  control: Control<Omit<Publication, 'id'>>;
}

const PublicationLocalizedTabs: React.FC<PublicationLocalizedTabsProps> = ({ control }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(0);

  return (
    <>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mt: 2, mb: 2 }}>
        <Tabs value={activeTab} onChange={(_e, v) => setActiveTab(v)}>
          <Tab label="English" />
          <Tab label="Français" />
          <Tab label="Deutsch" />
        </Tabs>
      </Box>

      {/* Title & Description for ALL languages (rendering all, hiding inactive) */}
      {['en', 'fr', 'de'].map((langCode, index) => (
        <Box key={langCode} sx={{ mb: 2, display: activeTab === index ? 'block' : 'none' }}>
          <Controller
            name={`title.${langCode}` as `title.${'en' | 'fr' | 'de'}`}
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                margin="dense"
                label={`${t('admin.common.title', 'Title')} (${langCode.toUpperCase()})`}
                fullWidth
                variant="outlined"
                slotProps={{ htmlInput: { 'data-testid': `title-input-${langCode}` } }}
              />
            )}
          />
          <Controller
            name={`description.${langCode}` as `description.${'en' | 'fr' | 'de'}`}
            control={control}
            render={({ field }) => (
              <Box>
                <Typography variant="caption" color="text.secondary" gutterBottom>
                  {`${t('admin.common.description', 'Description')} (${langCode.toUpperCase()})`}
                </Typography>
                <RichTextEditor
                  value={field.value || ''}
                  onChange={(val) => field.onChange(val || '')}
                  minHeight={300}
                />
              </Box>
            )}
          />
        </Box>
      ))}
    </>
  );
};

export default PublicationLocalizedTabs;
