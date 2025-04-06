import React from 'react';
import ModalCloseButton from '../../../../components/buttons/ModalCloseButton';
import ModalHeading from '../../../../components/headings/ModalHeading';
import Input from '../../../../components/form/Input';
import Select from '../../../../components/form/Select';
import SaveButton from '../../../../components/buttons/SaveButton';
import CancelButton from '../../../../components/buttons/CancelButton';

const AddProductModal = ({ addPharmacyProduct, categories, companies, isLoading }) => {
    return (
        <>
            <input type="checkbox" id="create-new-product" className="modal-toggle" />
            <div className="modal">
                <div className="modal-box w-11/12 max-w-5xl">
                    <ModalCloseButton modalId={'create-new-product'} />
                    <ModalHeading modalHeading={'Add New Pharmacy Product'} />
                    
                    <form onSubmit={addPharmacyProduct} className="mt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                            {/* Trade Name */}
                            <div>
                                <Input 
                                    title={'Trade Name'}
                                    name='tradeName'
                                    isRequired='required'
                                    type='text'
                                    placeholder="Enter trade name"
                                />
                            </div>
                            
                            {/* Generic Name */}
                            <div>
                                <Input 
                                    title={'Generic Name'}
                                    name='genericName'
                                    isRequired='required'
                                    type='text'
                                    placeholder="Enter generic name"
                                />
                            </div>
                            
                            {/* Strength */}
                            <div>
                                <Input 
                                    title={'Strength'}
                                    name='strength'
                                    isRequired='required'
                                    type='text'
                                    placeholder="e.g. 500mg, 10mg/ml"
                                />
                            </div>
                            
                            {/* Category */}
                            <div>
                                <Select 
                                    title={'Category'}
                                    name='category'
                                    isRequired='required'
                                    options={categories.map(c => c.name)}
                                />
                            </div>
                            
                            {/* Company */}
                            <div>
                                <Select 
                                    title={'Company'}
                                    name='company'
                                    isRequired='required'
                                    options={companies.map(c => c.Name)}
                                />
                            </div>
                            
                            {/* Pack Type */}
                            <div>
                                <Select 
                                    title={'Pack Type'}
                                    name='packType'
                                    isRequired='required'
                                    options={['Box', 'Bottle', 'Strip', 'Vial', 'Ampoule', 'Tube', 'Sachet', 'Other']}
                                />
                            </div>
                            
                            {/* Stock */}
                            <div>
                                <Input 
                                    title={'Stock Quantity'}
                                    name='stock'
                                    type='number'
                                    min="0"
                                    placeholder="Enter initial stock"
                                />
                            </div>
                            
                            {/* Pack TP */}
                            <div>
                                <Input 
                                    title={'Pack TP (৳)'}
                                    name='packTp'
                                    isRequired='required'
                                    type='number'
                                    step="0.01"
                                    min="0"
                                    placeholder="Enter pack trade price"
                                />
                            </div>
                            
                            {/* Unit TP */}
                            <div>
                                <Input 
                                    title={'Unit TP (৳)'}
                                    name='unitTp'
                                    type='number'
                                    step="0.01"
                                    min="0"
                                    placeholder="Enter unit trade price"
                                />
                            </div>
                            
                            {/* Pack MRP */}
                            <div>
                                <Input 
                                    title={'Pack MRP (৳)'}
                                    name='packMrp'
                                    isRequired='required'
                                    type='number'
                                    step="0.01"
                                    min="0"
                                    placeholder="Enter pack retail price"
                                />
                            </div>
                            
                            {/* Unit MRP */}
                            <div>
                                <Input 
                                    title={'Unit MRP (৳)'}
                                    name='unitMrp'
                                    type='number'
                                    step="0.01"
                                    min="0"
                                    placeholder="Enter unit retail price"
                                />
                            </div>
                        </div>
                        
                        <div className="divider">VAT & Discount</div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                            {/* Purchase VAT % */}
                            <div>
                                <Input 
                                    title={'Purchase VAT (%)'}
                                    name='purchaseVatPercent'
                                    type='number'
                                    step="0.01"
                                    min="0"
                                    max="100"
                                    placeholder="Enter VAT %"
                                />
                            </div>
                            
                            {/* Purchase Discount % */}
                            <div>
                                <Input 
                                    title={'Purchase Discount (%)'}
                                    name='purchaseDiscountPercent'
                                    type='number'
                                    step="0.01"
                                    min="0"
                                    max="100"
                                    placeholder="Enter discount %"
                                />
                            </div>
                            
                            {/* Sales VAT % */}
                            <div>
                                <Input 
                                    title={'Sales VAT (%)'}
                                    name='salesVatPercent'
                                    type='number'
                                    step="0.01"
                                    min="0"
                                    max="100"
                                    placeholder="Enter VAT %"
                                />
                            </div>
                            
                            {/* Sales Discount % */}
                            <div>
                                <Input 
                                    title={'Sales Discount (%)'}
                                    name='salesDiscountPercent'
                                    type='number'
                                    step="0.01"
                                    min="0"
                                    max="100"
                                    placeholder="Enter discount %"
                                />
                            </div>
                        </div>
                        
                        <div className="flex justify-end space-x-2 mt-6">
                            <CancelButton 
                                onClick={() => document.getElementById('create-new-product').checked = false}
                            />
                            <SaveButton 
                                disabled={isLoading}
                                customText={isLoading ? "Saving..." : "Save Product"}
                            />
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default AddProductModal; 