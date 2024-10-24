import * as Haptics from "expo-haptics";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";

const screenTransition = ({ navigateTo, transition, delay }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
  dispatch(transition);
  setTimeout(() => {
    navigation.navigate(navigateTo);
  }, delay);
};

const AnimationHelper = { screenTransition };
export default AnimationHelper;
