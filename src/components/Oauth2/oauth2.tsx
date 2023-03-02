import { environment } from "@api/environment";
import axios from "axios";
import { useCallback, useState, useRef } from "react";

const POPUP_HEIGHT = 700;
const POPUP_WIDTH = 600;

const openPopup = (url) => {
  const top = window.outerHeight / 2 + window.screenY - POPUP_HEIGHT / 2;
  const left = window.outerWidth / 2 + window.screenX - POPUP_WIDTH / 2;
  const win = window.open(
    url,
    "",
    `height=${POPUP_HEIGHT},width=${POPUP_WIDTH},top=${top},left=${left}`
  );
  return win;
};

const cleanup = (intervalRef, popupRef, handleMessageListener) => {
  if (intervalRef.current) {
    clearInterval(intervalRef.current);
  }
  if (popupRef.current) {
    popupRef.current.close();
  }
  window.removeEventListener("message", handleMessageListener);
};

export const useOAuth = () => {
  const [authenticating, setAuthenticating] = useState(false);
  const popupRef = useRef<Window>();
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  const getAuth = useCallback(async (onSuccess, onFailure) => {
    setAuthenticating(true);
    if (popupRef.current && !popupRef.current.closed) {
      popupRef.current.close();
    }
    popupRef.current = openPopup(
      `https://discord.com/oauth2/authorize?response_type=code&client_id=1080508975780474900&scope=identify&state=15773059ghq9183habn&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fcallback&prompt=consent`
    ) as any;

    async function handleMessageListener(message) {
      try {
        const type = message && message.data && message.data.type;
        if (type === "OAUTH_RESPONSE") {
          console.log("RECEIVE MESSAGE");
          const error = message && message.data && message.data.error;
          if (error) {
            onFailure(error);
          } else {
            const response = await axios.post(
              `${environment.apiUrl}/autID/config/oauth2AccessToken`,
              {
                code: message.data.payload.code
              }
            );
            debugger;

            setAuthenticating(false);
            onSuccess(response.data.results);
          }
        }
      } catch (genericError) {
        console.error(genericError);
      }
    }
    window.addEventListener("message", handleMessageListener);

    //Check for abrupt closing of popup
    intervalRef.current = setInterval(() => {
      const popupClosed =
        !popupRef.current ||
        !(popupRef.current as any).window ||
        (popupRef.current as any).window.closed;
      if (popupClosed) {
        setAuthenticating(false);
        clearInterval(intervalRef.current);
        window.removeEventListener("message", handleMessageListener);
      }
    }, 250);

    return () => {
      setAuthenticating(false);
      cleanup(intervalRef, popupRef, handleMessageListener);
    };
  }, []);

  return { getAuth, authenticating };
};