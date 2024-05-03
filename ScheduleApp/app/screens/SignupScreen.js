import AuthContent from "../components/Auth/AuthContent";
import { createUser } from "../util/auth";
import { useContext, useState } from "react";
import LoadingOverlay from "../components/ui/LoadingOverlay";
import { Alert } from "react-native";
import { AuthContext } from "../store/auth-context";
import { addUser } from "../util/http";

function SignupScreen() {
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const authCtx = useContext(AuthContext);

  async function signupHandler({ email, password }) {
    setIsAuthenticating(true);
    try {
      const { token, userId } = await createUser(email, password);
      authCtx.authenticate(token, userId);
      await addUser(userId); // TODO createUser and addUser should be atomic
    } catch (error) {
      Alert.alert(
        "Authentication failed",
        "Could not create user, please try again later."
      );
      setIsAuthenticating(false);
    }
  }

  if (isAuthenticating) {
    return <LoadingOverlay message="Creating user..." />;
  }

  return <AuthContent onAuthenticate={signupHandler} />;
}

export default SignupScreen;
