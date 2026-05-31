"use client";

import {
  Box,
  Button,
  Checkbox,
  Flex,
  Heading,
  Input,
  VStack,
  AlertRoot,
  AlertDescription,
  AlertTitle,
  CloseButton
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "../providers";

export default function Timer() {
  const [hours, setHours] = useState<number>(0);
  const [minutes, setMinutes] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(0);

  const [initialTime, setInitialTime] = useState<number>(0);

  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isOvertime, setIsOvertime] = useState(false);
  const [allowOvertime, setAllowOvertime] = useState(true);

  const [isFullscreen, setIsFullscreen] = useState(false);

  const [error, setError] = useState<string>("");
  const [showError, setShowError] = useState(false);

  const { theme, toggleTheme } = useTheme();

  // 🔥 error helper
  const showErrorMessage = (msg: string) => {
    setError(msg);
    setShowError(true);

    setTimeout(() => {
      setShowError(false);
    }, 5000);
  };

  // Convert input → seconds
  const getTotalSeconds = () =>
  hours * 3600 + minutes * 60 + seconds;

  // 🔥 start timer
  // START / RESUME
  const startTimer = () => {
    // fresh start validation
    if (timeLeft === 0 && getTotalSeconds() === 0) {
      showErrorMessage("Provide hours, minutes or seconds.");
      return;
    }

    // if fresh start
    if (timeLeft === 0) {
      const total = getTotalSeconds();
      setInitialTime(total);
      setTimeLeft(total);
    }

    setIsOvertime(false);
    setIsRunning(true);
  };

  // PAUSE
  const pauseTimer = () => {
    setIsRunning(false);
  };

  // STOP / RESET
  const stopTimer = () => {
    setIsRunning(false);
    setTimeLeft(0);
    setInitialTime(0);
    setIsOvertime(false);
  };

  // 🔥 countdown logic
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev > 0) return prev - 1;

        if (prev === 0 && allowOvertime) {
          setIsOvertime(true);
          return -1;
        }

        if (prev < 0 && allowOvertime) return prev - 1;

        clearInterval(interval);
        setIsRunning(false);
        return 0;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, allowOvertime]);

  // 🔥 format time
  const formatTime = (t: number) => {
    const abs = Math.abs(t);

    const h = Math.floor(abs / 3600);
    const m = Math.floor((abs % 3600) / 60);
    const s = abs % 60;

    if (h === 0) {
      return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    }

    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(
      s
    ).padStart(2, "0")}`;
  };

  // 🔥 iOS-safe fullscreen (CSS-based)
  const toggleFullscreen = () => {
    setIsFullscreen((prev) => !prev);

    setHours(0);
    setMinutes(0);
    setSeconds(0);
  };

  return (
    <Flex
      position={isFullscreen ? "fixed" : "relative"}
      top="0"
      left="0"
      w="100vw"
      h="100vh"
      minH="100vh"
      direction="column"
      align="center"
      justify="center"
      bg="bg"
      color="fg"
      px={6}
      textAlign="center"
      zIndex={isFullscreen ? 9999 : "auto"}
      overflow="hidden"
    >
      {/* TITLE */}
      {!isFullscreen && (
        <Heading
          fontSize={{ base: "3xl", md: "5rem" }}
          mb={8}
          opacity={0.9}
          letterSpacing="wide"
        >
          Timer Countdown
        </Heading>
      )}

      {/* TIMER DISPLAY */}
      <Box
        fontSize={isFullscreen ? "25rem" : { base: "7xl", md: "10rem", lg: "15rem" }}
        fontWeight="extrabold"
        lineHeight="1"
        color={isOvertime ? "red.400" : "green.300"}
        mb={isFullscreen ? 12 : 8}
        transition="all 0.3s ease"
      >
        {formatTime(timeLeft)}
      </Box>

      {/* INPUTS */}
      {!isFullscreen && (
        <VStack
          gap={6}
          p={6}
          borderRadius="2xl"
          bg={theme === "dark" ? "whiteAlpha.50" : "white"}
          backdropFilter="blur(12px)"
          border="1px solid"
          borderColor={theme === "dark" ? "whiteAlpha.200" : "gray.200"}
          boxShadow={theme === "dark" ? "none" : "0 10px 30px rgba(0,0,0,0.08)"}
          w="full"
          maxW="700px"
        >
          {/* TIME INPUTS */}
          <Flex gap={4} w="full">
            <Input
              placeholder="Hours"
              type="number"
              textAlign="center"
              fontSize="xl"
              h="70px"
              bg={theme === "dark" ? "whiteAlpha.100" : "white"}
              borderColor={theme === "dark" ? "whiteAlpha.200" : "gray.300"}
              _hover={{
                borderColor: theme === "dark" ? "whiteAlpha.400" : "gray.400",
              }}
              _focus={{
                borderColor: "blue.400",
                boxShadow: "0 0 0 1px var(--chakra-colors-blue-400)",
              }}
              onChange={(e) => setHours(Number(e.target.value || 0))}
            />
            <Input
              placeholder="Minutes"
              type="number"
              textAlign="center"
              fontSize="xl"
              h="70px"
              bg={theme === "dark" ? "whiteAlpha.100" : "white"}
              borderColor={theme === "dark" ? "whiteAlpha.200" : "gray.300"}
              _hover={{
                borderColor: theme === "dark" ? "whiteAlpha.400" : "gray.400",
              }}
              _focus={{
                borderColor: "blue.400",
                boxShadow: "0 0 0 1px var(--chakra-colors-blue-400)",
              }}
              onChange={(e) => setMinutes(Number(e.target.value || 0))}
            />
            <Input
              placeholder="Seconds"
              type="number"
              textAlign="center"
              fontSize="xl"
              h="70px"
              bg={theme === "dark" ? "whiteAlpha.100" : "white"}
              borderColor={theme === "dark" ? "whiteAlpha.200" : "gray.300"}
              _hover={{
                borderColor: theme === "dark" ? "whiteAlpha.400" : "gray.400",
              }}
              _focus={{
                borderColor: "blue.400",
                boxShadow: "0 0 0 1px var(--chakra-colors-blue-400)",
              }}
              onChange={(e) => setSeconds(Number(e.target.value || 0))}
            />
          </Flex>

          {/* 🔥 RESPONSIVE BUTTONS (VERTICAL ON MOBILE) */}
          <Flex
            direction={{ base: "column", md: "row" }}
            gap={4}
            w="full"
            justify="center"
            align="center"
          >
            <Button
              colorScheme="green"
              onClick={startTimer}
              w={{ base: "full", md: "auto" }}
              size="lg"
              fontSize={{ base: "lg", md: "xl" }}
              px={{ base: 10, md: 8 }}
              py={{ base: 7, md: 6 }}
              borderRadius="xl"
              bg={theme === "dark" ? "green.500" : "green.400"}
              color="white"
              border="1px solid"
              borderColor={theme === "dark" ? "green.400" : "green.300"}
              boxShadow={
                theme === "dark"
                  ? "0 6px 20px rgba(34,197,94,0.25)"
                  : "0 6px 18px rgba(34,197,94,0.25)"
              }
              _hover={{
                bg: theme === "dark" ? "green.400" : "green.500",
                transform: "translateY(-1px)",
              }}
            >
              Start
            </Button>

            <Button
              colorScheme="yellow"
              onClick={() => setIsRunning(false)}
              w={{ base: "full", md: "auto" }}
              size="lg"
              fontSize={{ base: "lg", md: "xl" }}
              px={{ base: 10, md: 8 }}
              py={{ base: 7, md: 6 }}
              borderRadius="xl"
              bg={theme === "dark" ? "yellow.500" : "yellow.400"}
              color="black"
              border="1px solid"
              borderColor={theme === "dark" ? "yellow.400" : "yellow.300"}
              boxShadow="0 6px 18px rgba(234,179,8,0.25)"
              _hover={{
                bg: theme === "dark" ? "yellow.400" : "yellow.500",
                transform: "translateY(-1px)",
              }}
            >
              Pause
            </Button>

            <Button
              colorScheme="red"
              onClick={stopTimer}
              w={{ base: "full", md: "auto" }}
              size="lg"
              fontSize={{ base: "lg", md: "xl" }}
              px={{ base: 10, md: 8 }}
              py={{ base: 7, md: 6 }}
              borderRadius="xl"
              bg={theme === "dark" ? "red.500" : "red.400"}
              color="white"
              border="1px solid"
              borderColor={theme === "dark" ? "red.400" : "red.300"}
              boxShadow="0 6px 18px rgba(239,68,68,0.25)"
              _hover={{
                bg: theme === "dark" ? "red.400" : "red.500",
                transform: "translateY(-1px)",
              }}
            >
              Reset
            </Button>

            <Button
              onClick={toggleFullscreen}
              w={{ base: "full", md: "auto" }}
              size="lg"
              fontSize={{ base: "lg", md: "xl" }}
              px={{ base: 10, md: 8 }}
              py={{ base: 7, md: 6 }}
              borderRadius="xl"
              variant="outline"
              boxShadow={theme === "dark" ? "none" : "0 6px 18px rgba(0,0,0,0.25)"}
            >
              Fullscreen
            </Button>

            <Button
              onClick={toggleTheme}
              variant="outline"
              size="sm"
              boxShadow={theme === "dark" ? "none" : "0 6px 18px rgba(0,0,0,0.25)"}
            >
              {theme === "dark" ? <Sun /> : <Moon />}
            </Button>
          </Flex>

          {/* OVERTIME CHECKBOX */}
          <Box w="full" display="flex" justifyContent="center" py={2}>
            <Checkbox.Root
              checked={allowOvertime}
              onCheckedChange={(d) => setAllowOvertime(!!d.checked)}
            >
              <Flex
                align="center"
                gap={3}
                px={4}
                py={3}
                borderRadius="xl"
                bg={theme === "dark" ? "whiteAlpha.100" : "white"}
                border="1px solid"
                borderColor={theme === "dark" ? "whiteAlpha.200" : "gray.200"}
                boxShadow={theme === "dark" ? "none" : "0 6px 18px rgba(0,0,0,0.05)"}
                _hover={{
                  bg: theme === "dark" ? "whiteAlpha.200" : "gray.50",
                }}
                transition="all 0.2s ease"
                cursor="pointer"
              >
                <Checkbox.HiddenInput />

                {/* CUSTOM CHECKBOX CONTROL */}
                <Checkbox.Control
                  boxSize="6"
                  borderRadius="md"
                  border="2px solid"
                  borderColor={theme === "dark" ? "whiteAlpha.400" : "gray.400"}
                  bg={theme === "dark" ? "transparent" : "white"}
                  _checked={{
                    bg: "green.500",
                    borderColor: "green.500",
                  }}
                  _hover={{
                    borderColor: theme === "dark" ? "whiteAlpha.600" : "gray.500",
                  }}
                />

                <Checkbox.Label
                  fontSize="md"
                  fontWeight="medium"
                  color={theme === "dark" ? "whiteAlpha.900" : "gray.800"}
                >
                  Allow Overtime
                </Checkbox.Label>
              </Flex>
            </Checkbox.Root>
          </Box>
        </VStack>
      )}

      {/* FULLSCREEN EXIT BUTTON */}
      {isFullscreen && (
        <Box
          position="fixed"
          bottom="40px"
          left="0"
          right="0"
          display="flex"
          justifyContent="center"
          zIndex={99999}
        >
          <Button
            onClick={toggleFullscreen}
            size="lg"
            px={10}
            py={6}
            borderRadius="xl"
            variant="outline"
            bg={theme === "dark" ? "whiteAlpha.100" : "white"}
            color={theme === "dark" ? "white" : "black"}
            border="1px solid"
            borderColor={theme === "dark" ? "whiteAlpha.300" : "gray.300"}
            backdropFilter="blur(12px)"
            boxShadow={
              theme === "dark"
                ? "0 10px 30px rgba(0,0,0,0.4)"
                : "0 10px 30px rgba(0,0,0,0.12)"
            }
            _hover={{
              bg: theme === "dark" ? "whiteAlpha.200" : "gray.50",
              transform: "translateY(-1px)",
            }}
            _active={{
              transform: "translateY(0px)",
            }}
            transition="all 0.2s ease"
          >
            Exit Fullscreen
          </Button>
        </Box>
      )}

      {/* ERROR ALERT */}
      {showError && (
        <Box position="fixed" top="20px" right="20px" zIndex="9999">
          <AlertRoot
            status="warning"
            size="sm"
            variant="subtle"
            borderRadius="md"
            boxShadow="lg"
            maxW="300px"
          >
            <Box flex="1">
              <AlertTitle fontSize="sm">Missing input</AlertTitle>
              <AlertDescription fontSize="xs">
                {error}
              </AlertDescription>
            </Box>

            <CloseButton onClick={() => setShowError(false)} />
          </AlertRoot>
        </Box>
      )}
    </Flex>
  );
}