import React, {useState} from "react";
import {
  TextAreaStyle,
  LabelStyle,
  ErrorStyle,
  TextFieldStyle,
  FormStyle,
  SwitchInputStyle,
  SwitchSliderStyle,
  SwitchWrapperStyle,
  SelectStyle,
} from "./FormStyles";

// Select

const Select = ({
                  label,
                  value,
                  onChange,
                  error,
                  placeholder,
                  children,
                  slim,
                  className,
                  dark,
                }) => {
  return (
    <div>
      {label && <LabelStyle>{label}</LabelStyle>}
      <div style={{display: "flex", alignItems: "center"}}>
        <SelectStyle
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          slim={slim}
          dark={dark}
          className={className}
        >
          {children}
        </SelectStyle>
      </div>

      {error && <ErrorStyle>{error}</ErrorStyle>}
    </div>
  );
};

// Switch

const Switch = ({checked, onChange}) => {
  return (
    <SwitchWrapperStyle>
      <SwitchInputStyle type="checkbox" checked={checked} onChange={onChange}/>
      <SwitchSliderStyle/>
    </SwitchWrapperStyle>
  );
};

// Text Area

const TextArea = ({
                    label,
                    value,
                    onChange,
                    onClick,
                    error,
                    placeholder,
                    dark,
                  }) => {
  return (
    <div>
      {label && <LabelStyle dark={dark}>{label}</LabelStyle>}
      <div style={{display: "flex", alignItems: "center"}}>
        <TextAreaStyle
          value={value}
          onChange={onChange}
          onClick={onClick}
          placeholder={placeholder}
          rows={5}
          dark={dark}
        />
      </div>
      {error && <ErrorStyle>{error}</ErrorStyle>}
    </div>
  );
};

const TextField = ({
                     label,
                     style,
                     inputEl,
                     value,
                     onChange,
                     onBlur,
                     onClick,
                     error,
                     type,
                     placeholder,
                     dark,
                     readonly,
                     disabled,
                     appendButton,
                     appendOnClick,
                     noMarginLabel
                   }) => {
  return (
    <div style={{width: "100%", background: "white", padding: "1rem 1rem"}}>
      {label && <LabelStyle noMarginLabel={noMarginLabel} dark={dark}>{label}</LabelStyle>}
      <div style={{display: "flex", alignItems: "center", gap: "1rem"}}>
        {!inputEl ? (
          <TextFieldStyle
            readOnly={readonly}
            value={value}
            onChange={!disabled ? onChange : () => {
            }}
            onClick={onClick}
            placeholder={placeholder}
            type={type}
            dark={dark}
            onBlur={onBlur}
            disabled={disabled}
          />
        ) : (
          inputEl
        )}
        {appendButton && (
          <div style={{cursor: "pointer"}} onClick={appendOnClick}>
            {appendButton}
          </div>
        )}
      </div>
      {error && <ErrorStyle>{error}</ErrorStyle>}
    </div>
  );
};

const PasswordField = ({
                         label,
                         value,
                         onChange,
                         onBlur,
                         onClick,
                         error,
                         type,
                         placeholder,
                         dark,
                         disabled,
                       }) => {
  const [shown, setIsShown] = useState(false);

  return (
    <div style={{width: "100%"}}>
      {label && <LabelStyle dark={dark}>{label}</LabelStyle>}
      <div
        style={{
          display: "grid",
          alignItems: "center",
          gridTemplateColumns: "1fr 25px",
          border: "1px solid #ccc",
          gap: "1rem",
        }}
      >
        <TextFieldStyle
          value={value}
          onChange={!disabled ? onChange : () => {
          }}
          onClick={onClick}
          placeholder={placeholder}
          type={shown ? "text" : "password"}
          dark={dark}
          onBlur={onBlur}
          disabled={disabled}
          style={{border: "none", outline: "none"}}
        />
        <div>
          <i
            className={"fas " + (shown ? "fas fa-eye-slash" : "fas fa-eye")}
            onClick={() => setIsShown(!shown)}
          ></i>
        </div>
      </div>
      {error && <ErrorStyle>{error}</ErrorStyle>}
    </div>
  );
};

// Form

export const Form = ({children, onSubmit, margin, padding, width}) => {
  return (
    <FormStyle
      width={width}
      onSubmit={onSubmit}
      margin={margin}
      padding={padding}
    >
      {children}
    </FormStyle>
  );
};

Form.TextArea = TextArea;
Form.TextField = TextField;
Form.Switch = Switch;
Form.Select = Select;
Form.PasswordField = PasswordField;
