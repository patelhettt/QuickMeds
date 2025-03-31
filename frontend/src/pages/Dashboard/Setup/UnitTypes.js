import React, { useEffect, useState } from 'react';
import PrintButton from '../../../components/buttons/PrintButton';
import Input from '../../../components/form/Input';
import TableRow from '../../../components/TableRow';
import SaveButton from '../../../components/buttons/SaveButton';
import EditButton from '../../../components/buttons/EditButton';
import DeleteButton from '../../../components/buttons/DeleteButton';
import RefreshButton from '../../../components/buttons/RefreshButton';
import DashboardPageHeading from '../../../components/headings/DashboardPageHeading';
import CancelButton from '../../../components/buttons/CancelButton';
import ModalCloseButton from '../../../components/buttons/ModalCloseButton';
import ModalHeading from '../../../components/headings/ModalHeading';
import NewButton from '../../../components/buttons/NewButton';
import AddModal from '../../../components/modals/AddModal';


const API_BASE_URL = 'http://localhost:5000/api/setup/unitTypes'; 


const UnitTypes = () => {
    const tableHeadItems = ['SN', 'Name', 'Description', 'Creator', 'Created At', 'Updated By', 'Updated At', 'Actions'];

    const tableHead = <tr>
        {
            tableHeadItems?.map(tableHeadItem => <th className='text-xs' >{tableHeadItem}</th>)
        }
    </tr>;

    const addUnitType = event => {
        event.preventDefault();

        const Name = event?.target?.unitName?.value;
        const Description = event?.target?.unitDescription?.value;
        const Creator = 'Admin';
        const CreatedAt = new Date();
        const UpdatedBy = 'Admin';
        const UpdatedAt = new Date();

        const unitTypeDetails = { Name, Description, Creator, CreatedAt, UpdatedBy, UpdatedAt };

        // send data to server
        fetch(API_BASE_URL, {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(unitTypeDetails)
        })
            .then(res => res.json())
            .then(data => {
                // Refresh the unit types list after adding a new one
                fetch(API_BASE_URL)
                    .then(res => res.json())
                    .then(unitType => setUnitTypes(unitType));
                
                // Close the modal
                document.getElementById('create-new-product').checked = false;
            });

        event.target.reset();
    };

    const [unitTypes, setUnitTypes] = useState([]);

    useEffect(() => {
        fetch(API_BASE_URL)
            .then(res => res.json())
            .then(unitType => setUnitTypes(unitType));
    }, []);

    return (
        <section className='p-4 mt-16'>
            <div>
                <DashboardPageHeading
                    name='Unit Types'
                    value={unitTypes.length}
                    buttons={[
                        <NewButton modalId='create-new-product' />,
                        <RefreshButton />,
                        <PrintButton />
                    ]}
                />

                <input type="checkbox" id="create-new-product" className="modal-toggle" />
                <label htmlFor="create-new-product" className="modal cursor-pointer">
                    <label className="modal-box lg:w-7/12 md:w-10/12 w-11/12 max-w-4xl relative" htmlFor="">
                        <ModalCloseButton modalId={'create-new-product'} />

                        <ModalHeading modalHeading={'Create a Unit Type'} />

                        <form onSubmit={addUnitType} className='mx-auto'>
                            <div className='grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-2 mb-2'>
                                <Input title={'Unit Name'} name='unitName' isRequired='required' />
                                <Input title={'Description'} name='unitDescription' isRequired='required' />
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
                        unitTypes.map((category, index) =>
                            <TableRow
                                key={category._id}
                                tableRowsData={
                                    [
                                        index + 1,
                                        category.Name,
                                        category.Description,
                                        category.Creator,
                                        category?.CreatedAt?.slice(0, 10),
                                        category.UpdatedBy,
                                        category?.UpdatedAt?.slice(0, 10),
                                        <span className='flex items-center gap-x-1'>
                                            <EditButton />
                                            <DeleteButton
                                            deleteApiLink={`${API_BASE_URL}/${category._id}`}
                                            itemId={category._id}
                                            name={category.Name}
                                            onDelete={() => {
                                                // Refresh the unit types list after deletion
                                                fetch(API_BASE_URL)
                                                    .then(res => res.json())
                                                    .then(unitTypes => setUnitTypes(unitTypes))
                                                    .catch(err => console.error("Error refreshing unit types:", err));
                                            }}
                                        />
                                        </span>
                                    ]
                                } />)
                    }
                </tbody>
            </table>
        </section>
    );
};

export default UnitTypes;