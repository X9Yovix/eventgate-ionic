import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function tagLengthValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const selectedTags = control.value;

    if (selectedTags && selectedTags.length > 0) {
      return null;
    }

    return { tag_required: true };
  };
}
