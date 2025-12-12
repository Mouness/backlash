import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Paper, InputBase, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useTranslation } from 'react-i18next';

// Validation Schema
const schema = yup
  .object({
    searchTerm: yup.string().required(),
  })
  .required();

interface SearchFormValues {
  searchTerm: string;
}

const SearchBar: React.FC = () => {
  const { t } = useTranslation();
  const { register, handleSubmit, reset } = useForm<SearchFormValues>({
    resolver: yupResolver(schema),
  });
  const navigate = useNavigate();

  const onSubmit = (data: SearchFormValues) => {
    if (data.searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(data.searchTerm.trim())}`);
      reset();
    }
  };

  return (
    <Paper
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        p: '0px 4px',
        display: 'flex',
        alignItems: 'center',
        width: { xs: 'auto', sm: 200 },
        height: 32,
        borderRadius: 0, // Sharp corners
        border: '1px solid #e0e0e0',
      }}
      elevation={0}
      variant="outlined"
    >
      <InputBase
        sx={{ ml: 1, flex: 1, fontSize: '0.875rem' }}
        placeholder={t('nav.search_placeholder', 'Search...')}
        inputProps={{ 'aria-label': 'search' }}
        {...register('searchTerm')}
      />
      <IconButton type="submit" size="small" sx={{ p: '4px' }} aria-label="search">
        <SearchIcon fontSize="small" />
      </IconButton>
    </Paper>
  );
};

export default SearchBar;
