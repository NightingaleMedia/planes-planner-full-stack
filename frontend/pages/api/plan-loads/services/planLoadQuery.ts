export type PlanLoadQuery = {
    PurchaseOrderId: number
    EntityOwnerId: number
    VendorId: number
    POLocationId: number
    POStatus: string
    PurchaseOrderNbr: number
    PurchaseOrderDate: string
    ProjectId: number
    ProjectDesc: string
    StoreNbr: string
    ShipDt: string
    VendorCode: number
    VendorName: string
    VendorLocation: number | null
    BusinessUnit: string
    AccountNbr: number
    PurchaseOrderDueDate: string
    PurchaseOrderReference: string
    PurchaseOrderLocation: 31176
    Currency: string
    PurchaseOrderNotify: null
    CreateDt: string
    CreateUser: string
    UpdateDt: string
    UpdateUser: string
    LoadName: string
    PlanLoadId: number
    PurchaseOrderIndex: number
    LocationName: string
    LocationId: number
}

export const PLAN_LOAD_QUERY = (purchaseOrderId, where) => {
    return `
            select 
                po.*, 
                pl.LoadName, 
                pl.PlanLoadId, 
                pl.PurchaseOrderIndex, 
                l.LocationName,
                l.LocationId
            from PurchaseOrders po
            left join PlanLoads pl
                on pl.PurchaseOrderId = po.PurchaseOrderId
            left join Locations l
                on l.LocationId = pl.LocationId
            where 
                po.VendorId ${where}
                and po.PurchaseOrderId = ${purchaseOrderId}
            order by 
                PurchaseOrderId
`
}
