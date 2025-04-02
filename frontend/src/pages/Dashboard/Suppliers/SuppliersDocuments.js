import React from 'react';
import SaveButton from '../../../components/buttons/SaveButton';
import CancelButton from '../../../components/buttons/CancelButton';
import PrintButton from '../../../components/buttons/PrintButton';
import Input from '../../../components/form/Input';
import Select from '../../../components/form/Select';
import DoubleInput from '../../../components/form/DoubleInput';
import ModalCloseButton from '../../../components/buttons/ModalCloseButton';
import ModalHeading from '../../../components/headings/ModalHeading';
import { useState } from 'react';
import { useEffect } from 'react';
import RefreshButton from '../../../components/buttons/RefreshButton';
import TableRow from '../../../components/TableRow';
import EditButton from '../../../components/buttons/EditButton';
import DeleteButton from '../../../components/buttons/DeleteButton';
import { toast } from 'react-toastify';
import DashboardPageHeading from '../../../components/headings/DashboardPageHeading';
import UploadButton from '../../../components/buttons/UploadButton';

const SuppliersDocuments = () => {
    const tableHeadItems = ['SN', 'Code', 'Product name', 'Category', 'Strength', 'Company', 'Stock', 'Pack Type', 'Pack Size', 'Pack TP', 'Pack MRP', 'Unit TP', 'Unit MRP', 'Creator', 'Created At', 'Actions'];

    const tableHead = <tr>
        {
            tableHeadItems?.map((tableHeadItem, index) => <th key={index} className='text-xs md:text-2xs lg:text-md' >{tableHeadItem}</th>)
        }
    </tr>;


    // Add these state variables after the existing useState declarations
    const [isEditing, setIsEditing] = useState(false);
    const [editingDocument, setEditingDocument] = useState(null);

    // Add these functions before the return statement
    const handleEdit = (doc) => {
        setEditingDocument(doc);
        setIsEditing(true);
        document.getElementById('update-pharmacy-product').checked = true;
    };

    const handleUpdate = async (event) => {
        event.preventDefault();

        if (!editingDocument) {
            toast.error("No document selected for update");
            return;
        }

        const formData = new FormData(event.target);
        const updatedData = {
            tradeName: formData.get('tradeName')?.trim(),
            genericName: formData.get('genericName')?.trim(),
            strength: formData.get('strength'),
            category: formData.get('category'),
            company: formData.get('company'),
            packType: formData.get('packType'),
            purchaseUnitType: formData.get('purchaseUnitType'),
            purchasePackSize: formData.get('packSize'),
            packTp: formData.get('packTp'),
            unitTp: formData.get('unitTp'),
            purchaseVatPercent: formData.get('purchaseVatPercent'),
            purchaseVatTaka: formData.get('purchaseVatTaka'),
            purchaseDiscountPercent: formData.get('purchaseDiscountPercent'),
            purchaseDiscountTaka: formData.get('purchaseDiscountTaka'),
            salesUnitType: formData.get('salesUnitType'),
            salePackSize: formData.get('salePackSize'),
            packMrp: formData.get('packMrp'),
            unitMrp: formData.get('unitMrp'),
            salesVatPercent: formData.get('salesVatPercent'),
            salesVatTaka: formData.get('salesVatTaka'),
            salesDiscountPercent: formData.get('salesDiscountPercent'),
            salesDiscountTaka: formData.get('salesDiscountTaka'),
            updatedBy: 'admin',
            updatedAt: new Date().toISOString()
        };

        try {
            const response = await fetch(`http://localhost:5000/api/suppliers/documents/${editingDocument._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedData)
            });

            if (response.ok) {
                // Refresh the documents list
                fetch('http://localhost:5000/api/suppliers/documents')
                    .then(res => res.json())
                    .then(products => setDocuments(products));

                document.getElementById('update-pharmacy-product').checked = false;
                setEditingDocument(null);
                setIsEditing(false);

                toast(
                    <div className="alert alert-success shadow-lg">
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <span>Document updated successfully.</span>
                        </div>
                    </div>
                );
            } else {
                throw new Error('Update failed');
            }
        } catch (error) {
            console.error("Update error:", error);
            toast.error("Failed to update document");
        }
    };


    const addNonPharmacyProduct = event => {
        event.preventDefault();

        const tradeName = event?.target?.tradeName?.value;
        const genericName = event?.target?.genericName?.value;
        const strength = event?.target?.strength?.value;
        const category = event?.target?.category?.value;
        const company = event?.target?.company?.value;
        const stock = event?.target?.stock?.value;
        const packType = event?.target?.packType?.value;
        const purchaseUnitType = event?.target?.purchaseUnitType?.value;
        const purchasePackSize = event?.target?.purchasePackSize?.value;
        const packTp = event?.target?.packTp?.value;
        const unitTp = event?.target?.unitTp?.value;
        const purchaseVatPercent = event?.target?.purchaseVatPercent?.value;
        const purchaseVatTaka = event?.target?.purchaseVatTaka?.value;
        const purchaseDiscountPercent = event?.target?.purchaseDiscountPercent?.value;
        const purchaseDiscountTaka = event?.target?.purchaseDiscountTaka?.value;
        const salesUnitType = event?.target?.salesUnitType?.value;
        const salePackSize = event?.target?.salePackSize?.value;
        const packMrp = event?.target?.packMrp?.value;
        const unitMrp = event?.target?.unitMrp?.value;
        const salesVatPercent = event?.target?.salesVatPercent?.value;
        const salesVatTaka = event?.target?.salesVatTaka?.value;
        const salesDiscountPercent = event?.target?.salesDiscountPercent?.value;
        const salesDiscountTaka = event?.target?.salesDiscountTaka?.value;
        const addedBy = 'admin';
        const addedToDbAt = new Date();

        const productDetails = { tradeName, genericName, strength, category, company, stock, packType, purchaseUnitType, purchasePackSize, packTp, unitTp, purchaseVatPercent, purchaseVatTaka, purchaseDiscountPercent, purchaseDiscountTaka, salesUnitType, salePackSize, packMrp, unitMrp, salesVatPercent, salesVatTaka, salesDiscountPercent, salesDiscountTaka, addedBy, addedToDbAt };

        // send data to server
        fetch('http://localhost:5000/api/suppliers/documents', {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(productDetails)
        })
            .then(res => res.json())
            .then(data => {
                toast(
                    <div className="alert alert-success shadow-lg">
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <span>{tradeName} added successfully.</span>
                        </div>
                    </div>
                );
            });

        event.target.reset();
    };

    const [documents, setDocuments] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/api/suppliers/documents')
            .then(res => res.json())
            .then(products => setDocuments(products));
    }, []);

    return (
        <section className='p-4 mt-16'>
            <DashboardPageHeading
                name='Suppliers Documents'
                value={documents.length}
                buttons={[
                    <UploadButton />,
                    <RefreshButton />,
                    <PrintButton />
                ]}
            />

            <input type="checkbox" id="create-new-product" className="modal-toggle" />
            <label htmlFor="create-new-product" className="modal cursor-pointer">
                <label className="modal-box lg:w-7/12 md:w-10/12 w-11/12 max-w-4xl relative" htmlFor="">
                    <ModalCloseButton modalId={'create-new-product'} />

                    <ModalHeading modalHeading={'Create a New Supplier Document'} />

                    <form onSubmit={addNonPharmacyProduct}>
                        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-1 mb-2'>
                            <Input title={'Trade Name'} type='text' placeholder='Trade name' name='tradeName' isRequired='required' />
                            <Input title={'Generic Name'} type='text' placeholder='Generic name' name='genericName' isRequired='required' />
                            <Input title={'Strength'} type='number' placeholder='Strength' name='strength' isRequired='required' />

                            <Select title={'Category'} name='category' isRequired='required' />
                            <Select title={'Company'} name='company' isRequired='required' />
                            <Input title={'Stock'} type='number' placeholder='Stock' name='stock' isRequired='required' />
                            <Select title={'Pack Type'} name='packType' isRequired='required' />
                        </div>

                        <div className="flex flex-col w-full lg:flex-row mt-4 place-content-center">
                            <div className="grid">
                                <h3 className='text-xl'>Purchase Area</h3>

                                <div className='grid grid-cols-2 gap-x-4'>
                                    <Select title={'Purchase Unit Type'} name='purchaseUnitType' isRequired='required' />
                                    <Input title={'Pack Size'} type='number' placeholder='Pack size' name='packSize' isRequired='required' />
                                </div>

                                <div className='grid grid-cols-2 gap-x-4'>
                                    <Input title={'Pack TP'} type='number' placeholder='Pack TP' name='packTp' isRequired='required' />
                                    <Input title={'Unit TP'} type='number' placeholder='Unit TP' name='unitTp' isRequired='required' />
                                </div>

                                <DoubleInput title={'Purchase VAT'} name1='purchaseVatPercent' name2='purchaseVatTaka' type1='number' type2='number' placeholder1='%' placeholder2='In taka' />
                                <DoubleInput title={'Purchase Discount'} name1='purchaseDiscountPercent' name2='purchaseDiscountTaka' type1='number' type2='number' placeholder1='%' placeholder2='In taka' />

                                <SaveButton extraClass={'mt-4'} />
                            </div>

                            <div className="divider lg:divider-horizontal"></div>

                            <div className="grid">
                                <h3 className='text-xl'>Sale Area</h3>

                                <div className='grid grid-cols-2 gap-x-4'>
                                    <Select title={'Sales Unit Type'} name='salesUnitType' isRequired='required' />
                                    <Input title={'Pack Size'} type='number' name='salePackSize' placeholder='Pack size' isRequired='required' />
                                </div>

                                <div className='grid grid-cols-2 gap-x-4'>
                                    <Input title={'Pack MRP'} type='number' name='packMrp' placeholder='Pack MRP' isRequired='required' />
                                    <Input title={'Unit MRP'} type='number' name='unitMrp' placeholder='Unit MRP' isRequired='required' />
                                </div>

                                <DoubleInput title={'Sales VAT'} name1='salesVatPercent' name2='salesVatTaka' type1='number' type2='number' placeholder1='%' placeholder2='In taka' />
                                <DoubleInput title={'Sales Discount'} name1='salesDiscountPercent' name2='salesDiscountTaka' type1='number' type2='number' placeholder1='%' placeholder2='In taka' />

                                <CancelButton extraClass={'mt-4'} />
                            </div>
                        </div>
                    </form>
                </label>
            </label>


            <input type="checkbox" id="update-pharmacy-product" className="modal-toggle" />
            <label htmlFor="update-pharmacy-product" className="modal cursor-pointer">
                <label className="modal-box w-11/12 max-w-4xl relative" htmlFor="">
                    <ModalCloseButton modalId={'update-pharmacy-product'} />
                    <ModalHeading modalHeading={'Update a Supplier Document'} />

                    {editingDocument && (
                        <form onSubmit={handleUpdate}>
                            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-1 mb-2'>
                                <Input
                                    title={'Trade Name'}
                                    type='text'
                                    name='tradeName'
                                    isRequired='required'
                                    defaultValue={editingDocument.tradeName}
                                />
                                <Input
                                    title={'Generic Name'}
                                    type='text'
                                    name='genericName'
                                    isRequired='required'
                                    defaultValue={editingDocument.genericName}
                                />
                                <Input
                                    title={'Strength'}
                                    type='number'
                                    name='strength'
                                    isRequired='required'
                                    defaultValue={editingDocument.strength}
                                />
                                <Select
                                    title={'Category'}
                                    name='category'
                                    isRequired='required'
                                    defaultValue={editingDocument.category}
                                />
                                <Select
                                    title={'Company'}
                                    name='company'
                                    isRequired='required'
                                    defaultValue={editingDocument.company}
                                />
                                <Input
                                    title={'Stock'}
                                    type='number'
                                    name='stock'
                                    isRequired='required'
                                    defaultValue={editingDocument.stock}
                                />
                                <Select
                                    title={'Pack Type'}
                                    name='packType'
                                    isRequired='required'
                                    defaultValue={editingDocument.packType}
                                />
                            </div>

                            <div className="flex flex-col w-full lg:flex-row mt-4 place-content-center">
                                <div className="grid">
                                    <h3 className='text-xl'>Purchase Area</h3>

                                    <div className='grid grid-cols-2 gap-x-4'>
                                        <Select
                                            title={'Purchase Unit Type'}
                                            name='purchaseUnitType'
                                            isRequired='required'
                                            defaultValue={editingDocument.purchaseUnitType}
                                        />
                                        <Input
                                            title={'Pack Size'}
                                            type='number'
                                            name='packSize'
                                            isRequired='required'
                                            defaultValue={editingDocument.purchasePackSize}
                                        />
                                    </div>

                                    <div className='grid grid-cols-2 gap-x-4'>
                                        <Input
                                            title={'Pack TP'}
                                            type='number'
                                            name='packTp'
                                            isRequired='required'
                                            defaultValue={editingDocument.packTp}
                                        />
                                        <Input
                                            title={'Unit TP'}
                                            type='number'
                                            name='unitTp'
                                            isRequired='required'
                                            defaultValue={editingDocument.unitTp}
                                        />
                                    </div>

                                    <DoubleInput
                                        title={'Purchase VAT'}
                                        name1='purchaseVatPercent'
                                        name2='purchaseVatTaka'
                                        type1='number'
                                        type2='number'
                                        placeholder1='%'
                                        placeholder2='In taka'
                                        defaultValue1={editingDocument.purchaseVatPercent}
                                        defaultValue2={editingDocument.purchaseVatTaka}
                                    />
                                    <DoubleInput
                                        title={'Purchase Discount'}
                                        name1='purchaseDiscountPercent'
                                        name2='purchaseDiscountTaka'
                                        type1='number'
                                        type2='number'
                                        placeholder1='%'
                                        placeholder2='In taka'
                                        defaultValue1={editingDocument.purchaseDiscountPercent}
                                        defaultValue2={editingDocument.purchaseDiscountTaka}
                                    />

                                    <SaveButton extraClass={'mt-4'} />
                                </div>

                                <div className="divider lg:divider-horizontal"></div>

                                <div className="grid">
                                    <h3 className='text-xl'>Sale Area</h3>

                                    <div className='grid grid-cols-2 gap-x-4'>
                                        <Select
                                            title={'Sales Unit Type'}
                                            name='salesUnitType'
                                            isRequired='required'
                                            defaultValue={editingDocument.salesUnitType}
                                        />
                                        <Input
                                            title={'Pack Size'}
                                            type='number'
                                            name='salePackSize'
                                            isRequired='required'
                                            defaultValue={editingDocument.salePackSize}
                                        />
                                    </div>

                                    <div className='grid grid-cols-2 gap-x-4'>
                                        <Input
                                            title={'Pack MRP'}
                                            type='number'
                                            name='packMrp'
                                            isRequired='required'
                                            defaultValue={editingDocument.packMrp}
                                        />
                                        <Input
                                            title={'Unit MRP'}
                                            type='number'
                                            name='unitMrp'
                                            isRequired='required'
                                            defaultValue={editingDocument.unitMrp}
                                        />
                                    </div>

                                    <DoubleInput
                                        title={'Sales VAT'}
                                        name1='salesVatPercent'
                                        name2='salesVatTaka'
                                        type1='number'
                                        type2='number'
                                        placeholder1='%'
                                        placeholder2='In taka'
                                        defaultValue1={editingDocument.salesVatPercent}
                                        defaultValue2={editingDocument.salesVatTaka}
                                    />
                                    <DoubleInput
                                        title={'Sales Discount'}
                                        name1='salesDiscountPercent'
                                        name2='salesDiscountTaka'
                                        type1='number'
                                        type2='number'
                                        placeholder1='%'
                                        placeholder2='In taka'
                                        defaultValue1={editingDocument.salesDiscountPercent}
                                        defaultValue2={editingDocument.salesDiscountTaka}
                                    />

                                    <CancelButton
                                        extraClass={'mt-4'}
                                        onClick={() => {
                                            document.getElementById('update-pharmacy-product').checked = false;
                                            setEditingDocument(null);
                                            setIsEditing(false);
                                        }}
                                    />
                                </div>
                            </div>
                        </form>
                    )}
                </label>
            </label>

            <table className="table table-zebra table-compact">
                <thead>
                    {
                        tableHead
                    }
                </thead>
                <tbody>
                    {
                        documents.map((product, index) =>
                            // Update the EditButton in the TableRow component to include the onClick handler
                            <TableRow
                                key={product._id}
                                tableRowsData={
                                    [
                                        index + 1,
                                        product.genericName,
                                        product.tradeName,
                                        product.category,
                                        product.strength,
                                        product.company,
                                        product.stock,
                                        product.packType,
                                        product.salePackSize,
                                        product.packTp,
                                        product.packMrp,
                                        product.unitTp,
                                        product.unitMrp,
                                        product.addedBy,
                                        product?.addedToDbAt?.slice(0, 10),
                                        <span className='flex items-center gap-x-1'>
                                            <EditButton onClick={() => handleEdit(product)} />
                                            <DeleteButton
                                                deleteApiLink='http://localhost:5000/api/suppliers/documents/'
                                                itemId={product._id} />
                                        </span>
                                    ]
                                } />)
                    }
                </tbody>
            </table>
        </section >
    );
};

export default SuppliersDocuments;