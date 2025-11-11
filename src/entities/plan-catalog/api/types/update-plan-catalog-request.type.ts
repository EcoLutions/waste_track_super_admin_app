export interface UpdatePlanCatalogRequest {
  name: string | null;
  priceAmount: number | null;
  priceCurrency: string | null;
  billingPeriod: string | null;
  maxVehicles: number | null;
  maxDrivers: number | null;
  maxContainers: number | null;
}

