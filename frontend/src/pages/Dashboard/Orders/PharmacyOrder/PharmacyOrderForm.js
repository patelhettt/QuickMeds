import React from 'react';
import Input from '../../../../components/form/Input';
import Select from '../../../../components/form/Select';
import SaveButton from '../../../../components/buttons/SaveButton';
import CancelButton from '../../../../components/buttons/CancelButton';
import TableRow from '../../../../components/TableRow';
import EditButton from '../../../../components/buttons/EditButton';
import DeleteButton from '../../../../components/buttons/DeleteButton';

const PharmacyOrderForm = ({ 
    addPharmacyOrder, 
    suppliers, 
    categories, 
    unitTypes, 
    pharmacyOrders,
    modalTableHead1,
    modalTableHead2
}) => {
    return (
        <form onSubmit={addPharmacyOrder}>
            <div className='grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-1 mb-2'>
                <Select title={'Supplier'} name='supplier' isRequired='required' options={suppliers.map(s => s.name)} />
                <Input title={'Trade Name'} type='text' placeholder='Trade name' name='tradeName' isRequired='required' />
                <Select title={'Category'} name='category' isRequired='required' options={categories.map(c => c.name)} />

                <Input title={'Strength'} type='text' placeholder='Strength' name='strength' isRequired='required' />

                <Select title={'Box Type'} name='boxType' isRequired='required' />
                <Select title={'Unit Type'} name='unitType' isRequired='required' options={unitTypes.map(u => u.name)} />
            </div>

            <div className="flex flex-col w-full lg:flex-row mt-4 place-content-center">
                <div className="grid">
                    <table className="table table-zebra table-compact">
                        <thead>
                            {modalTableHead1}
                        </thead>
                        <tbody>
                            {
                                pharmacyOrders.map((product, index) =>
                                    <TableRow
                                        key={product._id}
                                        tableRowsData={[
                                            index + 1,
                                            product.name,
                                            product.strength,
                                            product.company,
                                            product.category,
                                            product.packType,
                                            product.Tp,
                                        ]} 
                                    />
                                )
                            }
                        </tbody>
                    </table>

                    <SaveButton extraClass={'mt-4'} />
                </div>

                <div className="divider lg:divider-horizontal"></div>

                <div className="grid">
                    <table className="table table-zebra table-compact">
                        <thead>
                            {modalTableHead2}
                        </thead>
                        <tbody>
                            {
                                pharmacyOrders.map((product, index) =>
                                    <TableRow
                                        key={product._id}
                                        tableRowsData={[
                                            index + 1,
                                            product.name,
                                            product.strength,
                                            product.category,
                                            product.stock,
                                            product.quantity,
                                            product.totalTp,
                                            <span className='flex items-center gap-x-1'>
                                                <EditButton />
                                                <DeleteButton
                                                    deleteApiLink='http://localhost:5000/api/orders/pharmacy/'
                                                    itemId={'pharmacyOrder._id'} 
                                                />
                                            </span>
                                        ]}
                                    />
                                )
                            }
                        </tbody>
                    </table>

                    <CancelButton extraClass={'mt-4'} />
                </div>
            </div>
        </form>
    );
};

export default PharmacyOrderForm; 