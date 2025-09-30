
import { render, fireEvent, screen } from '@testing-library/react-native';
import UserItem from '../../src/components/UserItem';
import { IZellerCustomer } from '../../src/types';
import { EROLES } from '../../src/utils/enum';


describe('UserItem', () => {
    it('renders user name and avatar correctly', () => {
        const item: IZellerCustomer = { email: "test@gmail.com", id: "123", name: "Laxy Patel", role: EROLES.MANAGER }

        const { getByText } = render(<UserItem item={item} />);

        // Avatar text should be first letter
        expect(getByText(item.name[0])).toBeTruthy();
        // Full name should be rendered
        expect(getByText(item.name)).toBeTruthy();
        // Role should not be rendered for non-admin
        expect(() => getByText('Admin')).toThrow()
    });

    it('renders Admin role when role is ADMIN', () => {
        const item: IZellerCustomer = { email: "test@gmail.com", id: "123", name: "Laxy Patel", role: EROLES.ADMIN }

        const { getByText } = render(<UserItem item={item} />);

        // Admin label should be visible
        expect(getByText('Admin')).toBeTruthy();
    });
});