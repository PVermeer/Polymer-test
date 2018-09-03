export interface SomeDoc {
  some: string;
}
export interface SomeDocRef {
  ref: string;
  data: SomeDoc;
}

export interface UserDb {
  userId: string;
  email: string;
  username: string;
  userType: 'user' | 'admin' | 'superAdmin';
}