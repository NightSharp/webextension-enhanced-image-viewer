const OPTION_BACKGROUND_COLOR = "backgroundColor";
const OPTION_SIZE_STATES = "sizeStates";

const OPTION_REMEMBER_LAST_ROTATION = "rememberLastRotation";
const OPTION_REMEMBER_LAST_SIZE_STATE = "rememberLastSizeState";

function restoreOptions() {
    browser.storage.local.get([
        OPTION_BACKGROUND_COLOR,
        OPTION_REMEMBER_LAST_ROTATION,
        OPTION_REMEMBER_LAST_SIZE_STATE,
        OPTION_SIZE_STATES,
    ]).then(
        result => {
            for (const state of result[OPTION_SIZE_STATES]) {
                setBooleanValue(state, true);
            }

            setTextValue("backgroundColor", result[OPTION_BACKGROUND_COLOR]);
            document.getElementById("backgroundColorPicker").style.backgroundColor = result[OPTION_BACKGROUND_COLOR];
            setBooleanValue("rememberLastRotation", result[OPTION_REMEMBER_LAST_ROTATION]);
            setBooleanValue("rememberLastSizeState", result[OPTION_REMEMBER_LAST_SIZE_STATE]);
        }
    );
}

function enableAutosave() {
    for (const input of document.querySelectorAll("input:not([type=radio]):not([type=checkbox]), textarea")) {
        input.addEventListener("input", saveOptions);
    }
    for (const input of document.querySelectorAll("input[type=radio], input[type=checkbox]")) {
        input.addEventListener("change", saveOptions);
    }
}

function loadTranslations() {
    for (const element of document.querySelectorAll("[data-i18n]")) {
        const translationKey = element.getAttribute("data-i18n");
        if (typeof browser === "undefined" || !browser.i18n.getMessage(translationKey)) {
            element.textContent = element.getAttribute("data-i18n");
        } else {
            element.innerHTML = browser.i18n.getMessage(translationKey);
        }
    }
}

function setTextValue(elementID, newValue) {
    const oldValue = document.getElementById(elementID).value;

    if (oldValue !== newValue) {
        document.getElementById(elementID).value = newValue;
    }
}

function setBooleanValue(elementID, newValue) {
    document.getElementById(elementID).checked = newValue;
}

function saveOptions(event) {
    event.preventDefault();

    let sizeStates = [].map.call(document.querySelectorAll("#modes input:checked"), (node) => node.id);
    if (sizeStates.length == 0)
        sizeStates = [document.querySelector("#modes input").id];

    browser.storage.local.set({
        [OPTION_BACKGROUND_COLOR]: document.getElementById("backgroundColor").value,
        [OPTION_SIZE_STATES]: sizeStates,
        [OPTION_REMEMBER_LAST_ROTATION]: document.getElementById("rememberLastRotation").checked,
        [OPTION_REMEMBER_LAST_SIZE_STATE]: document.getElementById("rememberLastSizeState").checked,
    });
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.addEventListener("DOMContentLoaded", enableAutosave);
document.addEventListener("DOMContentLoaded", loadTranslations);
document.querySelector("form").addEventListener("submit", saveOptions);

browser.storage.onChanged.addListener(restoreOptions);
