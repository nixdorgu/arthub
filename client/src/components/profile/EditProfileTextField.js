import React from 'react'
import {TextField} from '@material-ui/core';

export default function EditProfileTextField({id, label, error, helperText, value, onChange}) {
    return (
      <TextField
        style={{marginTop: "1.4rem", width: "90%"}}
        id={id}
        error={error}
        helperText={helperText}
        variant="outlined"
        label={label}
        placeholder={value}
        value={value}
        onChange={(e) => onChange(e)}
      />
    )
}
