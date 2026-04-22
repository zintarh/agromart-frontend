import UseForm from "../hooks/UseForm";
export type TForm<T> = Omit<ReturnType<typeof UseForm>, "values"> & { values: T; errors: T };

export type TFormInitialState<T> = {
	fields: T;
};
