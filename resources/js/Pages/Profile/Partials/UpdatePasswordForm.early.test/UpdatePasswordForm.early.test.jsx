
// Unit tests for: UpdatePasswordForm


import { useForm } from '@inertiajs/react';
import UpdatePasswordForm from '../UpdatePasswordForm';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import "@testing-library/jest-dom";

// Mocking the components
jest.mock("@/Components/InputError", () => ({ message, className }) => (
  <div className={className}>{message}</div>
));
jest.mock("@/Components/InputLabel", () => ({ htmlFor, value }) => (
  <label htmlFor={htmlFor}>{value}</label>
));
jest.mock("@/Components/PrimaryButton", () => ({ children, disabled }) => (
  <button disabled={disabled}>{children}</button>
));
jest.mock("@/Components/TextInput", () => React.forwardRef(({ id, value, onChange, type, className, autoComplete }, ref) => (
  <input id={id} value={value} onChange={onChange} type={type} className={className} autoComplete={autoComplete} ref={ref} />
)));

// Mocking useForm hook
jest.mock("@inertiajs/react", () => ({
  useForm: jest.fn(),
}));

describe('UpdatePasswordForm() UpdatePasswordForm method', () => {
  let mockPut, mockReset, mockSetData;

  beforeEach(() => {
    mockPut = jest.fn();
    mockReset = jest.fn();
    mockSetData = jest.fn();

    useForm.mockReturnValue({
      data: {
        current_password: '',
        password: '',
        password_confirmation: '',
      },
      setData: mockSetData,
      errors: {},
      put: mockPut,
      reset: mockReset,
      processing: false,
      recentlySuccessful: false,
    });
  });

  describe('Happy Paths', () => {
    test('renders the form with all input fields and labels', () => {
      render(<UpdatePasswordForm />);

      expect(screen.getByLabelText('Current Password')).toBeInTheDocument();
      expect(screen.getByLabelText('New Password')).toBeInTheDocument();
      expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
    });

    test('submits the form successfully', () => {
      render(<UpdatePasswordForm />);

      fireEvent.change(screen.getByLabelText('Current Password'), { target: { value: 'oldpassword' } });
      fireEvent.change(screen.getByLabelText('New Password'), { target: { value: 'newpassword' } });
      fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: 'newpassword' } });

      fireEvent.click(screen.getByRole('button', { name: /save/i }));

      expect(mockPut).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({
        preserveScroll: true,
        onSuccess: expect.any(Function),
        onError: expect.any(Function),
      }));
    });
  });

  describe('Edge Cases', () => {
    test('handles password error by focusing on the password input', () => {
      useForm.mockReturnValueOnce({
        ...useForm(),
        errors: { password: 'Password error' },
      });

      render(<UpdatePasswordForm />);

      fireEvent.click(screen.getByRole('button', { name: /save/i }));

      expect(mockReset).toHaveBeenCalledWith('password', 'password_confirmation');
      expect(screen.getByLabelText('New Password')).toHaveFocus();
    });

    test('handles current password error by focusing on the current password input', () => {
      useForm.mockReturnValueOnce({
        ...useForm(),
        errors: { current_password: 'Current password error' },
      });

      render(<UpdatePasswordForm />);

      fireEvent.click(screen.getByRole('button', { name: /save/i }));

      expect(mockReset).toHaveBeenCalledWith('current_password');
      expect(screen.getByLabelText('Current Password')).toHaveFocus();
    });
  });
});

// End of unit tests for: UpdatePasswordForm
