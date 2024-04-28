import {initClient} from "@ts-rest/core";
import {contract} from "#shared/contract.ts";
import {create} from 'zustand'
import {util} from "zod";
import Omit = util.Omit;

const client = initClient(contract, {
  baseUrl: 'http://localhost:3000',
  throwOnUnknownStatus: true,
  validateResponse: true,
});

interface User {
  id: number
  name: string
  email: string
}

interface UserStore {
  user: User | null
  lookupLoading: boolean
  createLoading: boolean
  errorMessage: string | null
  actions: {
    lookupUser(id: number): Promise<void>
    createUser(user: Omit<User, 'id'>): Promise<void>
  }
}

const useUserStore = create<UserStore>((set) => ({
  user: null,
  lookupLoading: false,
  createLoading: false,
  errorMessage: null,
  actions: {
    async lookupUser(id: number) {
      set({lookupLoading: true});
      try {
        const result = await client.getUser({params: {id}});

        if (result.status === 404) {
          set({user: null});
          return;
        }

        if (result.status === 500) {
          set({errorMessage: result.body.message});
          return;
        }

        set({user: result.body});
      } finally {
        set({lookupLoading: false});
      }
    },
    async createUser(user: Omit<User, "id">) {
      set({createLoading: true});
      try {
        const result = await client.createUser({body: user});

        if (result.status === 400 || result.status === 500) {
          set({errorMessage: result.body.message});
          return;
        }

        set({user: result.body});
      } finally {
        set({createLoading: false});
      }
    }
  }
}));

export function useUser() {
  return useUserStore((s) => s.user);
}

export function useUserActions() {
  return useUserStore((s) => s.actions);
}

export function useLookupLoading() {
  return useUserStore((s) => s.lookupLoading);
}

export function useCreateLoading() {
  return useUserStore((s) => s.createLoading);
}

export function useErrorMessage() {
  return useUserStore((s) => s.errorMessage);
}
