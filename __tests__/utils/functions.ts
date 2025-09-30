import { ZellerCustomer } from "../../src/realm/models/ZellerCustomer";
import { IZellerCustomer } from "../../src/types";
import { EROLES } from "../../src/utils/enum";
import { syncZellerCustomers, validateEmail, validateName } from "../../src/utils/functinos"
import Realm, { BSON } from "realm";


describe('validateName', () => {
    it('should return error if name is empty', () => {
      expect(validateName('')).toBe('Name cannot be empty');
      expect(validateName('    ')).toBe('Name cannot be empty');
    });
  
    it('should return error if name contains non-alphabet characters', () => {
      expect(validateName('John123')).toBe('Only alphabets and spaces allowed');
      expect(validateName('John@Doe')).toBe('Only alphabets and spaces allowed');
    });
  
    it('should return error if name exceeds 50 characters', () => {
      const longName = 'A'.repeat(51);
      expect(validateName(longName)).toBe('Name cannot exceed 50 characters');
    });
  
    it('should return empty string for valid names', () => {
      expect(validateName('John Doe')).toBe('');
      expect(validateName('Alice')).toBe('');
    });
  });
  
  describe('validateEmail', () => {
    it('should return empty string if email is empty', () => {
      expect(validateEmail('')).toBe('');
      expect(validateEmail(undefined as unknown as string)).toBe(''); // just in case
    });
  
    it('should return error for invalid email formats', () => {
      expect(validateEmail('john')).toBe('Invalid email format');
      expect(validateEmail('john@')).toBe('Invalid email format');
      expect(validateEmail('john@doe')).toBe('Invalid email format');
      expect(validateEmail('john@doe.')).toBe('Invalid email format');
    });
  
    it('should return empty string for valid emails', () => {
      expect(validateEmail('john@example.com')).toBe('');
      expect(validateEmail('alice.doe@gmail.com')).toBe('');
    });
  });



  describe('syncZellerCustomers', () => {
    let mockRealm: Partial<Realm>;
    let mockWrite: jest.Mock;
    let mockCreate: jest.Mock;
  
    beforeEach(() => {
      mockCreate = jest.fn();
      mockWrite = jest.fn((cb) => cb());
      mockRealm = {
        write: mockWrite,
        create: mockCreate,
      };
    });
  
    it('does nothing if apiData is empty or null', async () => {
      await syncZellerCustomers(mockRealm as any, []);
      await syncZellerCustomers(mockRealm as any, null as any);
  
      expect(mockWrite).not.toHaveBeenCalled();
      expect(mockCreate).not.toHaveBeenCalled();
    });
  
    it('writes and creates/updates customers correctly', async () => {
      const apiData:IZellerCustomer[] = [
        { id: '1', name: 'Alice', email: 'alice@test.com', role: EROLES.ADMIN },
        { id: '2', name: 'Bob', email: 'bob@test.com', role: EROLES.MANAGER },
      ];
  
      await syncZellerCustomers(mockRealm as any, apiData);
  
      // Ensure realm.write is called once
      expect(mockWrite).toHaveBeenCalledTimes(1);
  
      // Ensure realm.create is called for each item
      expect(mockCreate).toHaveBeenCalledTimes(apiData.length);
  
      // Check that create was called with correct data and UpdateMode
      expect(mockCreate).toHaveBeenCalledWith(
        ZellerCustomer,
        { id: '1', name: 'Alice', email: 'alice@test.com', role: 'ADMIN' },
        Realm.UpdateMode.Modified
      );
      expect(mockCreate).toHaveBeenCalledWith(
        ZellerCustomer,
        { id: '2', name: 'Bob', email: 'bob@test.com', role: 'MANAGER' },
        Realm.UpdateMode.Modified
      );
    });
  });