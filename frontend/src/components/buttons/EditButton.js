import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { BiEdit } from 'react-icons/bi';
import DoubleInput from '../form/DoubleInput';
import Input from '../form/Input';
import Select from '../form/Select';
import ModalHeading from '../headings/ModalHeading';
import CancelButton from './CancelButton';
import ModalCloseButton from './ModalCloseButton';
import SaveButton from './SaveButton';
import { toast } from 'react-toastify';

const EditButton = ({ id, onClick, apiEndpoint }) => {
    const [pharmacyProduct, setPharmacyProduct] = useState({});
    const [categories, setCategories] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [unitTypes, setUnitTypes] = useState([]);
    const [modalId, setModalId] = useState(`update-pharmacy-product-${id}`);

    // Update modalId when id changes
    useEffect(() => {
        setModalId(`update-pharmacy-product-${id}`);
    }, [id]);
    useEffect(() => {
        if (!id || !apiEndpoint) {
            console.error("No product ID or API endpoint provided");
            return;
        }
    
        const apiBaseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
        const apiUrl = `${apiBaseUrl}/products/${apiEndpoint}/${id}`; // Use dynamic API endpoint
    
        fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(res => {
            if (!res.ok) {
                throw new Error(`HTTP error! Status: ${res.status}`);
            }
            return res.json();
        })
        .then(data => {
            setPharmacyProduct(data);
        })
        .catch(error => {
            console.error("Error fetching product:", error);
            toast.error("Failed to load product data");
        });
    }, [id, apiEndpoint]);
    

    useEffect(() => {
        // Use the same API base URL for consistency
        const apiBaseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
        
        fetch(`${apiBaseUrl}/setup/categories`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(res => {
            if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
            return res.json();
        })
        .then(data => {
            setCategories(data);
        })
        .catch(error => {
            console.error("Error fetching categories:", error);
            toast.error("Failed to load categories");
        });
    }, []);

    useEffect(() => {
        const apiBaseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
        
        fetch(`${apiBaseUrl}/setup/companies`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(res => {
            if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
            return res.json();
        })
        .then(data => {
            setCompanies(data);
        })
        .catch(error => {
            console.error("Error fetching companies:", error);
            toast.error("Failed to load companies");
        });
    }, []);

    useEffect(() => {
        const apiBaseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
        
        fetch(`${apiBaseUrl}/setup/unitTypes`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(res => {
            if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
            return res.json();
        })
        .then(data => {
            setUnitTypes(data);
        })
        .catch(error => {
            console.error("Error fetching unit types:", error);
            toast.error("Failed to load unit types");
        });
    }, []);

    const updatePharmacyProduct = event => {
        event.preventDefault();

        const tradeName = event?.target?.tradeName?.value;
        const genericName = event?.target?.genericName?.value;
        const strength = event?.target?.strength?.value;
        const category = event?.target?.category?.value;
        const company = event?.target?.company?.value;
        const stock = event?.target?.stock?.value;
        const packType = event?.target?.packType?.value;

        const productDetails = { 
            tradeName, 
            genericName, 
            strength, 
            category, 
            company, 
            stock, 
            packType 
        };

        // send data to server
        const apiBaseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
        
        fetch(`${apiBaseUrl}/products/${apiEndpoint}/${id}`, {  // Use dynamic API endpoint
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(productDetails)
        })        
        .then(res => {
            if (!res.ok) {
                throw new Error(`HTTP error! Status: ${res.status}`);
            }
            return res.json();
        })
        .then(data => {
            toast.success(`${tradeName} updated successfully.`);
            // Close the modal
            document.getElementById(modalId).checked = false;
        })
        .catch(error => {
            console.error("Error updating product:", error);
            toast.error("Failed to update product");
        });
    };

    // If onClick is provided, use it directly
    // If apiEndpoint is provided, use the default behavior
    const handleClick = onClick ? () => onClick(id) : null;

    return (
        <div>
            {/* update a pharmacy product */}
            <input type="checkbox" id={modalId} className="modal-toggle" />
            <label htmlFor={modalId} className="modal cursor-pointer">
                <label className="modal-box lg:w-7/12 md:w-10/12 w-11/12 max-w-4xl relative" htmlFor="">
                    <ModalCloseButton modalId={modalId} />

                    <ModalHeading modalHeading={'Update ' + (pharmacyProduct?.tradeName || 'Product')} />

                    <form onSubmit={updatePharmacyProduct}>
                        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-1 mb-2'>
                            <Input title={'Trade Name'} type='text' value={pharmacyProduct.tradeName} name='tradeName' isRequired='required' />
                            <Input title={'Generic Name'} type='text' value={pharmacyProduct.genericName} placeholder='Generic name' name='genericName' isRequired='required' />
                            <Input title={'Strength'} type='number' value={pharmacyProduct.strength} placeholder='Strength' name='strength' isRequired='required' />

                            <Select title={'Category'} name='category' isRequired='required' options={categories.map(c => c.Name)} />
                            <Select title={'Company'} name='company' isRequired='required' options={companies.map(c => c.Name)} />
                            <Input title={'Stock'} type='number' value={pharmacyProduct.stock} placeholder='Stock' name='stock' isRequired='required' />
                            <Select title={'Pack Type'} name='packType' isRequired='required' options={unitTypes.map(u => u.Name)} />
                        </div>
                        <div className="flex justify-end mt-4">
                            <SaveButton type="submit" />
                            <CancelButton 
                                type="button" 
                                onClick={() => document.getElementById(modalId).checked = false} 
                                extraClass="ml-2" 
                            />
                        </div>
                    </form>
                </label>
            </label>


            <label htmlFor={modalId} className={`gap-x-2 modal-button z-10 block p-1 text-blue-700 transition-all bg-blue-100 border-2 border-white rounded-full active:bg-blue-50 hover:scale-110 focus:outline-none focus:ring`}>
                <BiEdit />
            </label>
        </div>
    );
};

export default EditButton;