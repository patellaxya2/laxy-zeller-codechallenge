

import { fireEvent, render, waitFor } from "@testing-library/react-native";
import AddNewUserScreen from "../../src/screens/AddNewUserScreen";
import { Alert } from "react-native";
import { validateEmail, validateName } from "../../src/utils/functinos";
import { EROLES } from "../../src/utils/enum";
import { ZellerCustomer } from "../../src/realm/models/ZellerCustomer";
import { act } from "react";

const mockStartAnimation = jest.fn()
jest.mock("../../src/hooks/useTabAnimation", () => {
    return jest.fn(() => ({
        startAnimation: mockStartAnimation
    }));
});
jest.mock('../../src/utils/functinos')

jest.spyOn(Alert, "alert").mockImplementation(() => { });
jest.mock("../../src/realm/models/ZellerCustomer");

const mockGoBack = jest.fn();
const navigation = { goBack: mockGoBack };
const mockValidateName = validateName as jest.Mock;
const mockValidateEmail = validateEmail as jest.Mock;
const mockWrite = jest.fn((cb) => cb());


jest.mock("../../src/realm/setup", () => ({
    useRealm: () => ({
        write: mockWrite
    })
}))

describe('AddNewUserScreen', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("renders correctly", () => {
        const { getByText, getByPlaceholderText } = render(<AddNewUserScreen navigation={navigation as any} route={{} as any} />);
        expect(getByText("New User")).toBeTruthy();
        expect(getByPlaceholderText("Full Name*")).toBeTruthy();
        expect(getByPlaceholderText("Email")).toBeTruthy();
        expect(getByText("Create User")).toBeTruthy();
    })


    it("shows error when email is invalid", () => {
        const { getByText, getByPlaceholderText } = render(
            <AddNewUserScreen navigation={navigation as any} route={{} as any} />
        );

        mockValidateName.mockReturnValue(null);
        mockValidateEmail.mockReturnValue("Invalid email");

        fireEvent.changeText(getByPlaceholderText("Full Name*"), "John Doe");
        fireEvent.changeText(getByPlaceholderText("Email"), "wrong");
        fireEvent.press(getByText("Create User"));

        expect(Alert.alert).toHaveBeenCalledWith("Error", "Invalid email");
    });


    it("shows error when fullName is invalid", () => {
        const { getByText, getByPlaceholderText } = render(
            <AddNewUserScreen navigation={navigation as any} route={{} as any} />
        );
        const mockValidateName = validateName as jest.Mock;
        const mockValidateEmail = validateEmail as jest.Mock;
        mockValidateName.mockReturnValue("Invalid name");
        mockValidateEmail.mockReturnValue(null);

        fireEvent.changeText(getByPlaceholderText("Full Name*"), "John32@Doe");
        fireEvent.changeText(getByPlaceholderText("Email"), "john@gmail.com");
        fireEvent.press(getByText("Create User"));

        expect(Alert.alert).toHaveBeenCalledWith("Error", "Invalid name");
    });

    it("saves user successfully when inputs are valid", async () => {
        const { getByText, getByPlaceholderText } = render(
            <AddNewUserScreen navigation={navigation as any} route={{} as any} />
        );
        mockValidateName.mockReturnValue("");
        mockValidateEmail.mockReturnValue("");
        fireEvent.changeText(getByPlaceholderText("Full Name*"), "Laxy Doe");
        fireEvent.changeText(getByPlaceholderText("Email"), "Laxy@test.com");
        fireEvent.press(getByText("Create User"));

        await waitFor(() => {
            expect(mockWrite).toHaveBeenCalled();
            expect(ZellerCustomer).toHaveBeenCalledWith(
                expect.anything(), // ignore realm object
                "Laxy Doe",
                "Laxy@test.com",
                EROLES.ADMIN,

                // default role is Admin
            );
            expect(Alert.alert).toHaveBeenCalledWith(
                "Success",
                "Data saved successfully."
            );
        })

    })


    it("handles realm write error", async () => {
        mockWrite.mockImplementationOnce(() => {
            throw new Error("Realm error");
        });

        mockValidateName.mockReturnValue("");
        mockValidateEmail.mockReturnValue("");

        const { getByText, getByPlaceholderText } = render(
            <AddNewUserScreen navigation={navigation as any} route={{} as any} />
        );

        fireEvent.changeText(getByPlaceholderText("Full Name*"), "Jane Doe");
        fireEvent.changeText(getByPlaceholderText("Email"), "jane@test.com");
        fireEvent.press(getByText("Create User"));

        await waitFor(() => {
            expect(Alert.alert).toHaveBeenCalledWith("Error", "Something went wrong!");
        });
    });

    it("switches role via AnimatedTabView", async () => {
        const { getByTestId } = render(
            <AddNewUserScreen navigation={navigation as any} route={{} as any} />
        );

        act(() => {
            fireEvent.press(getByTestId("tab-Manager"));
        });

        await waitFor(() => {

            expect(mockStartAnimation).toHaveBeenCalledWith(1, 300);
        })
    });

    test('Navigation go back should call', () => {
        const { getByText } = render(
            <AddNewUserScreen navigation={navigation as any} route={{} as any} />
        );
        fireEvent.press(getByText("x"));
        expect(navigation.goBack).toHaveBeenCalled();

    })


})