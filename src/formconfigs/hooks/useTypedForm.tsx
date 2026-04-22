import React from "react";
import UseForm from "./UseForm";
import { ObjectSchema } from "yup";
import { TForm } from "../types/formTypes";

function useTypedForm<T>(initialState: { fields: T }, schema: ObjectSchema<any>) {
	return UseForm(initialState, schema) as TForm<T>;
}

export default useTypedForm;
