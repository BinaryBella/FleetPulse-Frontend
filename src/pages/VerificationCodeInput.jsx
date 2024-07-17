/* eslint-disable react/prop-types */
import {useField, useFormikContext} from "formik";
import VerificationInput from "react-verification-input";

export const VerificationCodeInput = ({ label, ...props }) => {
    const { setFieldValue } = useFormikContext();
    const [ meta] = useField(props);

    const handleChange = value => {
        setFieldValue(props.name, value).then(r => r);
    };

    return (
        <div>
            <label htmlFor={props.name}>{label}</label>
            <VerificationInput
                validChars="0-9"
                inputProps={{ inputMode: "numeric" }}
                value={pinValue}
                onChange={handleChange}
                classNames={{
                    container: "container",
                    character: "character",
                    characterFilled: "character--filled"
                }}
            />
            {meta.touched && meta.error ? (
                <div className="error">{meta.error}</div>
            ) : null}
        </div>
    );
};
