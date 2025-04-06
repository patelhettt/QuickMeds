import React from 'react';
import EmployeeForm from './EmployeeForm';

const AddEmployeeModal = ({ onSubmit, onCancel, userRole, userCity, userStore }) => {
    return (
        <div className="modal-box w-11/12 max-w-5xl mx-auto">
            <div className='flex mb-3'>
                <h3 className="font-bold text-lg">Add New Employee</h3>
            </div>
            <EmployeeForm 
                onSubmit={onSubmit} 
                onCancel={onCancel} 
                isEditing={false}
                userRole={userRole}
                userCity={userCity}
                userStore={userStore}
            />
        </div>
    );
};

export default AddEmployeeModal; 