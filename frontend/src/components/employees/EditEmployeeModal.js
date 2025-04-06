import React from 'react';
import ModalCloseButton from '../../components/buttons/ModalCloseButton';
import ModalHeading from '../../components/headings/ModalHeading';
import EmployeeForm from './EmployeeForm';

const EditEmployeeModal = ({ employee, onSubmit, onCancel, userRole, userCity, userStore }) => {
    return (
        <>
            <input type="checkbox" id="edit-employee" className="modal-toggle" />
            <label htmlFor="edit-employee" className="modal cursor-pointer">
                <label className="modal-box lg:w-7/12 md:w-10/12 w-11/12 max-w-4xl relative">
                    <ModalCloseButton modalId={'edit-employee'} />
                    <ModalHeading modalHeading={'Edit Employee'} />
                    {employee && (
                        <EmployeeForm 
                            employee={employee} 
                            onSubmit={onSubmit} 
                            onCancel={onCancel} 
                            isEditing={true}
                            userRole={userRole}
                            userCity={userCity}
                            userStore={userStore}
                        />
                    )}
                </label>
            </label>
        </>
    );
};

export default EditEmployeeModal; 