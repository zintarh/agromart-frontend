import { useReducer, useEffect, useCallback, useState } from "react";
import { DELETE, SET_INITIAL_ERRORS, UPDATE, RESET, ADD } from "../FormActions";
import formReducer, { clone } from "../FormReducer";

function UseToggle(initial = false) {
	const [isOpen, setIsOpen] = useState(initial);
	const open = useCallback(() => setIsOpen(true), []);
	const close = useCallback(() => setIsOpen(false), []);
	const toogle = useCallback(() => setIsOpen((prev) => !prev), []);
	return { isOpen, open, close, toogle };
}

const logger = {
	debug: (..._args: unknown[]) => {},
};

export function UseForm(initialState: any, sch: any, initialIsValid = false) {
	const schema = sch;
	const triggerErrorToog = UseToggle(false);
	const [state, dispatch] = useReducer(formReducer, {
		...clone(initialState),
		formIsValid: initialIsValid,
		errors: {},
	});

	const { isOpen, toogle, open: startSubmitting, close: stopSubmitting } = UseToggle();

	const { formIsValid, fields, errors } = state;

	const triggerError = () => {
		!formIsValid && triggerErrorToog.open();
	};

	const update = ({ name, index = undefined, payload }: { name: string, index?: number, payload: any }) => {
		dispatch({
			type: UPDATE,
			payload,
			index,
			name,
			schema,
		});
	};
	const add = ({ index = undefined, payload }: { index?: number, payload: any }) => {
		dispatch({
			type: ADD,
			payload,
			index,
			schema,
		});
	};
	const deleteFieldArray = ({ name, index = undefined }: { name: string, index?: number, payload?: any }) => {
		dispatch({
			type: DELETE,
			name,
			index,
			schema,
		});
	};
	const validateBeforeSubmit = async (submitFunc: () => Promise<any>) => {
		triggerError();
		logger.debug(errors);
		if (!formIsValid) {
			throw new Error("form validation failed");
		}
		if (typeof submitFunc === "function") {
			return await submitFunc();
		}
	};

	const resetForm = () => {
		dispatch({
			type: RESET,
			payload: { ...initialState, formIsValid: initialIsValid, errors: {} },
		});
	};
	const setError = () =>
		sch &&
		dispatch({
			type: SET_INITIAL_ERRORS,
			schema,
		});
	useEffect(() => {
		setError();
	}, []);
	return {
		values: fields,
		formIsValid,
		resetForm,
		deleteFieldArray,
		onChange: update,
		errors,
		add,
		isSubmitting: isOpen,
		toggleSubmit: toogle,
		startSubmitting,
		stopSubmitting,
		setError,
		triggerError,
		showError: triggerErrorToog.isOpen,
		validateBeforeSubmit,
	};
}
export default UseForm;
