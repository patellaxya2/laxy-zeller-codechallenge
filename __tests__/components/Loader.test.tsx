import { render } from "@testing-library/react-native"
import Loader from "../../src/components/Loader"

describe('Loader', () => {

    test('should loader visible', () => {
        const { getByText } = render(<Loader visible={true} />)

        expect(getByText("Loading...")).toBeTruthy()
    })


    test('should loader invisible', () => {
        const { queryByText } = render(<Loader visible={false} />)

        expect(queryByText("Loading...")).toBeNull()
    })


})