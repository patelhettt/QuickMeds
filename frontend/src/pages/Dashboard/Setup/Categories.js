import React, { useEffect, useState } from 'react';
import PrintButton from '../../../components/buttons/PrintButton';
import Input from '../../../components/form/Input';
import TableRow from '../../../components/TableRow';
import SaveButton from '../../../components/buttons/SaveButton';
import EditButton from '../../../components/buttons/EditButton';
import DeleteButton from '../../../components/buttons/DeleteButton';
import RefreshButton from '../../../components/buttons/RefreshButton';
import DashboardPageHeading from '../../../components/headings/DashboardPageHeading';
import ModalCloseButton from '../../../components/buttons/ModalCloseButton';
import ModalHeading from '../../../components/headings/ModalHeading';
import NewButton from '../../../components/buttons/NewButton';
import CancelButton from '../../../components/buttons/CancelButton';

const API_BASE_URL = 'http://localhost:5000/api/setup/categories';

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    const [isEditing, setIsEditing] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);

    // Add these functions before the return statement
    const handleEdit = (category) => {
        setEditingCategory(category);
        setIsEditing(true);
        document.getElementById('edit-category').checked = true;
    };

    const handleUpdate = async (event) => {
        event.preventDefault();
        try {
            const formData = new FormData(event.target);
            const updatedData = {
                Name: formData.get('categoryName')?.trim(),
                Description: formData.get('categoryDescription')?.trim(),
                UpdatedBy: 'Admin',
                UpdatedAt: new Date().toISOString()
            };

            if (!updatedData.Name || !updatedData.Description) {
                alert("All fields are required");
                return;
            }

            const response = await fetch(`${API_BASE_URL}/${editingCategory._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedData)
            });

            if (response.ok) {
                fetchCategories();
                document.getElementById('edit-category').checked = false;
                setEditingCategory(null);
                setIsEditing(false);
            } else {
                throw new Error('Update failed');
            }
        } catch (error) {
            console.error("Update error:", error);
            alert("Failed to update category");
        }
    };

    const fetchCategories = () => {
        setLoading(true);
        fetch(API_BASE_URL)
            .then(res => res.json())
            .then(data => setCategories(data))
            .catch(error => console.error("Error fetching categories:", error))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const addCategory = (event) => {
        event.preventDefault();
        const Name = event.target.categoryName.value;
        const Description = event.target.categoryDescription.value;
        const Creator = 'Admin';

        const categoryDetails = { Name, Description, Creator };

        fetch(API_BASE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(categoryDetails)
        })
            .then(res => res.json())
            .then(() => {
                fetchCategories(); // Refetch categories
                document.getElementById('create-new-product').checked = false; // Close modal
            })
            .catch(error => console.error("Error adding category:", error));

        event.target.reset();
    };

    const deleteCategory = (id) => {
        fetch(`${API_BASE_URL}/${id}`, { method: 'DELETE' })
            .then(res => res.json())
            .then(() => {
                setCategories(categories.filter(category => category._id !== id)); // Remove from state
            })
            .catch(error => console.error("Error deleting category:", error));
    };

    return (
        <section className='p-4 mt-16'>
            <DashboardPageHeading
                name='Categories'
                value={categories.length}
                buttons={[
                    <NewButton key="new" modalId='create-new-product' />,
                    <RefreshButton key="refresh" onClick={fetchCategories} />,
                    <PrintButton key="print" />
                ]}
            />

            <input type="checkbox" id="create-new-product" className="modal-toggle" />
            <label htmlFor="create-new-product" className="modal cursor-pointer">
                <label className="modal-box lg:w-7/12 md:w-10/12 w-11/12 max-w-4xl relative">
                    <ModalCloseButton modalId='create-new-product' />
                    <ModalHeading modalHeading='Create a New Category' />
                    <form onSubmit={addCategory} className='mx-auto'>
                        <div className='grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-2 mb-2'>
                            <Input title='Category Name' name='categoryName' isRequired={true} />
                            <Input title='Description' name='categoryDescription' isRequired={true} />
                        </div>
                        <div className="flex flex-col w-full lg:flex-row mt-4 place-content-center">
                            <SaveButton extraClass='mt-4' />
                            <div className="divider lg:divider-horizontal hidden md:block lg:block"></div>
                            <CancelButton extraClass='lg:mt-4 md:mt-3 mt-2' />
                        </div>
                    </form>
                </label>
            </label>

            {loading ? (
                <p className="text-center mt-4">Loading categories...</p>
            ) : (
                <table className="table table-zebra table-compact w-full">
                    <thead>
                        <tr>
                            {['SN', 'Name', 'Description', 'Creator', 'Created At', 'Updated By', 'Updated At', 'Actions'].map((head, index) => (
                                <th key={index} className='text-xs'>{head}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {categories.length === 0 ? (
                            <tr><td colSpan="8" className="text-center">No categories found</td></tr>
                        ) : (
                            categories.map((category, index) => (
                                <TableRow
                                    key={category._id}
                                    tableRowsData={[
                                        index + 1,
                                        category.Name,
                                        category.Description,
                                        category.Creator,
                                        category?.CreatedAt?.slice(0, 10),
                                        category.UpdatedBy,
                                        category?.UpdatedAt?.slice(0, 10),


                                        // Update the EditButton in the TableRow component
                                        <span className='flex items-center gap-x-1' key={category._id}>
                                            <EditButton onClick={() => handleEdit(category)} />
                                            <DeleteButton
                                                deleteApiLink={`${API_BASE_URL}/${category._id}`}
                                                itemId={category._id}
                                                name={category.Name}
                                                onDelete={() => deleteCategory(category._id)}
                                            />
                                        </span>

                                       

                                    ]}
                                />
                            ))
                        )}
                    </tbody>
                </table>
            )}
            <input type="checkbox" id="edit-category" className="modal-toggle" />
            <label htmlFor="edit-category" className="modal cursor-pointer">
                <label className="modal-box lg:w-7/12 md:w-10/12 w-11/12 max-w-4xl relative">
                    <ModalCloseButton modalId={'edit-category'} />
                    <ModalHeading modalHeading={'Update Category'} />
                    {editingCategory && (
                        <form onSubmit={handleUpdate} className='mx-auto'>
                            <div className='grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-2 mb-2'>
                                <Input
                                    title='Category Name'
                                    name='categoryName'
                                    isRequired={true}
                                    defaultValue={editingCategory.Name}
                                />
                                <Input
                                    title='Description'
                                    name='categoryDescription'
                                    isRequired={true}
                                    defaultValue={editingCategory.Description}
                                />
                            </div>
                            <div className="flex flex-col w-full lg:flex-row mt-4 place-content-center">
                                <SaveButton extraClass='mt-4' />
                                <div className="divider lg:divider-horizontal hidden md:block lg:block"></div>
                                <CancelButton
                                    extraClass='lg:mt-4 md:mt-3 mt-2'
                                    onClick={() => {
                                        document.getElementById('edit-category').checked = false;
                                        setEditingCategory(null);
                                        setIsEditing(false);
                                    }}
                                />
                            </div>
                        </form>
                    )}
                </label>
            </label>
        </section>
    );
};

export default Categories;
