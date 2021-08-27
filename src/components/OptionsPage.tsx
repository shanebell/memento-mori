import React, { ChangeEvent, useEffect, useState } from "react";
import { makeStyles, Theme } from "@material-ui/core/styles";
import { loadOptionsFromStorage, Options, saveOptionsToStorage } from "../storage";
import { isEmpty, toInteger, toString } from "lodash";
import image from "../images/memento-mori.png";

import { Button, Container, Grid, Paper, Snackbar, TextField, Typography } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(4),
  },
  title: {
    textAlign: "center",
  },
  info: {
    marginBottom: theme.spacing(2),
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
  logo: {
    display: "flex",
    justifyContent: "center",
    marginBottom: theme.spacing(2),
  },
  image: {
    width: "64px",
    height: "64px",
  },
  attribution: {
    display: "flex",
    justifyContent: "center",
    marginTop: theme.spacing(4),
    opacity: "0.75",
    filter: "grayscale(100%)",
  },
}));

interface OptionsForm {
  dob: string;
  expectancy: string;
}

interface Errors {
  dob?: string;
  expectancy?: string;
}

const toOptions = (optionsForm: OptionsForm): Options => {
  return {
    dob: optionsForm.dob,
    expectancy: toInteger(optionsForm.expectancy),
  };
};

const toOptionsForm = (options: Options): OptionsForm => {
  return {
    dob: options.dob,
    expectancy: toString(options.expectancy),
  };
};

const OptionsPage = () => {
  const classes = useStyles();

  const [optionsForm, setOptionsForm] = useState<OptionsForm>({ dob: "", expectancy: "" });
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

      <div className={classes.logo}>
        <img src={image} alt="JaSON logo" className={classes.image} />
      </div>

      <Typography variant="h6" className={classes.info}>
        Remember... life is short and you'll be dead soon
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
            <div className={classes.actions}>
              <Button variant="outlined" color="primary" size="large" onClick={save} disabled={saving}>
                Save
              </Button>
            </div>
          </Grid>
        </Grid>
      </Paper>

      <Typography variant="caption" className={classes.attribution}>
        Icons made by&nbsp;
        <a href="https://www.freepik.com" target="_blank" rel="noreferrer">
          Freepik
        </a>
        &nbsp;from&nbsp;
        <a href="https://www.flaticon.com/" target="_blank" rel="noreferrer">
          www.flaticon.com
        </a>
      </Typography>

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
