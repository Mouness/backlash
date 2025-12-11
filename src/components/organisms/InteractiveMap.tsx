import React from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';
import { Tooltip } from 'react-tooltip';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, useTheme, Paper } from '@mui/material';
import geoUrl from '../../assets/geo/countries-110m.json';

interface InteractiveMapProps {
  highlightedCodes?: string[];
  minHeight?: string | number;
  height?: number;
  center?: [number, number];
  scale?: number;
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({
  highlightedCodes,
  minHeight = '500px',
  height = 600,
  center = [0, -40],
  scale = 137,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const theme = useTheme();

  // Mapping from map property name to translation key suffix (ISO code)
  const targetCountries: { [key: string]: string } = {
    Canada: 'CAN',
    Switzerland: 'CHE',
    Germany: 'DEU',
    Brazil: 'BRA',
    'United States of America': 'USA', // Note: Name must match topojson property exactly ("United States of America")
    India: 'IND',
  };

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        minHeight: minHeight,
        bgcolor: theme.palette.background.default,
        borderRadius: 4,
        overflow: 'hidden',
        position: 'relative',
        boxShadow: 3,
      }}
    >
      <ComposableMap
        projection="geoEqualEarth"
        projectionConfig={{ scale, center }}
        height={height}
      >
        <ZoomableGroup zoom={1}>
          <Geographies geography={geoUrl}>
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {({ geographies }: { geographies: any[] }) =>
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              geographies.map((geo: any) => {
                const countryName = geo.properties.name;
                const isoCode = targetCountries[countryName];

                // Determine if highlighted:
                // 1. Must be in our target mapping (is a project country)
                // 2. If highlightedCodes prop is provided, must ALSO be in that list
                const isTarget = Object.keys(targetCountries).includes(countryName);
                const isHighlighted =
                  isTarget && (!highlightedCodes || highlightedCodes.includes(isoCode));

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    data-tooltip-id="map-tooltip"
                    data-tooltip-content={
                      isHighlighted
                        ? `${t(`countries.${isoCode}.name`)}: ${t(`countries.${isoCode}.desc`)}`
                        : ''
                    }
                    onClick={() => {
                      if (isHighlighted) {
                        navigate(`/countries/${isoCode}`);
                      }
                    }}
                    style={{
                      default: {
                        fill: isHighlighted ? theme.palette.primary.main : '#D6D6DA',
                        stroke: '#FFFFFF',
                        strokeWidth: 0.5,
                        outline: 'none',
                        transition: 'all 250ms',
                      },
                      hover: {
                        fill: isHighlighted ? theme.palette.primary.dark : '#D6D6DA',
                        stroke: '#FFFFFF',
                        strokeWidth: 0.5,
                        outline: 'none',
                        cursor: isHighlighted ? 'pointer' : 'default',
                      },
                      pressed: {
                        fill: isHighlighted ? theme.palette.primary.dark : '#D6D6DA',
                        outline: 'none',
                      },
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>

      <Tooltip
        id="map-tooltip"
        style={{
          backgroundColor: theme.palette.secondary.dark,
          color: theme.palette.secondary.contrastText,
          borderRadius: '8px',
          opacity: 1,
        }}
      />

      {/* Legend / Info Overlay */}
      <Paper
        elevation={3}
        sx={{
          position: 'absolute',
          bottom: 20,
          left: 20,
          p: 2,
          bgcolor: 'rgba(255,255,255,0.9)',
          borderRadius: 2,
          maxWidth: 300,
          display: { xs: 'none', md: 'block' },
        }}
      >
        <Typography variant="body2" fontWeight="bold" color="primary">
          {t('map.title')}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {t('map.description')}
        </Typography>
      </Paper>
    </Box>
  );
};

export default InteractiveMap;
