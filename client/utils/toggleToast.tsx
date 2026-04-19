import Toast from "react-native-toast-message";

type Props = {
  type: string;
  text1: string;
  text2?: string;
};

export const toggleToast = ({ type, text1, text2 }: Props) => {
  Toast.show({
    type,
    text1,
    text2,
  });
};
