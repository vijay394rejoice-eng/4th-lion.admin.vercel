import React from 'react';
import DateTimePicker from 'react-datetime-picker';
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import './datetime.scss';

dayjs.extend(customParseFormat);

export default function CustomDateTimePicker({ label, name, value, onChange, disabled }) {
  // Convert string 'YYYY.MM.DD HH:mm:ss' to Date object
  const dateValue = value ? dayjs(value, 'YYYY.MM.DD HH:mm:ss').toDate() : null;

  return (
    <div className="custom-datetime-container" style={{ width: '100%' }}>
      <label style={{ color: '#141414', fontSize: '14px', fontWeight: 600, display: 'block', padding: '0 0 8px 0' }}>{label}</label>
      <DateTimePicker
        onChange={(val) => {
          if (val) {
            onChange({ target: { name, value: dayjs(val).format('YYYY.MM.DD HH:mm:ss') } });
          } else {
            onChange({ target: { name, value: '' } });
          }
        }}
        value={dateValue}
        disabled={disabled}
        format="y.MM.dd h:mm:ss a"
        className="react-datetime-picker-custom"
        disableClock={false}
        clearIcon={null}
      />
    </div>
  );
}
