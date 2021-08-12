import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { loadOptionsFromStorage, Options } from "../storage";

const generateGraph = (dob: number, expectancy: number, mode: "WEEKS" | "DAYS") => {
  let columns = 0;
  let columnBreak = 0;
  let characterChange = 0;

  if (mode === "WEEKS") {
    columns = 52;
    columnBreak = 4;
    characterChange = (Date.now() - dob) / (1000 * 60 * 60 * 24 * 7);
  } else if (mode === "DAYS") {
    columns = 364;
    columnBreak = 7;
    characterChange = (Date.now() - dob) / (1000 * 60 * 60 * 24);
  }

  let content = "";
  for (let i = 0; i < expectancy * columns; i++) {
    if (i > 0) {
      if (i % (columns * 10) === 0) {
        // blank line every decade
        content += "\n\n";
      } else if (i % columns === 0) {
        // new row every year
        content += "\n";
      } else if (i % columnBreak === 0) {
        // space between weeks/months
        content += " ";
      }
    }
    content += i < characterChange ? "X" : ".";
  }
  return content;
};

const useStyles = makeStyles(() => ({
  pre: {
    fontSize: "0.75em",
    lineHeight: "1.25em",
    margin: 0,
  },
  wrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
}));

const NewTabPage = () => {
  const [content, setContent] = useState<string>("");
  const classes = useStyles();

  useEffect(() => {
    loadOptionsFromStorage((values: Options) => {
      const expectancy = values.expectancy;
      const dob = Date.parse(values.dob);
      const mode = values.mode;
      setContent(generateGraph(dob, expectancy, mode));
    });
  }, []);

  return (
    <div className={classes.wrapper}>
      <pre className={classes.pre}>{content}</pre>
    </div>
  );
};

export default NewTabPage;
