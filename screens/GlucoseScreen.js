import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import GlucoseScreen from '../screens/GlucoseScreen';

test('renders glucose reading and refreshes', () => {
    const { getByText, getByTestId } = render(<GlucoseScreen />);
    expect(getByText(/Glucose Reading/)).toBeTruthy();
    expect(getByText(/mg\/dL/)).toBeTruthy();
    const button = getByText('Refresh Glucose');
    fireEvent.press(button);
    expect(getByText(/mg\/dL/)).toBeTruthy();
});