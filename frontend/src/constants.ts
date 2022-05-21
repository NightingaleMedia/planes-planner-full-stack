export const THEMES = {
    LIGHT: 'LIGHT',
    DARK: 'DARK',
    NATURE: 'NATURE',
}

export const UNITS = [
    {
        name: 'in',
        value: 'IN',
    },
    {
        name: 'cm',
        value: 'CM',
    },
]

export const WEIGHTS = [
    {
        name: 'lbs',
        value: 'LBS',
    },
    {
        name: 'kg',
        value: 'KG',
    },
]

export const PACKAGE_TYPES = {
    PALLET: 'Pallet',
    CARTON: 'Carton',
    EACH: 'Each',
    ENVELOPE: 'Envelope',
    CRATE: 'Crate',
    ROLL: 'Roll',
    TUBE: 'Tube',
    BUNDLE: 'Bundle',
}

// TODO
export const PO_STATUSES = {}

export enum POStatuses {
    new = 'New',
    inprogress = 'In Progress',
    readyToShipPartial = 'Ready To Ship Partial',
    readyToShipInFull = 'Ready To Ship In Full',
    shipped = 'Shipped',
    delivered = 'Delivered',
    cancelled = 'Cancelled',
}

export const ROLES = {
    SUPERADMIN: 'Super Admin',
    VENDORADMIN: 'Vendor Admin',
    VENDORUSER: 'Vendor User',
}

export const ROLE_ID = {
    1: 'Super Admin',
    2: 'Admin',
    3: 'User',
    4: 'Vendor Admin',
}

export const TOKEN_NAME = 'planes-auth-token'

export const LOCKED_STATUS = [
    // "readyToShipPartial",
    'readyToShipInFull',
    'shipped',
    'delivered',
    'cancelled',
]

export const HSLS = [0, 20, 40, 50, 90, 260, 230, 280, 330]

export const statusMap = {
    new: 1636,
    inprogress: 1636,
    readyToShipPartial: 10489,
    readyToShipInFull: 10490,
    shipped: 7,
    delivered: 6,
    cancelled: 12,
}
