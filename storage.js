const defaultOptions = {
    dob: "1985-10-26",
    expectancy: "90",
    mode: "weeks",
}

const loadOptionsFromStorage = (callback) => {
    chrome.storage.sync.get(defaultOptions, callback);
}

const saveOptionsToStorage = (options, callback) => {
    chrome.storage.sync.set(options, callback);
}