import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { loadOptionsFromStorage, Options } from "../storage";
import useWindowDimensions from "./useWindowDimensions";
import { round } from "lodash";

const generateGraph = (dob: number, expectancy: number) => {
  const columns = 52;
  const columnBreak = 4;
  const characterChange = (Date.now() - dob) / (1000 * 60 * 60 * 24 * 7);

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
    content += i < characterChange ? "X" : "\u00B7";
  }
  return content;
};

const useStyles = makeStyles(() => ({
  pre: {
    margin: 0,
    lineHeight: 1.2,
    fontFamily: "'Source Code Pro', monospace",
  },
  wrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
}));

const calculateStyles = (width: number, height: number, content: string) => {
  const numLines = (content.match(/\n/g) || []).length + 1;
  const buffer = height * 0.25;
  const lineHeight = round((height - buffer) / numLines, 1);

  return { fontSize: `${lineHeight}px` };
};

const NewTabPage = () => {
  const classes = useStyles();

  const [content, setContent] = useState<string>("");
  const { height, width } = useWindowDimensions();

  useEffect(() => {
    loadOptionsFromStorage((values: Options) => {
      const expectancy = values.expectancy;
      const dob = Date.parse(values.dob);
      setContent(generateGraph(dob, expectancy));
    });
  }, []);

  return (
    <div className={classes.wrapper}>
      <pre className={classes.pre} style={calculateStyles(width, height, content)}>
        {content}
      </pre>
    </div>
  );
};

export default NewTabPage;
