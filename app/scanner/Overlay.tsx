import { Canvas, DiffRect, rect, rrect, CanvasProps } from "@shopify/react-native-skia";
import { Platform, StyleSheet, useWindowDimensions, View } from "react-native";

export const Overlay = () => {
  const { width, height } = useWindowDimensions();
  
  if (width === 0 || height === 0) {
    return null;
  }

  // For web, return a simple View with background color
  if (Platform.OS === 'web') {
    return (
      <View style={[StyleSheet.absoluteFillObject, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
        <View style={{
          position: 'absolute',
          top: height / 2 - 50,
          left: width / 2 - 50,
          width: 300,
          height: 300,
          backgroundColor: 'transparent',
          borderWidth: 2,
          borderColor: 'white',
          borderRadius: 50
        }} />
      </View>
    );
  }

  const innerDimension = 300;
  const outer = rrect(rect(0, 0, width, height), 0, 0);
  const inner = rrect(
    rect(
      width / 2 - innerDimension / 2,
      height / 2 - innerDimension / 2,
      innerDimension,
      innerDimension
    ),
    50,
    50
  );

  const canvasStyle = Platform.OS === "android" ? { flex: 1 } : StyleSheet.absoluteFillObject;

  return (
    <Canvas style={canvasStyle} {...({} as CanvasProps)}>
      <DiffRect inner={inner} outer={outer} color="black" opacity={0.5} />
    </Canvas>
  );
};