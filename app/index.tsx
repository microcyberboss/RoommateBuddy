import { useEffect } from 'react';
import { Redirect } from 'expo-router';

export default function IndexScreen() {
  // For testing purposes, redirect to the test page
  return <Redirect href="/test" />;
}
