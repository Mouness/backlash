import React, { useState } from 'react';
import { Box, Tabs, Tab, TextField } from '@mui/material';
import { Controller, type Control } from 'react-hook-form';
import RichTextEditor from '../molecules/RichTextEditor';
import type { TeamMember } from '../../types/models';

interface TeamLocalizedTabsProps {
  control: Control<Omit<TeamMember, 'id'>>;
}

const TeamLocalizedTabs: React.FC<TeamLocalizedTabsProps> = ({ control }) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <>
      <Tabs
        value={activeTab}
        onChange={(_e, v) => setActiveTab(v)}
        aria-label="language tabs"
        sx={{ mb: 2 }}
      >
        <Tab label="English" />
        <Tab label="Français" />
        <Tab label="Deutsch" />
      </Tabs>

      {['en', 'fr', 'de'].map((langCode, index) => (
        <Box key={langCode} sx={{ display: activeTab === index ? 'block' : 'none' }}>
          <Controller
            name={`role.${langCode}` as `role.${'en' | 'fr' | 'de'}`}
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label={`Role (${langCode.toUpperCase()})`}
                fullWidth
                sx={{ mb: 2 }}
              />
            )}
          />
          <Controller
            name={`bio.${langCode}` as `bio.${'en' | 'fr' | 'de'}`}
            control={control}
            render={({ field }) => (
              <RichTextEditor
                value={field.value || ''}
                onChange={(val) => field.onChange(val || '')}
                minHeight={200}
              />
            )}
          />
        </Box>
      ))}
    </>
  );
};

export default TeamLocalizedTabs;
