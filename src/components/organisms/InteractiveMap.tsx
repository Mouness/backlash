import { useState } from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';
import { useNavigate } from 'react-router-dom';
import { Tooltip } from 'react-tooltip';
import { Box, useTheme } from '@mui/material';
import geoUrl from '../../assets/geo/countries-110m.json';
import { getScoreLevel } from '../../utils/scoreUtils';
import MapTooltip from '../molecules/MapTooltip';
import MapLegend from '../molecules/MapLegend';

interface InteractiveMapProps {
  highlightedCodes?: string[];
  minHeight?: string | number;
  height?: number;
  center?: [number, number];
  scale?: number;
  countryScores?: { [code: string]: number | undefined };
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({
  highlightedCodes,
  minHeight = '500px',
  height = 600,
  center = [0, -40],
  scale = 137,
  countryScores = {},
}) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [hoveredIso, setHoveredIso] = useState<string | null>(null);

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
            {({ geographies }: { geographies: any[] }) => {
              // Sort geographies so the hovered one is last (rendered on top)
              // Sort geographies so the hovered one is last (rendered on top)
              const sortedGeographies = [...geographies].sort((a, b) => {
                const isoA = targetCountries[a.properties.name];
                const isoB = targetCountries[b.properties.name];
                if (isoA === hoveredIso) return 1;
                if (isoB === hoveredIso) return -1;
                return 0;
              });

              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              return sortedGeographies.map((geo: any) => {
                const countryName = geo.properties.name;
                const isoCode = targetCountries[countryName];

                // Determine if highlighted:
                // 1. Must be in our target mapping (is a project country)
                // 2. If highlightedCodes prop is provided, must ALSO be in that list
                const isTarget = Object.keys(targetCountries).includes(countryName);
                const isHighlighted =
                  isTarget && (!highlightedCodes || highlightedCodes.includes(isoCode));

                const score = countryScores[isoCode];
                let fillColor = '#D6D6DA';
                let hoverColor = '#D6D6DA';

                // Determine colors if highlighted
                if (isHighlighted) {
                  // If score is undefined or 0, user requested BLUE (Primary)
                  if (!score || score === 0) {
                    fillColor = theme.palette.primary.main;
                    hoverColor = theme.palette.primary.dark;
                  } else {
                    const level = getScoreLevel(score);
                    // Map score level to theme colors
                    switch (level.color) {
                      case 'error':
                        fillColor = theme.palette.error.main;
                        hoverColor = theme.palette.error.dark;
                        break;
                      case 'warning':
                        fillColor = theme.palette.warning.main;
                        hoverColor = theme.palette.warning.dark;
                        break;
                      case 'info':
                        fillColor = theme.palette.info.main;
                        hoverColor = theme.palette.info.dark;
                        break;
                      case 'success':
                        fillColor = theme.palette.success.main;
                        hoverColor = theme.palette.success.dark;
                        if (score > 80) {
                          fillColor = theme.palette.success.dark;
                          hoverColor = '#003300';
                        }
                        break;
                      default:
                        fillColor = theme.palette.primary.main;
                        hoverColor = theme.palette.primary.dark;
                    }
                  }
                }

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    data-tooltip-id="map-tooltip"
                    data-tooltip-content={isHighlighted ? isoCode : ''}
                    onMouseEnter={() => {
                      if (isHighlighted) setHoveredIso(isoCode);
                    }}
                    onMouseLeave={() => {
                      setHoveredIso(null);
                    }}
                    onClick={() => {
                      if (isHighlighted) {
                        navigate(`/countries/${isoCode}`);
                      }
                    }}
                    style={{
                      default: {
                        fill: fillColor,
                        stroke: '#FFFFFF',
                        strokeWidth: 0.5,
                        outline: 'none',
                        transition: 'all 250ms',
                      },
                      hover: {
                        fill: hoverColor,
                        stroke: '#FFFFFF',
                        strokeWidth: 1,
                        outline: 'none',
                        cursor: isHighlighted ? 'pointer' : 'default',
                        filter: 'drop-shadow(0px 8px 16px rgba(0, 0, 0, 0.3)) brightness(1.05)',
                        transform: 'scale(1.02) translateY(-2px)',
                        transformOrigin: 'center',
                        transformBox: 'fill-box',
                        zIndex: 100, // Visual order helper if possible
                      },
                      pressed: {
                        fill: hoverColor,
                        outline: 'none',
                      },
                    }}
                  />
                );
              });
            }}
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>

      <Tooltip
        id="map-tooltip"
        render={({ content }) => {
          if (!content) return null;
          return <MapTooltip isoCode={content} score={countryScores[content]} />;
        }}
        opacity={1}
        style={{
          backgroundColor: 'transparent',
          padding: 0,
          boxShadow: 'none',
        }}
      />

      {/* Legend / Info Overlay */}
      <MapLegend />
    </Box>
  );
};

export default InteractiveMap;
