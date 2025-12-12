import React, { useState, useEffect } from 'react';
import {
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
    Tabs,
    Tab,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { Country } from '../../services/countryService';
import ScoreSelect from '../molecules/ScoreSelect';

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
    const [score, setScore] = useState<number | ''>('');

    // Multilingual State
    const [names, setNames] = useState({ en: '', fr: '', de: '' });
    const [summaries, setSummaries] = useState({ en: '', fr: '', de: '' });
    const [contents, setContents] = useState({ en: '', fr: '', de: '' });

    useEffect(() => {
        if (initialData) {
            setCode(initialData.code);
            setImageUrl(initialData.imageUrl || '');
            setScore(initialData.score !== undefined ? initialData.score : '');
            setNames(initialData.name);
            setSummaries(initialData.summary);
            setContents(initialData.content);
        } else {
            setCode('');
            setImageUrl('');
            setScore('');
            setNames({ en: '', fr: '', de: '' });
            setSummaries({ en: '', fr: '', de: '' });
            setContents({ en: '', fr: '', de: '' });
        }
    }, [initialData]);

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
    };

    const handleSubmit = async () => {
        if (!code) return;
        setSubmitting(true);
        try {
            const countryData: Omit<Country, 'id'> = {
                code,
                imageUrl,
                score: score === '' ? undefined : Number(score),
                name: names,
                summary: summaries,
                content: contents,
            };
            await onSubmit(countryData);
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

                <ScoreSelect value={score} onChange={setScore} />

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
                    <TextField
                        label={`Detailed Analysis (${LANGUAGES[activeTab].label})`}
                        value={contents[currentLang]}
                        onChange={(e) => setContents({ ...contents, [currentLang]: e.target.value })}
                        fullWidth
                        multiline
                        rows={10}
                        helperText={t('admin.country.content_helper')}
                    />
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
