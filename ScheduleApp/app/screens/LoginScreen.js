import AuthContent from '../components/Auth/AuthContent';
import { useContext, useState } from 'react';
import LoadingOverlay from '../components/ui/LoadingOverlay';
import { login } from '../util/auth';
import { Alert } from 'react-native';
import { AuthContext } from '../store/auth-context';
import { getUserData } from '../util/http';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { app } from "../config/firebaseConfig";
import { ref, getDownloadURL, getStorage } from "firebase/storage";


function LoginScreen() {

  const [isAuthenticating, setIsAuthenticating] = useState(false);
  // const [user, setUser] = useState(null);

  const authCtx = useContext(AuthContext);
  const storage = getStorage(app);


  async function loginHandler({email, password}) {
    setIsAuthenticating(true);
    try {
        const { token, userId } = await login(email, password);
        authCtx.authenticate(token, userId);
        
        const data = await getUserData(userId);
        AsyncStorage.setItem('userData', JSON.stringify(data));

        const pathReference = ref(storage, userId);
        console.log(pathReference);
        getDownloadURL(pathReference)
          .then((url) => {
            AsyncStorage.setItem('profileUri', url);
          })
          .catch((error) => {
            console.log(error);
          })

    } catch (error) {
        console.log(error)
        Alert.alert('Authentication failed!',
            'Could not log you in. Please check your credentials or try later!'
        );
        setIsAuthenticating(false);
    }
  }

  if (isAuthenticating) {
    return <LoadingOverlay message="Logging you in..."/>
  }
  
  return <AuthContent isLogin onAuthenticate={loginHandler}/>;
}

export default LoginScreen;