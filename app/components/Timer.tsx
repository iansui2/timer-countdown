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
  CloseButton,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

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
      bgGradient="radial(gray.900, black)"
      color="white"
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
        fontSize={isFullscreen ? "25rem" : { base: "5xl", md: "10rem", lg: "15rem" }}
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
          bg="whiteAlpha.50"
          backdropFilter="blur(10px)"
          border="1px solid"
          borderColor="whiteAlpha.200"
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
              onChange={(e) => setHours(Number(e.target.value || 0))}
            />
            <Input
              placeholder="Minutes"
              type="number"
              textAlign="center"
              fontSize="xl"
              h="70px"
              onChange={(e) => setMinutes(Number(e.target.value || 0))}
            />
            <Input
              placeholder="Seconds"
              type="number"
              textAlign="center"
              fontSize="xl"
              h="70px"
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
            >
              Fullscreen
            </Button>
          </Flex>

          {/* OVERTIME CHECKBOX */}
          <Box
            w="full"
            display="flex"
            justifyContent="center"
            py={2}
          >
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
                bg="whiteAlpha.100"
                border="1px solid"
                borderColor="whiteAlpha.200"
                _hover={{ bg: "whiteAlpha.200" }}
                transition="all 0.2s ease"
                cursor="pointer"
              >
                <Checkbox.HiddenInput />

                <Checkbox.Control
                  boxSize="6"
                  borderRadius="md"
                />

                <Checkbox.Label
                  fontSize="md"
                  fontWeight="medium"
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
            variant="outline"
            size="lg"
            opacity={0.9}
            bg="blackAlpha.700"
            backdropFilter="blur(10px)"
            px={10}
            py={6}
            borderRadius="xl"
            onClick={toggleFullscreen}
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