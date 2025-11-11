import {Component, effect, inject, input, output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {InputTextModule} from 'primeng/inputtext';
import {InputNumberModule} from 'primeng/inputnumber';
import {SelectModule} from 'primeng/select';
import {ButtonModule} from 'primeng/button';
import {PlanCatalogEntity} from '@entities/plan-catalog/model';
import {BillingPeriodEnum, CurrencyEnum} from '@shared/model';
import {BillingPeriodMapper} from '@shared/model/mappers/billing-period.mapper';
import {CurrencyMapper} from '@shared/model/mappers/currency.mapper';

interface BillingPeriodOption {
  label: string;
  value: BillingPeriodEnum;
}

interface CurrencyOption {
  label: string;
  value: CurrencyEnum;
  symbol: string;
}

@Component({
  selector: 'app-plan-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    InputNumberModule,
    SelectModule,
    ButtonModule,
  ],
  templateUrl: './plan-form.component.html',
})
export class PlanFormComponent {
  private fb = inject(FormBuilder);

  readonly plan = input<PlanCatalogEntity | null>(null);
  readonly loading = input<boolean>(false);

  readonly formSubmit = output<Partial<PlanCatalogEntity>>();
  readonly formCancel = output<void>();

  planForm!: FormGroup;

  billingPeriodOptions: BillingPeriodOption[] = [
    { label: BillingPeriodMapper.toLabel(BillingPeriodEnum.MONTHLY), value: BillingPeriodEnum.MONTHLY },
    { label: BillingPeriodMapper.toLabel(BillingPeriodEnum.YEARLY), value: BillingPeriodEnum.YEARLY },
  ];

  currencyOptions: CurrencyOption[] = [
    {
      label: CurrencyMapper.toLabel(CurrencyEnum.PEN),
      value: CurrencyEnum.PEN,
      symbol: CurrencyMapper.toSymbol(CurrencyEnum.PEN),
    },
    {
      label: CurrencyMapper.toLabel(CurrencyEnum.USD),
      value: CurrencyEnum.USD,
      symbol: CurrencyMapper.toSymbol(CurrencyEnum.USD),
    },
  ];

  constructor() {
    this.initForm();

    effect(() => {
      const plan = this.plan();
      if (plan) {
        this.populateForm(plan);
      } else {
        this.resetForm();
      }
    });
  }

  private initForm(): void {
    this.planForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      priceAmount: [0, [Validators.required, Validators.min(0.01)]],
      priceCurrency: [CurrencyEnum.PEN, Validators.required],
      billingPeriod: [BillingPeriodEnum.MONTHLY, Validators.required],
      maxVehicles: [1, [Validators.required, Validators.min(1)]],
      maxDrivers: [1, [Validators.required, Validators.min(1)]],
      maxContainers: [1, [Validators.required, Validators.min(1)]],
    });
  }

  private populateForm(plan: PlanCatalogEntity): void {
    this.planForm.patchValue({
      name: plan.name,
      priceAmount: plan.priceAmount,
      priceCurrency: plan.priceCurrency,
      billingPeriod: plan.billingPeriod,
      maxVehicles: plan.maxVehicles,
      maxDrivers: plan.maxDrivers,
      maxContainers: plan.maxContainers,
    });
  }

  private resetForm(): void {
    this.planForm.reset({
      name: '',
      priceAmount: 0,
      priceCurrency: CurrencyEnum.PEN,
      billingPeriod: BillingPeriodEnum.MONTHLY,
      maxVehicles: 1,
      maxDrivers: 1,
      maxContainers: 1,
    });
  }

  get isEditMode(): boolean {
    return this.plan() !== null;
  }

  get selectedCurrencySymbol(): string {
    const currency = this.planForm.get('priceCurrency')?.value;
    return CurrencyMapper.toSymbol(currency);
  }

  onSubmit(): void {
    if (this.planForm.invalid) {
      this.planForm.markAllAsTouched();
      return;
    }

    const formValue = this.planForm.value;
    this.formSubmit.emit(formValue);
  }

  onCancel(): void {
    this.formCancel.emit();
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.planForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.planForm.get(fieldName);
    if (!field || !field.errors) return '';

    if (field.errors['required']) return 'Este campo es requerido';
    if (field.errors['minlength'])
      return `Mínimo ${field.errors['minlength'].requiredLength} caracteres`;
    if (field.errors['maxlength'])
      return `Máximo ${field.errors['maxlength'].requiredLength} caracteres`;
    if (field.errors['min']) return `El valor mínimo es ${field.errors['min'].min}`;

    return 'Campo inválido';
  }
}
