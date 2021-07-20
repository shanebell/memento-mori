document.addEventListener("DOMContentLoaded", () => {
    const saveButtonElem = document.querySelector("#save");
    const dobElem = document.querySelector("#dob");
    const modeElem = document.querySelector("#mode");
    const expectancyElem = document.querySelector("#expectancy");
    const confirmationMsgElem = document.querySelector("#confirmation-message");

    loadOptionsFromStorage((values) => {
        dobElem.value = values.dob;
        expectancyElem.value = values.expectancy;
        modeElem.value = values.mode;
    });

    saveButtonElem.addEventListener("click", () => {
        const options = {
            dob: dobElem.value,
            expectancy: expectancyElem.value,
            mode: modeElem.value,
        };
        saveOptionsToStorage(options, () => {
            confirmationMsgElem.classList.remove("hidden");
            setTimeout(() => {
                confirmationMsgElem.classList.add("hidden");
            }, 2000);
        });
    });
});