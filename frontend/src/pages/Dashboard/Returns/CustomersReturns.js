import React from 'react';
import SaveButton from '../../../components/buttons/SaveButton';
import CancelButton from '../../../components/buttons/CancelButton';
import PrintButton from '../../../components/buttons/PrintButton';
import NewButton from '../../../components/buttons/NewButton';
import Input from '../../../components/form/Input';
import Select from '../../../components/form/Select';
import DoubleInput from '../../../components/form/DoubleInput';
import ModalCloseButton from '../../../components/buttons/ModalCloseButton';
import ModalHeading from '../../../components/headings/ModalHeading';
import { useState, useEffect } from 'react';
import RefreshButton from '../../../components/buttons/RefreshButton';
import TableRow from '../../../components/TableRow';
import EditButton from '../../../components/buttons/EditButton';
import DeleteButton from '../../../components/buttons/DeleteButton';
import { toast } from 'react-toastify';
import DashboardPageHeading from '../../../components/headings/DashboardPageHeading';
import AddModal from '../../../components/modals/AddModal';

const CustomersReturns = () => {
    const tableHeadItems = ['SN', 'Code', 'Product name', 'Category', 'Strength', 'Company', 'Stock', 'Pack Type', 'Pack Size', 'Pack TP', 'Pack MRP', 'Unit TP', 'Unit MRP', 'Creator', 'Created At', 'Actions'];

    const tableHead = <tr>
        {
            tableHeadItems?.map((tableHeadItem, index) => <th key={index} className='text-xs md:text-2xs lg:text-md' >{tableHeadItem}</th>)
        }
    </tr>;

    const [customersReturns, setCustomersReturns] = useState([]);

    useEffect(() => {
        let isSubscribed = true;

        const fetchReturns = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/returns/customers');
                const data = await response.json();
                if (isSubscribed) {
                    setCustomersReturns(data);
                }
            } catch (error) {
                console.error('Error fetching customer returns:', error);
                if (isSubscribed) {
                    setCustomersReturns([]);
                }
            }
        };

        fetchReturns();

        return () => {
            isSubscribed = false;
        };
    }, []);

    const customerReturn = async (event) => {
        event.preventDefault();

        const formData = {
            tradeName: event?.target?.tradeName?.value,
            genericName: event?.target?.genericName?.value,
            strength: event?.target?.strength?.value,
            category: event?.target?.category?.value,
            company: event?.target?.company?.value,
            stock: event?.target?.stock?.value,
            packType: event?.target?.packType?.value,
            purchaseUnitType: event?.target?.purchaseUnitType?.value,
            purchasePackSize: event?.target?.purchasePackSize?.value,
            packTp: event?.target?.packTp?.value,
            unitTp: event?.target?.unitTp?.value,
            purchaseVatPercent: event?.target?.purchaseVatPercent?.value,
            purchaseVatTaka: event?.target?.purchaseVatTaka?.value,
            purchaseDiscountPercent: event?.target?.purchaseDiscountPercent?.value,
            purchaseDiscountTaka: event?.target?.purchaseDiscountTaka?.value,
            salesUnitType: event?.target?.salesUnitType?.value,
            salePackSize: event?.target?.salePackSize?.value,
            packMrp: event?.target?.packMrp?.value,
            unitMrp: event?.target?.unitMrp?.value,
            salesVatPercent: event?.target?.salesVatPercent?.value,
            salesVatTaka: event?.target?.salesVatTaka?.value,
            salesDiscountPercent: event?.target?.salesDiscountPercent?.value,
            salesDiscountTaka: event?.target?.salesDiscountTaka?.value,
            addedBy: 'admin',
            addedToDbAt: new Date()
        };

        try {
            const response = await fetch('http://localhost:5000/api/returns/customers', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            
            const data = await response.json();
            if (data) {
                toast(
                    <AddModal name={formData.tradeName} />
                );
                event.target.reset();
            }
        } catch (error) {
            console.error('Error submitting customer return:', error);
            toast.error('Failed to submit customer return');
        }
    };

    return (
        <section className='p-4 mt-16'>
            <DashboardPageHeading
                name='Customers Returns'
                value={customersReturns.length}
                buttons={[
                    <NewButton key="new" modalId='create-new-product' />,
                    <RefreshButton key="refresh" />,
                    <PrintButton key="print" />
                ]}
            />

            <input type="checkbox" id="create-new-product" className="modal-toggle" />
            <label htmlFor="create-new-product" className="modal cursor-pointer">
                <label className="modal-box lg:w-7/12 md:w-10/12 w-11/12 max-w-4xl relative" htmlFor="">
                    <ModalCloseButton modalId={'create-new-product'} />

                    <ModalHeading modalHeading={'Create a Customer Return'} />

                    <form onSubmit={customerReturn}>
                        <div className='grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-1 mb-2'>
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
                                    <Input title={'Pack Size'} type='number' placeholder='Pack size' name='purchasePackSize' isRequired='required' />
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

            {/* update a pharmacy product */}
            <input type="checkbox" id="update-pharmacy-product" className="modal-toggle" />
            <label htmlFor="update-pharmacy-product" className="modal cursor-pointer">
                <label className="modal-box lg:w-7/12 md:w-10/12 w-11/12 max-w-4xl relative" htmlFor="">
                    <ModalCloseButton modalId={'update-pharmacy-product'} />

                    <ModalHeading modalHeading={'Update a Pharmacy Product'} />

                    <form>
                        <div className='grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-1 mb-2'>
                            <Input title={'Trade Name'} name='tradeName' />
                            <Input title={'Generic Name'} name='genericName' />
                            <Input title={'Strength'} name='strength' />

                            <Select title={'Category'} />
                            <Select title={'Company'} />
                        </div>

                        <div className="flex flex-col w-full lg:flex-row mt-4 place-content-center">
                            <div className="grid">
                                <h3 className='text-xl'>Purchase Area</h3>

                                <div className='grid grid-cols-2 gap-x-4'>
                                    <Select title={'Purchase Unit Type'} />
                                    <Input title={'Pack Size'} name='packSize' />
                                </div>

                                <div className='grid grid-cols-2 gap-x-4'>
                                    <Input title={'Pack TP'} name='packTp' />
                                    <Input title={'Unit TP'} name='unitTp' />
                                </div>

                                <DoubleInput title={'Purchase VAT'} />
                                <DoubleInput title={'Purchase Discount'} />

                                <SaveButton extraClass='mt-4' />
                            </div>

                            <div className="divider lg:divider-horizontal"></div>

                            <div className="grid">
                                <h3 className='text-xl'>Sale Area</h3>

                                <div className='grid grid-cols-2 gap-x-4'>
                                    <Select title={'Sales Unit Type'} />
                                    <Input title={'Pack Size'} />
                                </div>

                                <div className='grid grid-cols-2 gap-x-4'>
                                    <Input title={'Pack MRP'} />
                                    <Input title={'Unit MRP'} />
                                </div>

                                <DoubleInput title={'Sales VAT'} />
                                <DoubleInput title={'Sales Discount'} />

                                <CancelButton extraClass='mt-4' />
                            </div>
                        </div>
                    </form>
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
                        customersReturns.map((product, index) =>
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
                                            <EditButton />
                                            <DeleteButton
                                                deleteApiLink='http://localhost:5000/api/returns/customers/'
                                                itemId={product._id}
                                                name={product.tradeName} />
                                        </span>
                                    ]
                                } />)
                    }
                </tbody>
            </table>
        </section >
    );
};

export default CustomersReturns;