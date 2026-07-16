"use client";
import React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { createTheme, ThemeProvider } from '@mui/material/styles';

dayjs.extend(customParseFormat);

const theme = createTheme({
  palette: {
    primary: {
      main: '#fbd342f8',
      contrastText: '#141414',
    },
  },
  typography: {
    fontFamily: 'var(--font-plus-jakarta)',
  },
});

export default function MUIDateTimePicker({ label, name, value, onChange, disabled }) {
  return (
    <div style={{ width: '100%' }}>
      <label style={{ color: '#141414', fontSize: '14px', fontWeight: 600, display: 'block', padding: '0 0 8px 0' }}>{label}</label>
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateTimePicker
            value={value ? dayjs(value, 'YYYY.MM.DD HH:mm:ss') : null}
            onChange={(newVal) => {
              if (newVal && newVal.isValid()) {
                onChange({ target: { name, value: newVal.format('YYYY.MM.DD HH:mm:ss') } });
              } else {
                onChange({ target: { name, value: '' } });
              }
            }}
            disabled={disabled}
            views={['year', 'month', 'day', 'hours', 'minutes', 'seconds']}
            ampm={true}
            slotProps={{
              textField: {
                size: 'small',
                fullWidth: true,
                placeholder: 'e.g. 2026.06.10 14:41:06',
                sx: {
                  '& .MuiInputBase-root': {
                    height: '48px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                    fontSize: '14px',
                    fontWeight: 500,
                    color: '#141414',
                    fontFamily: 'var(--font-plus-jakarta)',
                    '& fieldset': {
                      borderColor: 'rgba(0, 0, 0, 0.04)',
                      borderWidth: '1px',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(0, 0, 0, 0.04)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#141414 !important',
                      borderWidth: '1px !important',
                    },
                  },
                }
              }
            }}
          />
        </LocalizationProvider>
      </ThemeProvider>
    </div>
  );
}
