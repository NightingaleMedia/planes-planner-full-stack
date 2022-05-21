import { PlanLoadShippingUnitDetails, PlanLoadShippingUnits, PurchaseOrderDetails } from '.prisma/client';
import prisma from '../../lib/db/prisma/index'

export interface PurchaseOrderDetails__Response extends PurchaseOrderDetails {
PurchaseOrderDetailId: never

}

export interface PlanLoadShippingUnitsWithItems extends PlanLoadShippingUnits {
    items: PlanLoadShippingUnitDetails[]
}