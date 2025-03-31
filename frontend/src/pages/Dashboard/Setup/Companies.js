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
import ModalHeading from '../../../components/headings/ModalHeading';
import ModalCloseButton from '../../../components/buttons/ModalCloseButton';
import NewButton from '../../../components/buttons/NewButton';
import AddModal from '../../../components/modals/AddModal';

const Companies = () => {
    const [showModal, setShowModal] = useState(false);
    const [newCompany, setNewCompany] = useState(null);
    const [companies, setCompanies] = useState([]);
    const [message, setMessage] = useState(null); // ✅ Added state for message

    const refreshCompanies = () => {
        fetch('http://localhost:5000/api/setup/companies')
            .then(res => res.json())
            .then(data => setCompanies(data))
            .catch(err => console.error("Error refreshing companies:", err));
    };    

    useEffect(() => {
        refreshCompanies(); // ✅ Only calling refresh function instead of duplicating fetch logic
    }, []);

    const tableHeadItems = ['SN', 'Name', 'Phone', 'Website', 'Email', 'Address', 'Creator', 'Created At', 'Updated By', 'Updated At', 'Actions'];

    const tableHead = (
        <tr>
            {tableHeadItems.map((item, index) => (
                <th key={index} className='text-xs'>{item}</th>
            ))}
        </tr>
    );

    const addCompany = async (event) => {
        event.preventDefault();

        // Get values from form
        const Name = event.target.companyName.value;
        const Phone = event.target.companyPhone.value;
        const Website = event.target.companyWebsite.value;
        const Email = event.target.companyEmail.value;
        const Address = event.target.companyAddress.value;
        const Creator = 'Admin';
        const UpdatedBy = 'Admin';

        // Create company details object with all required fields
        const companyDetails = { 
            Name, 
            Phone, 
            Website, 
            Email, 
            Address, 
            Creator, 
            UpdatedBy
        };

        console.log("🚀 Sending Data:", companyDetails);

        try {
            const res = await fetch("http://localhost:5000/api/setup/companies", { 
                method: "POST", 
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(companyDetails)
            })

            const data = await res.json();
            console.log("✅ Server Response:", data);

            if (!res.ok) throw new Error(`Error: ${res.status} ${data.message}`);

            // Refresh the companies list after adding
            setCompanies((prevCompanies) => [...prevCompanies, data]);

            setMessage({ type: "success", text: "✅ Company added successfully!" });  // ✅ Success message
            // Close the modal
            document.getElementById('create-new-company').checked = false;
            
            // Reset the form
            event.target.reset();
            setTimeout(() => setMessage(null), 3000);
        } catch (error) {
            console.error("❌ Error adding company:", error);
            setMessage({ type: "error", text: "❌ Error adding company: " + error.message }); // ✅ Error message
        }
    };

    return (
        <section className='p-4 mt-16'>
            <DashboardPageHeading
                name='Companies'
                value={companies.length}
                buttons={[
                    <NewButton modalId='create-new-company' />,
                    <RefreshButton onClick={refreshCompanies} />,
                    <PrintButton />
                ]}
            />
            
            {/* Add Company Modal */}
            <input type="checkbox" id="create-new-company" className="modal-toggle" />
            <label htmlFor="create-new-company" className="modal cursor-pointer">
                <label className="modal-box lg:w-7/12 md:w-10/12 w-11/12 max-w-4xl relative">
                    <ModalCloseButton modalId={'create-new-company'} />
                    <ModalHeading modalHeading={'Add a New Company'} />
                    <form onSubmit={addCompany} className='mx-auto'>
                        <div className='grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-2 mb-2'>
                            <Input title={'Company Name'} name='companyName' isRequired type='text' />
                            <Input title={'Company Phone'} name='companyPhone' isRequired type='text' />
                            <Input title={'Company Website'} name='companyWebsite' isRequired type='text' />
                            <Input title={'Company Email'} name='companyEmail' isRequired type='email' />
                            <Input title={'Company Address'} name='companyAddress' isRequired type='text' />
                        </div>
                        <div className="flex flex-col w-full lg:flex-row mt-4 place-content-center">
                            <div className="grid">
                                <SaveButton extraClass='mt-4' onClick/>
                            </div>
                            <div className="divider lg:divider-horizontal hidden md:block lg:block"></div>
                            <div className="grid">
                                <CancelButton extraClass='lg:mt-4 md:mt-3 mt-2' />
                            </div>
                        </div>
                    </form>
                </label>
            </label>

            {/* Companies Table */}
            <table className="table table-zebra table-compact w-full">
                <thead>{tableHead}</thead>
                <tbody>
                    {companies.map((company) => (
                        <TableRow
                            key={company._id}
                            tableRowsData={[
                                company.SN,
                                company.Name,
                                company.Phone,
                                company.Website,
                                company.Email,
                                company.Address,
                                company.Creator,
                                company.CreatedAt?.slice(0, 10),
                                company.UpdatedBy,
                                company.UpdatedAt?.slice(0, 10),
                                <span className='flex items-center gap-x-1'>
                                    <EditButton />
                                    <DeleteButton
                                        deleteApiLink={`http://localhost:5000/api/setup/companies/${company._id}`}
                                        itemId={company._id}
                                        name={company.Name}
                                        onDelete={refreshCompanies} 
                                    />
                                </span>
                            ]}
                        />
                    ))}
                </tbody>
            </table>

            {/* Success Modal */}
            {showModal && <AddModal name={newCompany} onClose={() => setShowModal(false)} />}
        </section>
    );
};

export default Companies;
