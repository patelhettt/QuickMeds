import React, { useEffect, useState } from 'react';
import PrintButton from '../../../components/buttons/PrintButton';
import Input from '../../../components/form/Input';
import TableRow from '../../../components/TableRow';
import SaveButton from '../../../components/buttons/SaveButton';
import EditButton from '../../../components/buttons/EditButton';
import DeleteButton from '../../../components/buttons/DeleteButton';
import { toast } from 'react-toastify';
import RefreshButton from '../../../components/buttons/RefreshButton';
import DashboardPageHeading from '../../../components/headings/DashboardPageHeading';
import CancelButton from '../../../components/buttons/CancelButton';
import ModalCloseButton from '../../../components/buttons/ModalCloseButton';
import ModalHeading from '../../../components/headings/ModalHeading';
import NewButton from '../../../components/buttons/NewButton';

const SuppliersList = () => {
    const tableHeadItems = ['SN', 'Name', 'Phone', 'Website', 'Email', 'Address', 'Creator', 'Created At', 'Updated By', 'Updated At', 'Actions'];

    const tableHead = <tr>
        {
            tableHeadItems?.map((tableHeadItem, index) => <th key={index} className='text-xs' >{tableHeadItem}</th>)
        }
    </tr>;


    // Add these state variables after the existing useState declarations
    const [isEditing, setIsEditing] = useState(false);
    const [editingSupplier, setEditingSupplier] = useState(null);

    // Add these functions before the return statement
    const handleEdit = (supplier) => {
        setEditingSupplier(supplier);
        setIsEditing(true);
        document.getElementById('edit-supplier').checked = true;
    };

    const handleUpdate = async (event) => {
        event.preventDefault();
        try {
            const formData = new FormData(event.target);
            const updatedData = {
                name: formData.get('SupplierName')?.trim(),
                phone: formData.get('SupplierPhone')?.trim(),
                website: formData.get('SupplierWebsite')?.trim(),
                email: formData.get('SupplierEmail')?.trim(),
                address: formData.get('SupplierAddress')?.trim(),
                updatedBy: 'admin',
                updatedTime: new Date().toISOString()
            };

            // Validate required fields
            if (!updatedData.name || !updatedData.phone || !updatedData.email || !updatedData.address) {
                toast.error("All fields are required");
                return;
            }

            const response = await fetch(`http://localhost:5000/api/suppliers/lists/${editingSupplier._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedData)
            });

            if (response.ok) {
                // Refresh the suppliers list
                fetch('http://localhost:5000/api/suppliers/lists')
                    .then(res => res.json())
                    .then(suppliers => setSuppliers(suppliers));

                document.getElementById('edit-supplier').checked = false;
                setEditingSupplier(null);
                setIsEditing(false);

                toast(
                    <div className="alert alert-success shadow-lg">
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <span>Supplier updated successfully.</span>
                        </div>
                    </div>
                );
            } else {
                throw new Error('Update failed');
            }
        } catch (error) {
            console.error("Update error:", error);
            toast.error("Failed to update supplier");
        }
    };


    const addSupplier = event => {
        event.preventDefault();

        const name = event?.target?.SupplierName?.value;
        const phone = event?.target?.SupplierPhone?.value;
        const website = event?.target?.SupplierWebsite?.value;
        const email = event?.target?.SupplierEmail?.value;
        const address = event?.target?.SupplierAddress?.value;
        const addedBy = 'admin';
        const addedTime = new Date();
        const updatedBy = 'admin';
        const updatedTime = new Date();

        const supplierDetails = { name, phone, website, email, address, addedBy, addedTime, updatedBy, updatedTime };

        // send data to server
        fetch('http://localhost:5000/api/suppliers/lists', {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(supplierDetails)
        })
            .then(res => res.json())
            .then(data => {
                toast(
                    <div className="alert alert-success shadow-lg">
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <span>{name} added successfully.</span>
                        </div>
                    </div>
                );
            });
    };

    const [suppliers, setSuppliers] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/api/suppliers/lists')
            .then(res => res.json())
            .then(suppliers => setSuppliers(suppliers));
    }, []);

    return (
        <section className='p-4 mt-16'>
            <div>
                <DashboardPageHeading
                    name='Suppliers lists'
                    value={suppliers.length}
                    buttons={[
                        <NewButton modalId='create-new-product' />,
                        <RefreshButton />,
                        <PrintButton />
                    ]}
                />

                <input type="checkbox" id="create-new-product" className="modal-toggle" />
                <label htmlFor="create-new-product" className="modal cursor-pointer">
                    <label className="modal-box lg:w-5/12 md:w-5/12 w-11/12 max-w-4xl relative" htmlFor="">
                        <ModalCloseButton modalId={'create-new-product'} />

                        <ModalHeading modalHeading={'Add a new Supplier'} />

                        <form onSubmit={addSupplier} className='mx-auto'>
                            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 place-items-center gap-x-4 gap-y-2 mt-4 mb-8'>
                                <Input title={'Supplier Name'} name='SupplierName' isRequired='required' type='text' />
                                <Input title={'Supplier Phone'} name='SupplierPhone' isRequired='required' type='text' />
                                <Input title={'Supplier Website'} name='SupplierWebsite' isRequired='required' type='text' />
                                <Input title={'Supplier Email'} name='SupplierEmail' isRequired='required' type='email' />
                                <Input title={'Supplier Address'} name='SupplierAddress' isRequired='required' type='text' />
                            </div>

                            <div className="flex flex-col w-full lg:flex-row mt-4 place-content-center">
                                <div className="grid">
                                    <SaveButton extraClass='mt-4' />
                                </div>

                                <div className="divider lg:divider-horizontal hidden md:block lg:block"></div>

                                <div className="grid">
                                    <CancelButton extraClass='lg:mt-4 md:mt-3 mt-2' />
                                </div>
                            </div>
                        </form>
                    </label>
                </label>
            </div>

            <table className="table table-zebra table-compact w-full">
                <thead>
                    {
                        tableHead
                    }
                </thead>
                <tbody>
                    {
                        suppliers.map((supplier, index) =>
                            <TableRow key={supplier._id} tableRowsData={
                                [
                                    index + 1,
                                    supplier.name,
                                    supplier.phone,
                                    supplier.website, supplier.email,
                                    supplier.address,
                                    supplier.addedBy,
                                    supplier?.addedTime?.slice(0, 10),
                                    supplier.updatedBy,
                                    supplier?.updatedTime?.slice(0, 10),

                                    // Update the EditButton in the TableRow component
                                    <span className='flex items-center gap-x-1'>
                                        <EditButton onClick={() => handleEdit(supplier)} />
                                        <DeleteButton deleteApiLink='http://localhost:5000/api/suppliers/lists/' itemId={supplier._id} />
                                    </span>


                                ]
                            } />)
                    }
                </tbody>
            </table>
        
            <input type="checkbox" id="edit-supplier" className="modal-toggle" />
            <label htmlFor="edit-supplier" className="modal cursor-pointer">
                <label className="modal-box lg:w-5/12 md:w-5/12 w-11/12 max-w-4xl relative">
                    <ModalCloseButton modalId={'edit-supplier'} />
                    <ModalHeading modalHeading={'Update Supplier'} />
                    {editingSupplier && (
                        <form onSubmit={handleUpdate} className='mx-auto'>
                            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 place-items-center gap-x-4 gap-y-2 mt-4 mb-8'>
                                <Input
                                    title={'Supplier Name'}
                                    name='SupplierName'
                                    isRequired='required'
                                    type='text'
                                    defaultValue={editingSupplier.name}
                                />
                                <Input
                                    title={'Supplier Phone'}
                                    name='SupplierPhone'
                                    isRequired='required'
                                    type='text'
                                    defaultValue={editingSupplier.phone}
                                />
                                <Input
                                    title={'Supplier Website'}
                                    name='SupplierWebsite'
                                    isRequired='required'
                                    type='text'
                                    defaultValue={editingSupplier.website}
                                />
                                <Input
                                    title={'Supplier Email'}
                                    name='SupplierEmail'
                                    isRequired='required'
                                    type='email'
                                    defaultValue={editingSupplier.email}
                                />
                                <Input
                                    title={'Supplier Address'}
                                    name='SupplierAddress'
                                    isRequired='required'
                                    type='text'
                                    defaultValue={editingSupplier.address}
                                />
                            </div>
                            <div className="flex flex-col w-full lg:flex-row mt-4 place-content-center">
                                <div className="grid">
                                    <SaveButton extraClass='mt-4' />
                                </div>
                                <div className="divider lg:divider-horizontal hidden md:block lg:block"></div>
                                <div className="grid">
                                    <CancelButton
                                        extraClass='lg:mt-4 md:mt-3 mt-2'
                                        onClick={() => {
                                            document.getElementById('edit-supplier').checked = false;
                                            setEditingSupplier(null);
                                            setIsEditing(false);
                                        }}
                                    />
                                </div>
                            </div>
                        </form>
                    )}
                </label>
            </label>
        </section>
    );
};

export default SuppliersList;