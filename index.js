const generateGraph = (dob, expectancy, mode) => {
    let columns = 0;
    let columnBreak = 0;
    let characterChange = 0;

    if (mode === "weeks") {
        columns = 52;
        columnBreak = 4;
        characterChange = (Date.now() - dob) / (1000 * 60 * 60 * 24 * 7);
    } else if (mode === "days") {
        columns = 364;
        columnBreak = 7;
        characterChange = (Date.now() - dob) / (1000 * 60 * 60 * 24);
    }

    let content = "";
    for (let i = 0; i < (expectancy * columns); i++) {
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
}

loadOptionsFromStorage((values) => {
    const expectancy = values.expectancy;
    const dob = new Date(values.dob).getTime();
    const mode = values.mode;

    const content = generateGraph(dob, expectancy, mode);
    document.querySelector("#content").innerText = content;
});


