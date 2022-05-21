import VendorEditProvider from 'src/contexts/VendorEditContext'
import VendorModule from 'src/components/PlanesDashboard/Vendors/VendorModule'

const Vendors = () => {
    return (
        <VendorEditProvider>
            <VendorModule />
        </VendorEditProvider>
    )
}

export default Vendors
