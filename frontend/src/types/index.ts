import { NextApiRequest } from 'next'

export type PurchaseOrderDetails = {
    PurchaseOrderDetailId: 402011
    PurchaseOrderId: 35492
    LineNbr: 5
    ItemNbr: '23B5505X'
    ItemDesc: 'CENTER SHELF CLIP W/ 2 SCREWS'
    ItemQty: '876'
    ItemAmt: 87.6
    ItemUOM: 'EA'
    OrigCountry: null
    DestCountry: null
    EU: null
    HTSItem: null
    HTSCode: null
    CreateDt: '2011-05-09T13:19:02.856Z'
    CreateUser: 'lajohnso'
    UpdateDt: '2011-06-16T13:46:49.126Z'
    UpdateUser: 'lajohnso'
}

export type PurchaseOrderId__Props = {
    purchaseOrderId: number
}

export type ApiUser = {
    id: string
    vendorId: number
    firstName: string
    lastName: string
    email: string
    role: 'VENDORUSER' | 'VENDORADMIN' | 'SUPERADMIN'
}

export type ApiVendor = {
    id: string
    vendorId: number
    vendorName: string
    vendorLongName: null | string
}
export declare interface NextApiRequest__User extends NextApiRequest {
    user: ApiUser
}
