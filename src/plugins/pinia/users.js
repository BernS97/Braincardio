import { auth, db } from "@/plugins/firebase";
import { useStorage } from "@vueuse/core";
import {
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  getAuth,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { addDoc, collection, limit, query, where } from "firebase/firestore";
import { defineStore } from "pinia";
import { useCollection } from "vuefire";

export const useUserStore = defineStore("user", {
  state: () => ({
    loggedIn: false,
    user: useStorage("user", {
      id: null,
      authId: null,
      name: null,
      email: null,
      image: null,
      friends: [],
    }),
    userData: null,
  }),
  getters: {
    getUser(state) {
      return state;
    },
    getLoggedInUserProfile(state) {
      return state.user;
    },
  },
  actions: {
    async register(email, password, name) {
      // As httpOnly cookies are to be used, do not persist any state client side.
      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      if (response) {
        this.setUser(response.user);
        updateProfile(response.user, {
          displayName: name,
        });
        this.saveUser(response.user, name);
      } else {
        throw new Error("Unable to register user");
      }
    },
    async saveUser(data, name) {
      const user = {
        authId: data.uid,
        name: name,
        email: data.email,
        image: {
          emoji: 0x1f600,
          background:
            "linear-gradient(136.78deg, rgb(255, 215, 178) 10.55%, rgb(252, 165, 191) 85.16%)",
        },
        friends: [],
      };
      await addDoc(collection(db, "users"), user);
    },
    async logIn(email, password) {
      await setPersistence(auth, browserLocalPersistence).then(async () => {
        await signInWithEmailAndPassword(getAuth(), email, password).then(
          async (response) => {
            if (response) {
              this.setUser(response.user);
              await this.getUserForLogin(response.user.uid);
              this.setLoggedIn(true);
              return this.user;
            } else {
              throw new Error("login failed");
            }
          }
        );
      });
    },
    async getUserForLogin(authId) {
      const { data: userQuery, promise } = useCollection(
        query(collection(db, "users"), limit(1), where("authId", "==", authId))
      );
      promise.value.then(() => {
        this.user = { ...userQuery.value[0] };
      });
    },
    async logOut() {
      await signOut(auth);
      this.setUser(null);
      this.user = null;
      localStorage.clear();
    },
    async fetchUser() {
      if (this.user.authId) {
        this.setUserLocalStorage(null);
        this.setLoggedIn(this !== null);
      }
      if (this) {
        return this;
      } else {
        this.setUser(null);
      }
    },
    setLoggedIn(value) {
      this.loggedIn = value;
    },
    setUser(data) {
      this.userData = data;
    },
    setUserLocalStorage() {
      localStorage.setItem("login", this.userData);
    },
  },
});

export default useUserStore;
