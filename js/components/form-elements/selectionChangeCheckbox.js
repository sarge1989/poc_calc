// Original from DLS SB
export function selectionChangeCheckbox(e) { e.target.parentNode.classList.remove("selected"), e.target.checked && e.target.parentNode.classList.add("selected") }

// For DOM selection
export function selectionChangeCheckboxDOM(checkbox) { checkbox.parentNode.classList.remove("selected"), checkbox.checked && checkbox.parentNode.classList.add("selected") }