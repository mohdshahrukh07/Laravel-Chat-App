
// Unit tests for: Edit

import React from 'react'
import Edit from '../Edit';
import { render, screen } from '@testing-library/react';
import "@testing-library/jest-dom";

// Mocking the components
jest.mock("@/Layouts/AuthenticatedLayout", () => {
    return ({ children, header }) => (
        <div>
            <div>{header}</div>
            <div>{children}</div>
        </div>
    );
});

jest.mock("../Partials/DeleteUserForm", () => {
    return () => <div>DeleteUserForm Component</div>;
});

jest.mock("../Partials/UpdatePasswordForm", () => {
    return () => <div>UpdatePasswordForm Component</div>;
});

jest.mock("../Partials/UpdateProfileInformationForm", () => {
    return () => <div>UpdateProfileInformationForm Component</div>;
});

describe('Edit() Edit method', () => {
    // Happy Path Tests
    describe('Happy Paths', () => {
        test('renders the Edit component with all subcomponents', () => {
            // Render the Edit component
            render(<Edit mustVerifyEmail={false} status="active" />);

            // Check if the header is rendered
            expect(screen.getByText('Profile')).toBeInTheDocument();

            // Check if the UpdateProfileInformationForm is rendered
            expect(screen.getByText('UpdateProfileInformationForm Component')).toBeInTheDocument();

            // Check if the UpdatePasswordForm is rendered
            expect(screen.getByText('UpdatePasswordForm Component')).toBeInTheDocument();

            // Check if the DeleteUserForm is rendered
            expect(screen.getByText('DeleteUserForm Component')).toBeInTheDocument();
        });

        test('renders the Edit component with mustVerifyEmail true', () => {
            // Render the Edit component with mustVerifyEmail set to true
            render(<Edit mustVerifyEmail={true} status="active" />);

            // Check if the UpdateProfileInformationForm is rendered
            expect(screen.getByText('UpdateProfileInformationForm Component')).toBeInTheDocument();
        });
    });

    // Edge Case Tests
    describe('Edge Cases', () => {
        test('renders the Edit component with an empty status', () => {
            // Render the Edit component with an empty status
            render(<Edit mustVerifyEmail={false} status="" />);

            // Check if the UpdateProfileInformationForm is rendered
            expect(screen.getByText('UpdateProfileInformationForm Component')).toBeInTheDocument();
        });

        test('renders the Edit component with mustVerifyEmail undefined', () => {
            // Render the Edit component with mustVerifyEmail undefined
            render(<Edit status="active" />);

            // Check if the UpdateProfileInformationForm is rendered
            expect(screen.getByText('UpdateProfileInformationForm Component')).toBeInTheDocument();
        });
    });
});

// End of unit tests for: Edit
