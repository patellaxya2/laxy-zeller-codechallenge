import { render, fireEvent } from '@testing-library/react-native';
import React from 'react';
import { Animated } from 'react-native';
import AnimatedTabView from '../../src/components/AnimatedTabView';

test('renders tabs and triggers handleTabPress', () => {
    const handleTabPress = jest.fn();
    const items = ['Admin', 'Manager'];
    const translateX = new Animated.Value(0);

    const { getByText } = render(
        <AnimatedTabView
            items={items}
            handleTabPress={handleTabPress}
            selected="Admin"
            translateX={translateX}
            tabWidth={100}
        />
    );

    // Check that tabs render
    expect(getByText('Admin')).toBeTruthy();
    expect(getByText('Manager')).toBeTruthy();

    // Fire press event
    fireEvent.press(getByText('Manager'));
    expect(handleTabPress).toHaveBeenCalledWith('Manager', 1);
});
