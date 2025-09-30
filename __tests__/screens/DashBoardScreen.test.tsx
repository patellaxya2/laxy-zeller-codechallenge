// __tests__/screens/DashBoardScreen.test.tsx
import React from "react";
import { render, fireEvent, within } from "@testing-library/react-native";
import DashBoardScreen from "../../src/screens/DashBoardScreen";
import { roles } from "../../src/utils/constants";
import { NativeStackNavigationProp, NativeStackScreenProps } from "@react-navigation/native-stack";
import { IZellerCustomer, StackParamList } from "../../src/types";
import { EROLES } from "../../src/utils/enum";
import { Text } from "react-native";


// Mock navigation
const mockNavigate = jest.fn();
const mockNavigation: Partial<NativeStackNavigationProp<StackParamList, 'Dashboard'>> = {
  navigate: mockNavigate,
};

// Mock route
const mockRoute: NativeStackScreenProps<StackParamList, 'Dashboard'>['route'] = {
  key: 'DashboardKey',
  name: 'Dashboard',
  params: undefined,
};

// Mock Realm hooks
jest.mock('../../src/realm/setup', () => ({
  RealmProvider: ({ children }: any) => children,
  useQuery: jest.fn(() => {
    const data = [
      { id: '1', name: 'Alice', role: 'ADMIN', email: 'alice@test.com' },
      { id: '2', name: 'Bob', role: 'MANAGER', email: 'bob@test.com' },
      { id: '3', name: 'Charlie', role: 'ADMIN', email: 'charlie@test.com' },
    ];
    return {
      filtered: (query: string, ...args: any[]) => {
        console.log('query: args  ', query, args);

        // const roleName = role.replace(/"/g, '').split('=')[1]?.trim() || role;

        // return role === 'ALL' ? true : item.role == roleName
        let result = data;
        if (query.includes(`role == $0`)) {
          result = result.filter((item) => item.role === args[0])
        }
        else if (query.includes('name CONTAINS[c] $0')) {
          const search = args[0].toLowerCase();
          result = result.filter(item => item.name.toLowerCase().includes(search));
        }
        else if (query.includes('role == $0 AND name CONTAINS[c] $1')) {
          const roleArg = args[0];
          const search = args[0].toLowerCase();
          result = result.filter(item => item.role === roleArg && item.name.toLowerCase().includes(search));
        }
        return result;
      }
      ,
      [Symbol.iterator]: function* () {
        for (const item of data) yield item;
      },
    }
  }),
  useRealm: jest.fn(),
  useObject: jest.fn(),
  useProgress: jest.fn(),
}))

// Mock useTabAnimation hook
const mockStartAnimation = jest.fn();
jest.mock('../../src/hooks/useTabAnimation', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    translateX: 3,
    startAnimation: mockStartAnimation,
    tabWidth: 90,
  })),
}));

// Mock UserItem component
jest.doMock('../../src/components/UserItem', () => ({
  __esModule: true,
  default: ({ item }: { item: IZellerCustomer }) => <Text>{item.name}</Text>,
}));

// ------------------ TESTS ------------------ //

describe("DashBoardScreen Integration Tests", () => {
  let getByText: any;
  let queryByText: any;
  let getByTestId: any;

  beforeEach(() => {
    const rendered = render(<DashBoardScreen navigation={mockNavigation as any} route={mockRoute} />);
    getByText = rendered.getByText;
    queryByText = rendered.queryByText;
    getByTestId = rendered.getByTestId;
    jest.clearAllMocks();
  });

  it("renders all tabs", () => {
    roles.forEach((role) => {
      expect(getByTestId(`tab-${role}`)).toBeTruthy();
    });

    // Default ALL customers visible
    expect(getByText("Alice")).toBeTruthy();
    expect(getByText("Bob")).toBeTruthy();
    expect(getByText("Charlie")).toBeTruthy();
  });

  it("handles tab press animation", () => {
    const allTab = getByTestId('tab-Admin');
    fireEvent.press(allTab);

    expect(mockStartAnimation).toHaveBeenCalledWith(1, 300);
  });

  it("renders only ADMIN customers when filtered", () => {


    // Simulate tab press for ADMIN
    const adminTab = getByTestId('tab-Admin');
    fireEvent.press(adminTab);
    //    console.log('adminTab : ', adminTab);

    expect(getByText("Alice")).toBeTruthy();
    expect(getByText("Charlie")).toBeTruthy();;
    expect(queryByText("Bob")).toBeNull();;
  });



  it("navigates to AddNewUser when FAB is pressed", () => {
    const fab = getByText("+");
    fireEvent.press(fab);

    expect(mockNavigate).toHaveBeenCalledWith("AddNewUser");
  });
});

describe("handlePageSelected for pagerview", () => {


  it("should update selected role and call animateToTab when page is selected", () => {
    const { getByText, getByTestId } = render(<DashBoardScreen navigation={mockNavigate as any} route={mockRoute} />);

    // PagerView is rendered with a testID (add testID="pager-view" in your component if missing)
    const pager = getByTestId("pager-view");

    // Fire event to simulate selecting second page (index 1 → roles[1])
    fireEvent(pager, "onPageSelected", {
      nativeEvent: { position: 1 },
    });

    const tab = getByTestId("tab-Admin");

    // Find the nested <Text> inside this TouchableOpacity
    const text = within(tab).getByText("Admin");
    // Expect role is updated in UI
    expect(text).toHaveStyle({
      color: "#007aff",
      fontWeight: "600",
    });

  });
});

describe('search functionality', () => {
  beforeEach(() => {

    jest.clearAllMocks();
  });
  it('filters customer list based on search input', () => {
    const { getByPlaceholderText, queryByText, getByText } = render(
      <DashBoardScreen navigation={mockNavigation as any} route={mockRoute} />
    );

    const searchInput = getByPlaceholderText('Search by name...');

    // Initially all users visible
    expect(getByText('Alice')).toBeTruthy();
    expect(getByText('Bob')).toBeTruthy();
    expect(getByText('Charlie')).toBeTruthy();

    // Type "Alice" in search
    fireEvent.changeText(searchInput, 'Alice');

    // Only Alice should be visible
    expect(getByText('Alice')).toBeTruthy();
    expect(queryByText('Bob')).toBeNull();
    expect(queryByText('Charlie')).toBeNull();

    // Type a non-existing name
    fireEvent.changeText(searchInput, 'NonExisting');

    // No results should be displayed
    expect(queryByText('Alice')).toBeNull();
    expect(queryByText('Bob')).toBeNull();
    expect(queryByText('Charlie')).toBeNull();
    expect(getByText('Data Not Found!')).toBeTruthy();
  });

  it('works correctly with filtered tabs', () => {
    const { getByPlaceholderText, getByTestId, queryByText } = render(
      <DashBoardScreen navigation={mockNavigation as any} route={mockRoute} />
    );

    const searchInput = getByPlaceholderText('Search by name...');
    const adminTab = getByTestId('tab-Admin');

    // Switch to Admin tab
    fireEvent.press(adminTab);

    // Type "Alice" in search
    fireEvent.changeText(searchInput, 'Alice');

    // Alice is visible, Charlie also Admin, Bob not visible
    expect(queryByText('Alice')).toBeTruthy();
    expect(queryByText('Charlie')).toBeTruthy();
    expect(queryByText('Bob')).toBeNull();
  });
});
