import Realm, { BSON } from "realm";
import { ZellerCustomer } from "../realm/models/ZellerCustomer";
import { IZellerCustomer } from "../types";

/**
 * Syncs backend data into Realm
 * @param realm The Realm instance
 * @param apiData The array of ZellerCustomer objects from backend
 */
export const syncZellerCustomers = async (
  realm: Realm,
  apiData: IZellerCustomer[]
) => {
  if (!apiData || apiData.length === 0) return;

  realm.write(() => {
    apiData.forEach((item) => {
      realm.create(
        ZellerCustomer,
        {
          id: item.id ,
          name: item.name,
          email: item.email,
          role: item.role, 
        },
        Realm.UpdateMode.Modified 
      );
    });
  });
};

export const validateName = (name: string) => {
  if (!name.trim()) return 'Name cannot be empty';  
  if (!/^[A-Za-z ]+$/.test(name)) return 'Only alphabets and spaces allowed';
  if (name.length > 50) return 'Name cannot exceed 50 characters';
  return '';
};

export const validateEmail = (email: string) => {
  if (!email) return '';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return 'Invalid email format';
  return '';
};


export const groupByLetter = (data: IZellerCustomer[]) => {
  const sorted = [...data].sort((a, b) => a.name.localeCompare(b.name));
  const grouped: { title: string; data: IZellerCustomer[] }[] = [];

  sorted.forEach((item) => {
      const letter = item.name[0].toUpperCase();
      const section = grouped.find((g) => g.title === letter);
      if (section) {
          section.data.push(item);
      } else {
          grouped.push({ title: letter, data: [item] });
      }
  });

  return grouped;
};