import React, { ChangeEvent, useEffect, useState } from "react";
import { makeStyles, Theme } from "@material-ui/core/styles";
import { loadOptionsFromStorage, Options, saveOptionsToStorage } from "../storage";
import { isEmpty, toInteger, toString } from "lodash";

import { Button, Container, Grid, MenuItem, Paper, Snackbar, TextField, Typography } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(4),
  },
  title: {
    textAlign: "center",
  },
  info: {
    marginBottom: theme.spacing(4),
    textAlign: "center",
  },
  paper: {
    padding: theme.spacing(4, 2),
  },
  actions: {
    display: "flex",
    justifyContent: "center",
  },
  snackbar: {
    textAlign: "center",
  },
}));

interface OptionsForm {
  dob: string;
  expectancy: string;
  mode: "WEEKS" | "DAYS";
}

interface Errors {
  dob?: string;
  expectancy?: string;
  mode?: string;
}

const toOptions = (optionsForm: OptionsForm): Options => {
  return {
    dob: optionsForm.dob,
    expectancy: toInteger(optionsForm.expectancy),
    mode: optionsForm.mode,
  };
};

const toOptionsForm = (options: Options): OptionsForm => {
  return {
    dob: options.dob,
    expectancy: toString(options.expectancy),
    mode: options.mode,
  };
};

const OptionsPage = () => {
  const classes = useStyles();

  const [optionsForm, setOptionsForm] = useState<OptionsForm>({ dob: "", expectancy: "", mode: "WEEKS" });
  const [errors, setErrors] = useState<Errors>({});
  const [saving, setSaving] = useState<boolean>(false);
  const [showSnackbar, setShowSnackbar] = useState<boolean>(false);

  useEffect(() => {
    document.title = "Memento mori";
    loadOptionsFromStorage((options) => {
      setOptionsForm(toOptionsForm(options));
    });
  }, []);

  const handleFieldChange = (name: string) => (event: ChangeEvent<HTMLInputElement>) => {
    setOptionsForm({
      ...optionsForm,
      [name]: event.target.value,
    });
  };

  const validate = (): Errors => {
    const validationErrors: Errors = {};

    const expectancy = toInteger(optionsForm.expectancy);
    if (expectancy < 1 || expectancy > 100) {
      validationErrors.expectancy = "Life expectancy must be a numeric value between 1 and 100";
    }

    const dob = Date.parse(optionsForm.dob);
    if (dob > Date.now()) {
      validationErrors.dob = "Date of birth must be in the past";
    }

    const mode = optionsForm.mode;
    if (mode !== "WEEKS" && mode !== "DAYS") {
      validationErrors.mode = "Invalid mode";
    }

    return validationErrors;
  };

  const save = () => {
    const validationErrors = validate();

    if (isEmpty(validationErrors)) {
      setErrors({});
      setSaving(true);
      const updatedOptions = toOptions(optionsForm);
      saveOptionsToStorage(updatedOptions, () => {
        setSaving(false);
        setShowSnackbar(true);
      });
    } else {
      setErrors(validationErrors);
    }
  };

  return (
    <Container maxWidth="sm" className={classes.root}>
      <Typography variant="h3" gutterBottom className={classes.title}>
        Memento mori
      </Typography>

      <Typography variant="h6" className={classes.info}>
        Remember... life is short and you'll be dead soon 💀
      </Typography>

      <Paper variant="outlined" square className={classes.paper}>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <TextField
              label="Date of birth (dd/mm/yyyy)"
              variant="outlined"
              type="date"
              required
              error={!!errors.dob}
              helperText={errors.dob}
              value={optionsForm.dob}
              onChange={handleFieldChange("dob")}
              fullWidth
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Life expectancy (years)"
              variant="outlined"
              required
              error={!!errors.expectancy}
              helperText={errors.expectancy}
              value={optionsForm.expectancy}
              onChange={handleFieldChange("expectancy")}
              fullWidth
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              select
              label="Mode"
              variant="outlined"
              required
              error={!!errors.mode}
              helperText={errors.mode}
              value={optionsForm.mode}
              onChange={handleFieldChange("mode")}
              fullWidth
            >
              <MenuItem value="WEEKS">Weeks</MenuItem>
              <MenuItem value="DAYS">Days</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={12}>
            <div className={classes.actions}>
              <Button variant="outlined" color="primary" size="large" onClick={save} disabled={saving}>
                Save
              </Button>
            </div>
          </Grid>
        </Grid>
      </Paper>

      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        className={classes.snackbar}
        open={showSnackbar}
        autoHideDuration={2000}
        onClose={() => setShowSnackbar(false)}
        message="Options saved"
      />
    </Container>
  );
};

export default OptionsPage;
