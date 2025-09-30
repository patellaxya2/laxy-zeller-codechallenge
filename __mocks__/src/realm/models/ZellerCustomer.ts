export const ZellerCustomer = jest.fn().mockImplementation(() => {
    return {
      id: "mock-id",
      fullName: "Mock User",
      email: "mock@email.com",
      role: "ADMIN",
    };
  });
  