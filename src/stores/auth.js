import { reactive } from 'vue'
import { auth } from '../firebase'
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile as firebaseUpdateProfile,
  updatePassword as firebaseUpdatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail
} from 'firebase/auth'

export const authStore = reactive({
  user: null,
  loading: true,
  error: null,
  
  // Initialize auth state listener
  init() {
    return new Promise((resolve) => {
      onAuthStateChanged(auth, (firebaseUser) => {
        if (firebaseUser) {
          this.user = {
            id: firebaseUser.uid,
            name: firebaseUser.displayName || 'User',
            email: firebaseUser.email,
            avatar: firebaseUser.photoURL,
            emailVerified: firebaseUser.emailVerified
          }
        } else {
          this.user = null
        }
        this.loading = false
        resolve(this.user)
      })
    })
  },
  
  async login(email, password) {
    this.error = null
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const firebaseUser = userCredential.user
      this.user = {
        id: firebaseUser.uid,
        name: firebaseUser.displayName || 'User',
        email: firebaseUser.email,
        avatar: firebaseUser.photoURL,
        emailVerified: firebaseUser.emailVerified
      }
      return { success: true }
    } catch (error) {
      this.error = this.getErrorMessage(error.code)
      return { success: false, error: this.error }
    }
  },
  
  async register(name, email, password) {
    this.error = null
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const firebaseUser = userCredential.user
      
      // Update the display name
      await firebaseUpdateProfile(firebaseUser, { displayName: name })
      
      this.user = {
        id: firebaseUser.uid,
        name: name,
        email: firebaseUser.email,
        avatar: firebaseUser.photoURL,
        emailVerified: firebaseUser.emailVerified
      }
      return { success: true }
    } catch (error) {
      this.error = this.getErrorMessage(error.code)
      return { success: false, error: this.error }
    }
  },
  
  async loginWithGoogle() {
    this.error = null
    try {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      const firebaseUser = result.user
      this.user = {
        id: firebaseUser.uid,
        name: firebaseUser.displayName || 'User',
        email: firebaseUser.email,
        avatar: firebaseUser.photoURL,
        emailVerified: firebaseUser.emailVerified
      }
      return { success: true }
    } catch (error) {
      this.error = this.getErrorMessage(error.code)
      return { success: false, error: this.error }
    }
  },
  
  async logout() {
    try {
      await signOut(auth)
      this.user = null
      return { success: true }
    } catch (error) {
      this.error = this.getErrorMessage(error.code)
      return { success: false, error: this.error }
    }
  },
  
  async resetPassword(email) {
    this.error = null
    try {
      await sendPasswordResetEmail(auth, email)
      return { success: true }
    } catch (error) {
      this.error = this.getErrorMessage(error.code)
      return { success: false, error: this.error }
    }
  },
  
  async updateProfile(data) {
    this.error = null
    try {
      const currentUser = auth.currentUser
      if (currentUser) {
        await firebaseUpdateProfile(currentUser, {
          displayName: data.name || currentUser.displayName,
          photoURL: data.avatar || currentUser.photoURL
        })
        this.user = {
          ...this.user,
          name: data.name || this.user.name,
          avatar: data.avatar || this.user.avatar
        }
      }
      return { success: true }
    } catch (error) {
      this.error = this.getErrorMessage(error.code)
      return { success: false, error: this.error }
    }
  },

  async updatePassword(currentPassword, newPassword) {
    this.error = null
    try {
      const currentUser = auth.currentUser
      if (!currentUser || !currentUser.email) {
        return { success: false, error: 'Kein Benutzer angemeldet' }
      }
      
      // Re-authenticate the user first
      const credential = EmailAuthProvider.credential(currentUser.email, currentPassword)
      await reauthenticateWithCredential(currentUser, credential)
      
      // Now update the password
      await firebaseUpdatePassword(currentUser, newPassword)
      return { success: true }
    } catch (error) {
      this.error = this.getErrorMessage(error.code)
      return { success: false, error: this.error }
    }
  },
  
  isAuthenticated() {
    return this.user !== null
  },
  
  getErrorMessage(code) {
    const errorMessages = {
      'auth/email-already-in-use': 'Diese E-Mail ist bereits registriert',
      'auth/invalid-email': 'Ungültige E-Mail-Adresse',
      'auth/operation-not-allowed': 'Operation nicht erlaubt',
      'auth/weak-password': 'Passwort ist zu schwach (min. 6 Zeichen)',
      'auth/user-disabled': 'Dieses Konto wurde deaktiviert',
      'auth/user-not-found': 'Kein Konto mit dieser E-Mail gefunden',
      'auth/wrong-password': 'Falsches Passwort',
      'auth/invalid-credential': 'Ungültige E-Mail oder Passwort',
      'auth/too-many-requests': 'Zu viele Versuche. Bitte später erneut versuchen',
      'auth/popup-closed-by-user': 'Anmelde-Popup wurde geschlossen',
      'auth/account-exists-with-different-credential': 'Ein Konto mit dieser E-Mail existiert bereits',
      'auth/requires-recent-login': 'Bitte melde dich erneut an, um diese Aktion durchzuführen'
    }
    return errorMessages[code] || 'Ein Fehler ist aufgetreten. Bitte versuche es erneut.'
  }
})
