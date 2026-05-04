import UseForm from "./UseForm";
import type { ObjectSchema } from "yup";
import type { TForm } from "../types/formTypes";

function useTypedForm<T>(initialState: { fields: T }, schema: ObjectSchema<any>) {
	return UseForm(initialState, schema) as TForm<T>;
}

export default useTypedForm;
