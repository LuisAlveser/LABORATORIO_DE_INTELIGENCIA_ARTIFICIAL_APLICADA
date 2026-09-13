import React, { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import { Loader2 } from 'lucide-react-native';

export function Spinner() {
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const rotateAnimation = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true, // Garante performance nativa de 60fps
      })
    );
    rotateAnimation.start();
    return () => rotateAnimation.stop();
  }, [spinValue]);

  // CORREÇÃO AQUI: Definido o intervalo correto de 0 a 1
  const spin = spinValue.interpolate({
    inputRange:[0,1], 
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View style={{ transform: [{ rotate: spin }], marginRight: 8 }}>
      <Loader2 size={20} color="#FFFFFF" />
    </Animated.View>
  );
}
