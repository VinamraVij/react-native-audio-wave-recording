/* eslint-disable react/self-closing-comp */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useRef, useState } from 'react';
import type { PropsWithChildren } from 'react';
import Animated, { BounceIn, BounceInLeft, ReduceMotion, RollInLeft, RollInRight, SlideInRight, ZoomIn, ZoomInEasyDown, ZoomInEasyUp, ZoomInLeft, ZoomInRight, ZoomInRotate, ZoomOut, createWorkletRuntime, runOnJS, runOnUI, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import {
  Easing,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import AudioRecorderPlayer, { AVEncoderAudioQualityIOSType, AVEncodingOption, AVModeIOSOption, AudioEncoderAndroidType, AudioSet, AudioSourceAndroidType } from 'react-native-audio-recorder-player';

type SectionProps = PropsWithChildren<{
  title: string;
}>;
const audioRecorderPlayer = new AudioRecorderPlayer();
audioRecorderPlayer.setSubscriptionDuration(0.1)
function myWorklet() {

  console.log(`${"H"} from the UI thread`);
}

function Section({ children, title }: SectionProps): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}

function App(): React.JSX.Element {
  const audioSet: AudioSet = {
    AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
    AudioSourceAndroid: AudioSourceAndroidType.MIC,
    AVModeIOS: AVModeIOSOption.measurement,
    AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
    AVNumberOfChannelsKeyIOS: 2,
    AVFormatIDKeyIOS: AVEncodingOption.aac,
  };

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,

  };
  const [temp, setTemp] = useState([0,]);

  const tempRef = useRef({ temp: [0,], isPlaying: false })
  const width = useSharedValue(10);
  const [isPlaying, setIsPlaing] = useState(false);

  // useEffect(() => {
  //   setInterval(() => {
  // if (tempRef.current.isPlaying) {
  //   let temp1 = [...tempRef.current.temp, 0]
  //   tempRef.current.temp = temp1

  //   setTemp(temp1)
  //   width.value = (width.value + 10 + 5)
  //     }
  //   }, 100)
  // }, [])


  const linear = Easing.linear
  const customEasing = (value: number) => {
    'worklet'
    // Perform calculations here
    return value; // Ensure a number is returned
  };

  const style = useAnimatedStyle(() => {
    return {
      width: withTiming(width.value, {
        duration: 100,
        easing: customEasing,
        reduceMotion: ReduceMotion.Never

      }, () => {

      }),

    };
  });

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={'blue'}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}></ScrollView>

      <Animated.View style={{ backgroundColor: 'white', height: '80%', display: 'flex', flexDirection: 'row-reverse', alignItems: 'center' }}>
        <Animated.View entering={SlideInRight} style={[{ display: 'flex', flexDirection: 'row', overflow: 'hidden', backgroundColor: 'white', gap: 10, alignItems: 'center' }, style]}>
          {temp.map(t => {
            return <Animated.View entering={ZoomIn} style={{ height: t > 10 ? t : 10, width: 5, borderRadius: 200, backgroundColor: 'black', }} />
          })}
        </Animated.View>


      </Animated.View>
      <Pressable onPress={async () => {
        console.log("pressing");
        try {
          if (!tempRef.current.isPlaying) {

            console.log("STARTING")
            const a = await audioRecorderPlayer.startRecorder(undefined, audioSet, true)
            console.log(a)
            audioRecorderPlayer.addRecordBackListener((e) => {
              if (tempRef.current.isPlaying && e.currentMetering) {
                let temp1 = [...tempRef.current.temp, (e.currentMetering + 70) * 1.2]
                tempRef.current.temp = temp1

                setTemp(temp1)
                width.value = (width.value + 10 + 5)
              }
            })
          }
          else {
            console.log(tempRef)
            console.log("STOPPING")
            await audioRecorderPlayer.removeRecordBackListener();

            const a = await audioRecorderPlayer.stopRecorder();
            console.log(a)
          }
        }
        catch (error) {
          console.log(error)
        }
        tempRef.current.isPlaying = !tempRef.current.isPlaying
      }}><Text>Record/Stop</Text></Pressable>
      <Pressable onPress={() => {
        audioRecorderPlayer.startPlayer()
      }}><Text>Play</Text></Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,

  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
