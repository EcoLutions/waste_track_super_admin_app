import {Component, effect, input, OnInit, output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';

import {InputTextModule} from 'primeng/inputtext';
import {ButtonModule} from 'primeng/button';

@Component({
  selector: 'app-device-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
  ],
  template: `
    <div class="bg-white rounded-lg border border-gray-200 p-6">
      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-6">

        <!-- Device Identifier -->
        <div class="space-y-2">
          <label for="deviceIdentifier" class="block text-sm font-medium text-gray-700">
            Identificador del Dispositivo
            <span class="text-red-500">*</span>
          </label>

          <input
            pInputText
            id="deviceIdentifier"
            formControlName="deviceIdentifier"
            placeholder="Ej: 134ABC"
            class="w-full"
            [ngClass]="{
              'ng-invalid ng-dirty': isFieldInvalid('deviceIdentifier')
            }"
          />

          @if (isFieldInvalid('deviceIdentifier')) {
            <div class="flex items-center gap-1 text-xs text-red-600">
              <i class="pi pi-exclamation-circle"></i>
              <span>{{ getFieldError('deviceIdentifier') }}</span>
            </div>
          }
        </div>

        <!-- Actions -->
        <div class="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <button
            pButton
            type="button"
            class="p-button-outlined"
            (click)="onCancel()"
            [disabled]="loading()"
          >
            <span pButtonLabel>Cancelar</span>
            <i pButtonIcon class="pi pi-times"></i>
          </button>

          <button
            pButton
            type="submit"
            class="bg-gradient-to-r from-green-600 to-green-700 border-0"
            [disabled]="form.invalid || loading()"
          >
            <span pButtonLabel>Guardar Dispositivo</span>
            <i pButtonIcon [ngClass]="loading() ? 'pi pi-spinner pi-spin' : 'pi pi-check'"></i>
          </button>
        </div>

      </form>
    </div>
  `,
})
export class DeviceFormComponent implements OnInit {
  loading = input<boolean>(false);

  formSubmit = output<{ deviceIdentifier: string }>();
  formCancel = output<void>();

  form!: FormGroup;

  constructor(private fb: FormBuilder) {
    effect(() => {
      if (this.loading()) {
        this.form.disable();
      } else {
        this.form.enable();
      }
    });
  }

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.form = this.fb.group({
      deviceIdentifier: [
        '',
        [Validators.required, Validators.minLength(3), Validators.maxLength(50)],
      ],
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.formSubmit.emit(this.form.value);
  }

  onCancel(): void {
    this.formCancel.emit();
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.form.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.form.get(fieldName);
    if (!field || !field.errors) return '';

    if (field.errors['required']) return 'Este campo es requerido';
    if (field.errors['minlength'])
      return `Mínimo ${field.errors['minlength'].requiredLength} caracteres`;
    if (field.errors['maxlength'])
      return `Máximo ${field.errors['maxlength'].requiredLength} caracteres`;

    return 'Campo inválido';
  }
}
