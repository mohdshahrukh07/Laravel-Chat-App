
// Unit tests for: DeleteUserForm

import React from 'react'
import { useForm } from '@inertiajs/react';
import DeleteUserForm from '../DeleteUserForm';
import { fireEvent, render, screen } from '@testing-library/react';
import "@testing-library/jest-dom";

// Mocking components
jest.mock("@/Components/DangerButton", () => (props) => <button {...props} />);
jest.mock("@/Components/InputError", () => (props) => <div {...props} />);
jest.mock("@/Components/InputLabel", () => (props) => <label {...props} />);
jest.mock("@/Components/Modal", () => (props) => <div {...props} />);
jest.mock("@/Components/SecondaryButton", () => (props) => <button {...props} />);
jest.mock("@/Components/TextInput", () => (props) => <input {...props} />);

// Mocking useForm hook
jest.mock("@inertiajs/react", () => ({
  useForm: jest.fn(),
}));

describe('DeleteUserForm() DeleteUserForm method', () => {
  let mockUseForm;

  beforeEach(() => {
    mockUseForm = {
      data: { password: '' },
      setData: jest.fn(),
      delete: jest.fn(),
      processing: false,
      reset: jest.fn(),
      errors: {},
      clearErrors: jest.fn(),
    };
    useForm.mockReturnValue(mockUseForm);
  });

  // Happy Path Tests
  describe('Happy Paths', () => {
    test('renders DeleteUserForm component correctly', () => {
      render(<DeleteUserForm />);
      expect(screen.getByText('Delete Account')).toBeInTheDocument();
    });

    test('opens modal on clicking Delete Account button', () => {
      render(<DeleteUserForm />);
      fireEvent.click(screen.getByText('Delete Account'));
      expect(screen.getByText('Are you sure you want to delete your account?')).toBeInTheDocument();
    });

    test('calls delete function on form submission', () => {
      render(<DeleteUserForm />);
      fireEvent.click(screen.getByText('Delete Account'));
      fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
      fireEvent.click(screen.getByText('Delete Account'));
      expect(mockUseForm.delete).toHaveBeenCalled();
    });
  });

  // Edge Case Tests
  describe('Edge Cases', () => {
    test('focuses password input on error', () => {
      mockUseForm.errors.password = 'Password is required';
      render(<DeleteUserForm />);
      fireEvent.click(screen.getByText('Delete Account'));
      fireEvent.click(screen.getByText('Delete Account'));
      expect(screen.getByPlaceholderText('Password')).toHaveFocus();
    });

    test('disables Delete Account button when processing', () => {
      mockUseForm.processing = true;
      render(<DeleteUserForm />);
      fireEvent.click(screen.getByText('Delete Account'));
      expect(screen.getByText('Delete Account')).toBeDisabled();
    });

    test('closes modal on clicking Cancel button', () => {
      render(<DeleteUserForm />);
      fireEvent.click(screen.getByText('Delete Account'));
      fireEvent.click(screen.getByText('Cancel'));
      expect(screen.queryByText('Are you sure you want to delete your account?')).not.toBeInTheDocument();
    });
  });
});

// End of unit tests for: DeleteUserForm
