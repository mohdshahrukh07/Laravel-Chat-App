
// Unit tests for: UpdateProfileInformation

import React from 'react'
import { useForm, usePage } from '@inertiajs/react';
import UpdateProfileInformation from '../UpdateProfileInformationForm';
import { fireEvent, render, screen } from '@testing-library/react';
import "@testing-library/jest-dom";

// Mocking components
jest.mock("@/Components/InputError", () => (props) => <div {...props} />);
jest.mock("@/Components/InputLabel", () => (props) => <label {...props} />);
jest.mock("@/Components/PrimaryButton", () => (props) => <button {...props} />);
jest.mock("@/Components/TextInput", () => (props) => <input {...props} />);

// Mocking hooks
jest.mock("@inertiajs/react", () => ({
  ...jest.requireActual("@inertiajs/react"),
  useForm: jest.fn(),
  usePage: jest.fn(),
}));

describe('UpdateProfileInformation() UpdateProfileInformation method', () => {
  let mockPatch;
  let mockSetData;

  beforeEach(() => {
    mockPatch = jest.fn();
    mockSetData = jest.fn();

    useForm.mockReturnValue({
      data: { name: 'John Doe', email: 'john@example.com' },
      setData: mockSetData,
      patch: mockPatch,
      errors: {},
      processing: false,
      recentlySuccessful: false,
    });

    usePage.mockReturnValue({
      props: {
        auth: {
          user: {
            name: 'John Doe',
            email: 'john@example.com',
            email_verified_at: null,
          },
        },
      },
    });
  });

  describe('Happy Paths', () => {
    test('renders the component with initial data', () => {
      render(<UpdateProfileInformation mustVerifyEmail={false} status="" />);

      expect(screen.getByLabelText('Name')).toHaveValue('John Doe');
      expect(screen.getByLabelText('Email')).toHaveValue('john@example.com');
    });

    test('submits the form with updated data', () => {
      render(<UpdateProfileInformation mustVerifyEmail={false} status="" />);

      fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Jane Doe' } });
      fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'jane@example.com' } });

      fireEvent.click(screen.getByRole('button', { name: /save/i }));

      expect(mockSetData).toHaveBeenCalledWith('name', 'Jane Doe');
      expect(mockSetData).toHaveBeenCalledWith('email', 'jane@example.com');
      expect(mockPatch).toHaveBeenCalledWith(expect.any(Function));
    });

    test('displays verification link message when email is unverified', () => {
      render(<UpdateProfileInformation mustVerifyEmail={true} status="" />);

      expect(screen.getByText(/your email address is unverified/i)).toBeInTheDocument();
    });

    test('displays success message when recently successful', () => {
      useForm.mockReturnValueOnce({
        data: { name: 'John Doe', email: 'john@example.com' },
        setData: mockSetData,
        patch: mockPatch,
        errors: {},
        processing: false,
        recentlySuccessful: true,
      });

      render(<UpdateProfileInformation mustVerifyEmail={false} status="" />);

      expect(screen.getByText('Saved.')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    test('handles form submission with empty name', () => {
      useForm.mockReturnValueOnce({
        data: { name: '', email: 'john@example.com' },
        setData: mockSetData,
        patch: mockPatch,
        errors: { name: 'Name is required' },
        processing: false,
        recentlySuccessful: false,
      });

      render(<UpdateProfileInformation mustVerifyEmail={false} status="" />);

      fireEvent.click(screen.getByRole('button', { name: /save/i }));

      expect(screen.getByText('Name is required')).toBeInTheDocument();
    });

    test('handles form submission with invalid email', () => {
      useForm.mockReturnValueOnce({
        data: { name: 'John Doe', email: 'invalid-email' },
        setData: mockSetData,
        patch: mockPatch,
        errors: { email: 'Email is invalid' },
        processing: false,
        recentlySuccessful: false,
      });

      render(<UpdateProfileInformation mustVerifyEmail={false} status="" />);

      fireEvent.click(screen.getByRole('button', { name: /save/i }));

      expect(screen.getByText('Email is invalid')).toBeInTheDocument();
    });

    test('disables save button when processing', () => {
      useForm.mockReturnValueOnce({
        data: { name: 'John Doe', email: 'john@example.com' },
        setData: mockSetData,
        patch: mockPatch,
        errors: {},
        processing: true,
        recentlySuccessful: false,
      });

      render(<UpdateProfileInformation mustVerifyEmail={false} status="" />);

      expect(screen.getByRole('button', { name: /save/i })).toBeDisabled();
    });
  });
});

// End of unit tests for: UpdateProfileInformation
