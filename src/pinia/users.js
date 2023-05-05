//import { auth, db } from "@/plugins/firebase";
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
import {
  addDoc,
  collection,
  doc,
  getDocs,
  limit,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { defineStore } from "pinia";
import { isJSDocThisTag } from "typescript";
import { useDocument } from "vuefire";

export const useUserStore = defineStore("user", {
  state: () => ({
    loggedIn: false,
    user: useStorage("user", {
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
    async register(params) {
      // As httpOnly cookies are to be used, do not persist any state client side.
      const response = await createUserWithEmailAndPassword(
        auth,
        params.email,
        params.password
      );
      if (response) {
        this.setUser(response.user);
        updateProfile(response.user, {
          displayName: params.name,
        });
        this.saveUser(response.user, params.name);
      } else {
        throw new Error("Unable to register user");
      }
    },
    async saveUser(data, name) {
      const user = {
        uid: data.uid,
        name: name,
        email: data.email,
        image: {
          emoji: 0x1f600,
          background:
            "linear-gradient(136.78deg, rgb(255, 215, 178) 10.55%, rgb(252, 165, 191) 85.16%)",
        },
        friends: [],
      };
      this.users.push(await addDoc(collection(db, "users"), user));
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
    async getUserForLogin(uid) {
      const userQuery = useCollection(
        query(collection(db, "users"), limit(1), where("uid", "==", uid))
      );
      this.user = userQuery.value[0];
    },
    async logOut() {
      await signOut(auth);
      this.setUser(null);
      this.user = null;
      localStorage.clear();
    },
    async fetchUser() {
      if (this.user.uid) {
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
      isJSDocThisTag.data = JSON.parse(
        localStorage.getItem(window.localStorage.key(0))
      );
      if (this.userData) this.loggedIn = true;
    },
  },
});

export default useUserStore;
