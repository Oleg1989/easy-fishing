import { createAsyncThunk } from '@reduxjs/toolkit';
import { getDatabase, ref, set, child, get, remove } from "firebase/database";
import { Location } from '../views/interface/InterfaceLocation';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "firebase/auth";
import { UserApp } from './interface/InterfaceUserApp';

export const loginUser = createAsyncThunk(
  'container/loginUser',
  async (
    userApp: {
      email: string,
      password: string,
      error: (message: string) => void,
    }) => {
    const auth = getAuth();
    let userToken: string | null = null;
    let uId: string | null = null;
    await signInWithEmailAndPassword(auth, userApp.email, userApp.password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        uId = user.uid;
        await user.getIdToken()
          .then((token) => {
            userToken = token;
          }
          )
      })
      .catch((error: Error) => {
        const errorMessage = error.message;
        userApp.error(errorMessage);
      });
    return { token: userToken, id: uId };;
  }
);

export const registrationUser = createAsyncThunk(
  'container/registrationUser',
  async (
    userApp: {
      name: string,
      email: string,
      password: string,
      locations: {},
      error: (message: string) => void,
    }) => {
    const auth = getAuth();
    const db = getDatabase();
    let userToken: string | null = null;
    let uId: string | null = null;
    await createUserWithEmailAndPassword(auth, userApp.email, userApp.password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        uId = user.uid;
        await user.getIdToken()
          .then((token) => {
            userToken = token;
          }
          )
        await set(ref(db, 'users/' + uId), {
          name: userApp.name,
          email: user.email,
          location: userApp.locations
        });
      })
      .catch((error) => {
        const errorMessage = error.message;
        userApp.error(errorMessage);
      });
    return { token: userToken, id: uId };
  }
);

export const addLocathinDatabase = createAsyncThunk(
  'container/addLocathinDatabase',
  async (marker: { location: Location, uId: string }) => {
    const db = getDatabase();

    await set(ref(db, '/users/' + marker.uId + '/locations/' + marker.location.id), marker.location);
    return marker;
  }
);

export const getUserFromDatabase = createAsyncThunk(
  'container/getUserFromDatabase',
  async (action: { uId: string | null, error: (message: string) => void }) => {
    const db = getDatabase();
    const dbRef = ref(db);

    let userData: UserApp | null = await get(child(dbRef, `users/${action.uId}`)).then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        return data;
      } else {
        console.log("No data available");
      }
    }).catch((error) => {
      const errorMessage = error.message;
      action.error(errorMessage);
    });
    return userData;
  }
);

export const getPublicLocations = createAsyncThunk(
  'container/getPublicLocations',
  async (error: (message: string) => void) => {
    const dbRef = ref(getDatabase());

    const locations: Location[] = [];
    await get(child(dbRef, `users`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          const users = snapshot.val();
          for (let keyUser in users) {
            if (users[keyUser].locations) {
              for (let key in users[keyUser].locations) {
                if (users[keyUser].locations[key].publicLocation) {
                  locations.push(users[keyUser].locations[key]);
                }
              }
            }
          }
        } else {
          console.log("No data available");
        }
      }).catch((error) => {
        const errorMessage = error.message;
        error(errorMessage);
      });
    return locations;
  }
);

export const deleteLocathinDatabase = createAsyncThunk(
  'container/deleteLocathinDatabase',
  async (id: { userId: string, locationId: string, error: (message: string) => void }) => {
    const db = getDatabase();

    await remove(ref(db, '/users/' + id.userId + '/locations/' + id.locationId))
      .catch((error: Error) => {
        const errorMessage = error.message;
        id.error(errorMessage);
      });

    return id.locationId;
  }
);

export const updateLocathinDatabase = createAsyncThunk(
  'container/updateLocathinDatabase',
  async (marker: { location: Location, uId: string }) => {
    const db = getDatabase();

    await set(ref(db, '/users/' + marker.uId + '/locations/' + marker.location.id), marker.location);
    return marker;
  }
);