import React from 'react';
import ModalCloseButton from '../../../../components/buttons/ModalCloseButton';
import ModalHeading from '../../../../components/headings/ModalHeading';
import PharmacyOrderForm from './PharmacyOrderForm';

const CreateOrderModal = ({
    addPharmacyOrder,
    suppliers,
    categories,
    unitTypes,
    pharmacyOrders,
    modalTableHead1,
    modalTableHead2
}) => {
    return (
        <>
            <input type="checkbox" id="create-new-product" className="modal-toggle" />
            <label htmlFor="create-new-product" className="modal cursor-pointer z-50">
                <label className="modal-box lg:w-8/12 md:w-8/12 w-11/12 max-w-4xl relative" htmlFor="">
                    <ModalCloseButton modalId={'create-new-product'} />
                    <ModalHeading modalHeading={'Create a Pharmacy Order'} />
                    
                    <PharmacyOrderForm
                        addPharmacyOrder={addPharmacyOrder}
                        suppliers={suppliers}
                        categories={categories}
                        unitTypes={unitTypes}
                        pharmacyOrders={pharmacyOrders}
                        modalTableHead1={modalTableHead1}
                        modalTableHead2={modalTableHead2}
                    />
                </label>
            </label>
        </>
    );
};

export default CreateOrderModal; 