import { View, Text, FlatList, Pressable, Image } from "react-native";
import React from "react";
import SwitchSelector from "react-native-switch-selector";

const TextOnly = () => {
  return (
    <Text className="text-[#5e5e5e] font-interMedium">
      ryanjin333@gmail.com
    </Text>
  );
};

const TextAndNavigation = () => {
  return (
    <View className="flex-row space-x-3 items-center">
      <Text className="text-[#5e5e5e] font-interMedium">Not Set</Text>
      <Image
        className="w-7 h-7"
        source={require("../assets/forward_chevron.png")}
      />
    </View>
  );
};

const SwitcherOnly = () => {
  return (
    <SwitchSelector
      className="w-48"
      initial={0}
      onPress={() => console.log("changed weight")} // CHANGE WEIGHT CONVERSION HERE
      textColor={"#fff"}
      selectedColor={"#ffffff"}
      buttonColor={"#676767"}
      backgroundColor={"#212121"}
      borderWidth={0}
      hasPadding
      options={[{ label: "lbs" }, { label: "kg" }]}
      borderRadius={14}
    />
  );
};

const NavigationOnly = () => {
  return (
    <Image
      className="w-7 h-7"
      source={require("../assets/forward_chevron.png")}
    />
  );
};

const SettingsList = ({ data }) => {
  return (
    <View className="w-full">
      <View className="w-full mt-6 rounded-[18px]">
        <FlatList
          scrollEnabled={false}
          className="rounded-[18px] "
          data={data.data}
          renderItem={({ item }) => (
            <Pressable
              className="w-full h-14 bg-[#151515] flex-row  items-center justify-between px-5"
              onPress={() => {
                console.log("pressed");
              }}
            >
              <Text className="text-white text-sm font-interSemiBold">
                {item.title}
              </Text>

              {/* add functions */}
              {item.title == "Email" || item.title == "App version" ? (
                <TextOnly />
              ) : (
                <>
                  {item.title == "Username" || item.title == "Full name" ? (
                    <TextAndNavigation />
                  ) : (
                    <>
                      {item.title == "Weight" ? (
                        <SwitcherOnly />
                      ) : (
                        <NavigationOnly />
                      )}
                    </>
                  )}
                </>
              )}
            </Pressable>
          )}
          keyExtractor={(item, index) => item.title + index}
        />
      </View>
    </View>
  );
};

export default SettingsList;
