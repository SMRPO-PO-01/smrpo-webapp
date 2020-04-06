import { AbstractControl } from '@angular/forms';

export const CUSTOM_VALIDATORS = {
  upperAndLowerLetters: (control: AbstractControl) =>
    control.value &&
    control.value !== control.value.toUpperCase() &&
    control.value !== control.value.toLowerCase()
      ? null
      : { noUpperAndLowerCase: { value: control.value } },

  atLeastOneNumber: (control: AbstractControl) =>
    /\d/.test(control.value) ? null : { noNumbers: { value: control.value } },

  passwordsMatch: (control: AbstractControl) => {
    if (control.get("password").value !== control.get("password2").value) {
      control.get("password2").setErrors({ noPasswordMatch: true });
      return { noPasswordMatch: true };
    }
  },

  isInt: (control: AbstractControl) =>
    Number.isInteger(control.value)
      ? null
      : { notInteger: { value: control.value } },
};
