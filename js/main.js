// Utilidad para seleccionar elementos
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

// Elementos del formulario
const textInputs = $$("input[type='text']");
const emailInputs = $$("input[type='email']");
const textareaInputs = $$("textarea");
const consentCheckboxWrapper = $(".consent__checkbox");
const consentCheckbox = consentCheckboxWrapper.querySelector("input");
const queryTypeContainer = $(".query-type__container");
const queryTypeGeneral = queryTypeContainer.querySelector(".query-type__general input");
const queryTypeSupport = queryTypeContainer.querySelector(".query-type__support input");
const submitButton = $(".submit__button");
const modalNotification = $(".modal-notification");

// Evento principal al hacer click en enviar
submitButton.addEventListener("click", (event) => {
	event.preventDefault();

	// Se inicializa formIsValid en true, pero podría cambiar según las validaciones
	let formIsValid = true;

	// Validación de todos los campos
	formIsValid = validateAllInputs(false) && formIsValid;
	formIsValid = validateConsentCheckbox() && formIsValid;
	formIsValid = validateQueryType() && formIsValid;

	// Si todos los campos son válidos, mostrar la notificación
	if (formIsValid) {
		showModalNotification();
		resetForm(); // Resetear el formulario
	}
});

// Mostrar la notificación modal por un tiempo
function showModalNotification() {
	modalNotification.style.display = "flex";
	setTimeout(function() {
		modalNotification.style.display = "none";
	}, 3000);
}

// Validación de todos los inputs de texto, email y textarea
function validateAllInputs(fromEvent = true) {
	let isValid = true;
	isValid = validateFormElements(textInputs, fromEvent) && isValid;
	isValid = validateFormElements(emailInputs, fromEvent) && isValid;
	isValid = validateFormElements(textareaInputs, fromEvent) && isValid;
	return isValid;
}

// Validación de cada conjunto de elementos de formulario
function validateFormElements(elements, fromEvent) {
	let isValid = true;
	elements.forEach((element) => {
		if (fromEvent) {
			// Agregamos un listener para que valide solo al escribir
			element.addEventListener("input", () => validateInputElement(element));
		} else {
			// Validación inmediata al intentar enviar el formulario
			if (!validateInputElement(element)) {
				isValid = false;
			}
		}
	});
	return isValid;
}

// Validar un solo input y retornar si es válido o no
function validateInputElement(input) {
	const errorMessage = input.nextElementSibling;
	if (input.value.trim() === "") {
		input.classList.add("b-error");
		errorMessage.removeAttribute("hidden");
		return false;
	} else {
		input.classList.remove("b-error");
		errorMessage.setAttribute("hidden", "");
		return true;
	}
}

// Validar tipo de consulta y retornar si es válido
function validateQueryType() {
	const errorMessage = queryTypeContainer.nextElementSibling;
	if (queryTypeGeneral.checked || queryTypeSupport.checked) {
		errorMessage.setAttribute("hidden", "");
		return true;
	} else {
		errorMessage.removeAttribute("hidden");
		return false;
	}
}

// Validar el checkbox de consentimiento y retornar si es válido
function validateConsentCheckbox() {
	const errorMessage = consentCheckboxWrapper.nextElementSibling;
	if (consentCheckbox.checked) {
		errorMessage.setAttribute("hidden", "");
		return true;
	} else {
		errorMessage.removeAttribute("hidden");
		return false;
	}
}

function resetForm() {
	textInputs.forEach((input) => (input.value = ""));
	emailInputs.forEach((input) => (input.value = ""));
	textareaInputs.forEach((textarea) => (textarea.value = ""));
	consentCheckbox.checked = false;
	queryTypeGeneral.checked = false;
	queryTypeSupport.checked = false;
}

// Inicializar eventos de validación en tiempo real
function initializeValidation() {
	// Validación en tiempo real para inputs al escribir
	validateFormElements(textInputs, true);
	validateFormElements(emailInputs, true);
	validateFormElements(textareaInputs, true);

	// Validar cuando se hace clic en la selección de tipo de consulta y checkbox
	queryTypeContainer.addEventListener("click", validateQueryType);
	consentCheckboxWrapper.addEventListener("click", validateConsentCheckbox);
}

initializeValidation();
