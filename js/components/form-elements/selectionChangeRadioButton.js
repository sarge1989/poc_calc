// Original from DLS SB
export function selectionChangeRadioButton(e) { var findSelectedElem = e.target.parentNode.parentNode.querySelector(".selected"); findSelectedElem && findSelectedElem.classList.remove("selected"), e.target.checked && e.target.parentNode.classList.add("selected") }

// function selectionChangeRadioButton(radio) { var findSelectedElem = radio.parentNode.parentNode.querySelector(".selected"); findSelectedElem && findSelectedElem.classList.remove("selected"), radio.checked && radio.parentNode.classList.add("selected") }
