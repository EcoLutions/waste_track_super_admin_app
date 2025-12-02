import {Component, effect, input, OnInit, output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators,} from '@angular/forms';
import {DistrictEntity} from '@entities/district/model';
import {PlanCatalogEntity} from '@entities/plan-catalog/model';
import {InputTextModule} from 'primeng/inputtext';
import {ButtonModule} from 'primeng/button';
import {SelectModule} from 'primeng/select';
import {CurrencyMapper} from '@shared/model/mappers/currency.mapper';
import {BillingPeriodMapper} from '@shared/model/mappers/billing-period.mapper';

@Component({
  selector: 'app-district-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    SelectModule,
  ],
  template: `
    <div class="bg-white rounded-lg border border-gray-200 p-6">
      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-6">
        <!-- Nombre del Distrito -->
        <div class="space-y-2">
          <label for="name" class="block text-sm font-medium text-gray-700">
            Nombre del Distrito
            <span class="text-red-500">*</span>
          </label>
          <input
            pInputText
            id="name"
            formControlName="name"
            placeholder="Ej: Municipalidad de San Isidro"
            class="w-full"
            [ngClass]="{
              'ng-invalid ng-dirty': isFieldInvalid('name')
            }"
          />
          @if (isFieldInvalid('name')) {
            <div class="flex items-center gap-1 text-xs text-red-600">
              <i class="pi pi-exclamation-circle"></i>
              <span>{{ getFieldError('name') }}</span>
            </div>
          }
        </div>

        <!-- Código -->
        <div class="space-y-2">
          <label for="code" class="block text-sm font-medium text-gray-700">
            Código
            <span class="text-red-500">*</span>
          </label>
          <input
            pInputText
            id="code"
            formControlName="code"
            placeholder="Ej: SI-001"
            class="w-full"
            [ngClass]="{
              'ng-invalid ng-dirty': isFieldInvalid('code')
            }"
          />
          @if (isFieldInvalid('code')) {
            <div class="flex items-center gap-1 text-xs text-red-600">
              <i class="pi pi-exclamation-circle"></i>
              <span>{{ getFieldError('code') }}</span>
            </div>
          }
        </div>

        <!-- Plan -->
        <div class="space-y-2">
          <label for="planId" class="block text-sm font-medium text-gray-700">
            Plan de Suscripción
            <span class="text-red-500">*</span>
          </label>
          <p-select
            id="planId"
            formControlName="planId"
            [options]="plans()"
            optionLabel="name"
            optionValue="id"
            placeholder="Seleccione un plan"
            appendTo="body"
            [style]="{'width': '100%'}"
            [ngClass]="{
              'ng-invalid ng-dirty': isFieldInvalid('planId')
            }"
          >
            <ng-template pTemplate="selectedItem" let-option>
              @if (option) {
                <div class="flex items-center gap-2">
                  <span class="font-medium">{{ option.name }}</span>
                  <span class="text-sm text-gray-500">
                    - {{ getCurrencySymbol(option.priceCurrency) }}{{ option.priceAmount }}/{{ getBillingPeriodShort(option.billingPeriod) }}
                  </span>
                </div>
              }
            </ng-template>
            <ng-template pTemplate="item" let-option>
              <div class="flex flex-col gap-1">
                <div class="flex items-center justify-between">
                  <span class="font-medium">{{ option.name }}</span>
                  <span class="text-sm font-semibold text-green-600">
                    {{ getCurrencySymbol(option.priceCurrency) }}{{ option.priceAmount }}
                  </span>
                </div>
                <div class="text-xs text-gray-500 flex gap-3">
                  <span>{{ getBillingPeriodLabel(option.billingPeriod) }}</span>
                  <span>·</span>
                  <span>{{ option.maxVehicles }} vehículos</span>
                  <span>·</span>
                  <span>{{ option.maxDrivers }} conductores</span>
                </div>
              </div>
            </ng-template>
          </p-select>
          @if (isFieldInvalid('planId')) {
            <div class="flex items-center gap-1 text-xs text-red-600">
              <i class="pi pi-exclamation-circle"></i>
              <span>{{ getFieldError('planId') }}</span>
            </div>
          }
        </div>

        <!-- Información del Administrador -->
        <div class="bg-gray-50 rounded-lg border border-gray-200 p-4 space-y-4">
          <h3 class="text-sm font-semibold text-gray-900 flex items-center gap-2">
            <i class="pi pi-user text-green-600"></i>
            Administrador Principal
          </h3>

          <!-- Email -->
          <div class="space-y-2">
            <label for="primaryAdminEmail" class="block text-sm font-medium text-gray-700">
              Email
              <span class="text-red-500">*</span>
            </label>
            <input
              pInputText
              id="primaryAdminEmail"
              formControlName="primaryAdminEmail"
              type="email"
              placeholder="admin@ejemplo.com"
              class="w-full"
              [ngClass]="{
                'ng-invalid ng-dirty': isFieldInvalid('primaryAdminEmail')
              }"
            />
            @if (isFieldInvalid('primaryAdminEmail')) {
              <div class="flex items-center gap-1 text-xs text-red-600">
                <i class="pi pi-exclamation-circle"></i>
                <span>{{ getFieldError('primaryAdminEmail') }}</span>
              </div>
            }
          </div>

          <!-- Username -->
          <div class="space-y-2">
            <label for="primaryAdminUsername" class="block text-sm font-medium text-gray-700">
              Nombre de Usuario
              <span class="text-red-500">*</span>
            </label>
            <input
              pInputText
              id="primaryAdminUsername"
              formControlName="primaryAdminUsername"
              placeholder="admin.sanisidro"
              class="w-full"
              [ngClass]="{
                'ng-invalid ng-dirty': isFieldInvalid('primaryAdminUsername')
              }"
            />
            @if (isFieldInvalid('primaryAdminUsername')) {
              <div class="flex items-center gap-1 text-xs text-red-600">
                <i class="pi pi-exclamation-circle"></i>
                <span>{{ getFieldError('primaryAdminUsername') }}</span>
              </div>
            }
          </div>
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
            <span pButtonLabel>Guardar Distrito</span>
            <i pButtonIcon [ngClass]="loading() ? 'pi pi-spinner pi-spin' : 'pi pi-check'"></i>
          </button>
        </div>
      </form>
    </div>
  `,
})
export class DistrictFormComponent implements OnInit {
  plans = input.required<PlanCatalogEntity[]>();
  loading = input<boolean>(false);

  formSubmit = output<Partial<DistrictEntity>>();
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
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      code: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
      planId: ['', [Validators.required]],
      primaryAdminEmail: ['', [Validators.required, Validators.email]],
      primaryAdminUsername: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
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
    if (field.errors['email']) return 'Email inválido';

    return 'Campo inválido';
  }

  getCurrencySymbol(currency: string): string {
    return CurrencyMapper.toSymbol(currency as any);
  }

  getBillingPeriodLabel(period: string): string {
    return BillingPeriodMapper.toLabel(period as any);
  }

  getBillingPeriodShort(period: string): string {
    return BillingPeriodMapper.toShortLabel(period as any);
  }
}
